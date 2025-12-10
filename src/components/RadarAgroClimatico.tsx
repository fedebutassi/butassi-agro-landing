import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Cloud, 
  Droplets, 
  Wind, 
  Thermometer, 
  Gauge, 
  ExternalLink,
  Sun,
  CloudRain,
  CloudSun,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

type WeatherData = {
  temperatura: number;
  sensacionTermica: number;
  humedad: number;
  condicion: "soleado" | "nublado" | "parcial" | "lluvia" | "nieve";
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
  fuenteNombre?: string;
};

// Función para obtener datos del clima desde el backend
const fetchWeatherFromAPI = async (): Promise<{ weather: WeatherData; forecast: ForecastData; location: string } | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('weather', {
      body: {
        lat: -32.1731, // Río Tercero, Córdoba
        lon: -64.1147
      }
    });

    if (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchWeatherFromAPI:', error);
    return null;
  }
};

// Función para obtener noticias agropecuarias desde RSS
const fetchNewsFromAPI = async (): Promise<NewsData | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('agro-news');

    if (error) {
      console.error('Error fetching news:', error);
      throw error;
    }

    if (data?.noticias && data.noticias.length > 0) {
      const noticia = data.noticias[0];
      return {
        titulo: noticia.titulo,
        resumen: noticia.resumen,
        fuente: noticia.fuente,
        fuenteNombre: noticia.fuenteNombre,
      };
    }
    return null;
  } catch (error) {
    console.error('Error in fetchNewsFromAPI:', error);
    return null;
  }
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
  const [location, setLocation] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (showToast = false) => {
    if (showToast) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const [apiData, newsData] = await Promise.all([
        fetchWeatherFromAPI(),
        fetchNewsFromAPI()
      ]);
      
      if (apiData) {
        setWeather(apiData.weather);
        setForecast(apiData.forecast);
        setLocation(apiData.location || "Córdoba Rural");
        if (showToast) {
          toast.success("Datos actualizados");
        }
      } else {
        if (showToast) {
          toast.error("Error al obtener datos del clima");
        }
      }
      
      if (newsData) {
        setNews(newsData);
      }
      setLastUpdate(new Date().toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }));
    } catch (error) {
      console.error("Error al cargar datos:", error);
      if (showToast) {
        toast.error("Error al actualizar");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadData(true);
  };

  useEffect(() => {
    loadData(false);
    // Actualizar cada 15 minutos
    const interval = setInterval(() => loadData(false), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-emerald-900/10 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              RADAR AGRO-CLIMÁTICO
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            {location || "Zona Rural Centro-Sur de Córdoba, Argentina"}
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
                  <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
                    {news.titulo}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {news.resumen}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    {news.fuenteNombre && (
                      <span className="text-xs text-amber-700 dark:text-amber-400">
                        {news.fuenteNombre}
                      </span>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/30"
                      onClick={() => window.open(news.fuente, "_blank")}
                    >
                      Leer más
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
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
