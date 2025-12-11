import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Coordenadas de la zona rural centro-sur de Córdoba (Río Tercero)
const DEFAULT_LAT = -32.1731;
const DEFAULT_LON = -64.1147;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY');
    
    if (!apiKey) {
      console.error('OPENWEATHERMAP_API_KEY no configurada');
      throw new Error('API key no configurada');
    }

    const { lat = DEFAULT_LAT, lon = DEFAULT_LON } = await req.json().catch(() => ({}));

    console.log(`Fetching weather for lat: ${lat}, lon: ${lon}`);

    // Fetch current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`
    );

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error('OpenWeatherMap error:', weatherResponse.status, errorText);
      throw new Error(`Error de API: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    console.log('Weather data received:', JSON.stringify(weatherData));

    // Fetch forecast for precipitation probability
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es&cnt=8`
    );

    let forecastData = null;
    if (forecastResponse.ok) {
      forecastData = await forecastResponse.json();
      console.log('Forecast data received');
    }

    // Map weather condition to our icons
    const mapCondition = (weatherId: number): string => {
      if (weatherId >= 200 && weatherId < 600) return "lluvia";
      if (weatherId >= 600 && weatherId < 700) return "nieve";
      if (weatherId >= 700 && weatherId < 800) return "nublado";
      if (weatherId === 800) return "soleado";
      if (weatherId > 800) return "parcial";
      return "nublado";
    };

    // Calculate precipitation probability from forecast
    let probLluvia = 0;
    let precipitacion = 0;
    if (forecastData?.list) {
      const next24h = forecastData.list.slice(0, 8);
      probLluvia = Math.round(
        next24h.reduce((max: number, item: any) => Math.max(max, (item.pop || 0) * 100), 0)
      );
      precipitacion = Math.round(
        next24h.reduce((sum: number, item: any) => sum + (item.rain?.['3h'] || 0), 0) * 10
      ) / 10;
    }

    // Wind direction mapping
    const getWindDirection = (deg: number): string => {
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
      const index = Math.round(deg / 45) % 8;
      return directions[index];
    };

    const result = {
      weather: {
        temperatura: Math.round(weatherData.main.temp),
        sensacionTermica: Math.round(weatherData.main.feels_like),
        humedad: weatherData.main.humidity,
        condicion: mapCondition(weatherData.weather[0].id),
        descripcion: weatherData.weather[0].description,
      },
      forecast: {
        probabilidadLluvia: probLluvia,
        precipitacion: precipitacion,
        viento: Math.round(weatherData.wind.speed * 3.6), // m/s to km/h
        direccionViento: getWindDirection(weatherData.wind.deg || 0),
        presion: weatherData.main.pressure,
      },
      location: weatherData.name,
      timestamp: new Date().toISOString(),
    };

    console.log('Returning result:', JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in weather function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
