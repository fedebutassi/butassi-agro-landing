import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  Droplets, 
  Wind, 
  Thermometer, 
  Gauge, 
  ExternalLink,
  Sun,
  CloudRain,
  CloudSun
} from "lucide-react";

// Placeholder para configuración de API
const API_CONFIG = {
  // Reemplazar con tu API key de OpenWeatherMap u otro servicio
  API_KEY: "TU_API_KEY_AQUI",
  // Coordenadas aproximadas de Río Tercero, Córdoba
  LAT: -32.1731,
  LON: -64.1147,
  BASE_URL: "https://api.openweathermap.org/data/2.5"
};

type WeatherData = {
  temperatura: number;
  sensacionTermica: number;
  humedad: number;
  condicion: "soleado" | "nublado" | "parcial" | "lluvia";
  descripcion: string;
};

type ForecastData = {
  probabilidadLluvia: number;
  precipitacion: number;
  viento: number;
  direccionViento: string;
  presion: number;
};

type NewsData = {
  titulo: string;
  resumen: string;
  fuente: string;
};

// Función placeholder para fetch de datos climáticos
const fetchWeatherData = async (): Promise<WeatherData> => {
  // TODO: Implementar llamada real a la API
  // Ejemplo de llamada real:
  // const response = await fetch(
  //   `${API_CONFIG.BASE_URL}/weather?lat=${API_CONFIG.LAT}&lon=${API_CONFIG.LON}&appid=${API_CONFIG.API_KEY}&units=metric&lang=es`
  // );
  // const data = await response.json();
  // return parseWeatherResponse(data);

  // Datos simulados para demostración
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        temperatura: 24,
        sensacionTermica: 26,
        humedad: 58,
        condicion: "parcial",
        descripcion: "Parcialmente nublado"
      });
    }, 500);
  });
};

// Función placeholder para fetch de pronóstico
const fetchForecastData = async (): Promise<ForecastData> => {
  // TODO: Implementar llamada real a la API
  // Ejemplo:
  // const response = await fetch(
  //   `${API_CONFIG.BASE_URL}/forecast?lat=${API_CONFIG.LAT}&lon=${API_CONFIG.LON}&appid=${API_CONFIG.API_KEY}&units=metric&lang=es`
  // );
  // const data = await response.json();
  // return parseForecastResponse(data);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        probabilidadLluvia: 35,
        precipitacion: 12,
        viento: 18,
        direccionViento: "SE",
        presion: 1015
      });
    }, 500);
  });
};

// Función placeholder para fetch de noticias
const fetchNewsData = async (): Promise<NewsData> => {
  // TODO: Integrar con API de noticias agrícolas o RSS feed
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        titulo: "Buenas perspectivas para la cosecha de soja en la región centro",
        resumen: "Los productores de la zona rural de Río Tercero y alrededores reportan condiciones óptimas para el desarrollo del cultivo de soja de primera.",
        fuente: "https://www.infocampo.com.ar"
      });
    }, 500);
  });
};

const WeatherIcon = ({ condicion, className }: { condicion: string; className?: string }) => {
  switch (condicion) {
    case "soleado":
      return <Sun className={className} />;
    case "lluvia":
      return <CloudRain className={className} />;
    case "parcial":
      return <CloudSun className={className} />;
    default:
      return <Cloud className={className} />;
  }
};

const RadarAgroClimatico = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [news, setNews] = useState<NewsData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [weatherData, forecastData, newsData] = await Promise.all([
        fetchWeatherData(),
        fetchForecastData(),
        fetchNewsData()
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
      setNews(newsData);
      setLastUpdate(new Date().toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }));
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Actualizar cada 15 minutos
    const interval = setInterval(loadData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-emerald-900/10 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            RADAR AGRO-CLIMÁTICO
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Zona Rural Centro-Sur de Córdoba, Argentina
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Clima Actual */}
          <Card className="bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/30 dark:to-background border-sky-200/50 dark:border-sky-800/30 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-sky-800 dark:text-sky-300">
                <Thermometer className="h-5 w-5" />
                Clima Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !weather ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-16 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold text-foreground">
                        {weather.temperatura}°C
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sensación: {weather.sensacionTermica}°C
                      </p>
                    </div>
                    <WeatherIcon 
                      condicion={weather.condicion} 
                      className="h-16 w-16 text-sky-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="h-4 w-4 text-sky-600" />
                    <span className="text-muted-foreground">
                      Humedad: <strong className="text-foreground">{weather.humedad}%</strong>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">
                    {weather.descripcion}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Pronóstico 24h */}
          <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background border-emerald-200/50 dark:border-emerald-800/30 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <Cloud className="h-5 w-5" />
                Pronóstico 24h
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !forecast ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <CloudRain className="h-4 w-4 text-emerald-600" />
                      <span className="text-muted-foreground">Prob. Lluvia:</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {forecast.probabilidadLluvia}% ({forecast.precipitacion}mm)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Wind className="h-4 w-4 text-emerald-600" />
                      <span className="text-muted-foreground">Viento:</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {forecast.viento} km/h {forecast.direccionViento}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Gauge className="h-4 w-4 text-emerald-600" />
                      <span className="text-muted-foreground">Presión:</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {forecast.presion} hPa
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Noticia Relevante */}
          <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-background border-amber-200/50 dark:border-amber-800/30 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <ExternalLink className="h-5 w-5" />
                Noticia Agro
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !news ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-8 bg-muted rounded w-1/3 mt-4" />
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground text-sm leading-tight">
                    {news.titulo}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {news.resumen}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2 text-xs border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/30"
                    onClick={() => window.open(news.fuente, "_blank")}
                  >
                    Ver Fuente
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer con timestamp */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Última actualización: {lastUpdate || "Cargando..."}
        </p>
      </div>
    </section>
  );
};

export default RadarAgroClimatico;
