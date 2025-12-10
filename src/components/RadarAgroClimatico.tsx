import { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
  Newspaper,
  ChevronLeft,
  ChevronRight
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
        lat: -32.1731,
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

// Función para obtener noticias agropecuarias desde RSS (ahora devuelve array)
const fetchNewsFromAPI = async (): Promise<NewsData[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('agro-news');

    if (error) {
      console.error('Error fetching news:', error);
      throw error;
    }

    if (data?.noticias && data.noticias.length > 0) {
      return data.noticias.slice(0, 3).map((noticia: any) => ({
        titulo: noticia.titulo,
        resumen: noticia.resumen,
        fuente: noticia.fuente,
        fuenteNombre: noticia.fuenteNombre,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error in fetchNewsFromAPI:', error);
    return [];
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
  const [newsList, setNewsList] = useState<NewsData[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
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
      
      if (newsData.length > 0) {
        setNewsList(newsData);
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

  const nextNews = useCallback(() => {
    setCurrentNewsIndex((prev) => (prev + 1) % newsList.length);
  }, [newsList.length]);

  const prevNews = () => {
    setCurrentNewsIndex((prev) => (prev - 1 + newsList.length) % newsList.length);
  };

  useEffect(() => {
    loadData(false);
    const interval = setInterval(() => loadData(false), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate news every 6 seconds
  useEffect(() => {
    if (newsList.length > 1) {
      const newsInterval = setInterval(nextNews, 6000);
      return () => clearInterval(newsInterval);
    }
  }, [newsList.length, nextNews]);

  const currentNews = newsList[currentNewsIndex];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-primary/5 via-accent/5 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              RADAR AGRO-CLIMÁTICO
            </h2>
            <div className="h-1 w-12 bg-gradient-to-r from-accent to-primary rounded-full" />
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            {location || "Zona Rural Centro-Sur de Córdoba, Argentina"}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-2 text-primary hover:text-primary/80 hover:bg-primary/10"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Clima Actual */}
          <Card className="bg-card border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
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
                      className="h-16 w-16 text-accent"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="h-4 w-4 text-secondary" />
                    <span className="text-muted-foreground">
                      Humedad: <strong className="text-foreground">{weather.humedad}%</strong>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize bg-primary/5 px-2 py-1 rounded">
                    {weather.descripcion}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Pronóstico 24h */}
          <Card className="bg-card border-secondary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-secondary to-primary" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-secondary">
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
                  <div className="flex items-center justify-between p-2 rounded bg-secondary/5">
                    <div className="flex items-center gap-2 text-sm">
                      <CloudRain className="h-4 w-4 text-secondary" />
                      <span className="text-muted-foreground">Prob. Lluvia:</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {forecast.probabilidadLluvia}% ({forecast.precipitacion}mm)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-secondary/5">
                    <div className="flex items-center gap-2 text-sm">
                      <Wind className="h-4 w-4 text-secondary" />
                      <span className="text-muted-foreground">Viento:</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {forecast.viento} km/h {forecast.direccionViento}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-secondary/5">
                    <div className="flex items-center gap-2 text-sm">
                      <Gauge className="h-4 w-4 text-secondary" />
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

          {/* Card 3: Noticias Agro Carrusel */}
          <Card className="bg-card border-accent/30 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-accent to-accent/60" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
                  <Newspaper className="h-5 w-5 text-accent" />
                  Noticias Agro
                </CardTitle>
                {newsList.length > 1 && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-accent/20"
                      onClick={prevNews}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground min-w-[3ch] text-center">
                      {currentNewsIndex + 1}/{newsList.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-accent/20"
                      onClick={nextNews}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading || newsList.length === 0 ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-8 bg-muted rounded w-1/3 mt-4" />
                </div>
              ) : currentNews ? (
                <div className="space-y-3 min-h-[120px]">
                  <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 transition-all duration-300">
                    {currentNews.titulo}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {currentNews.resumen}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    {currentNews.fuenteNombre && (
                      <span className="text-xs text-accent font-medium">
                        {currentNews.fuenteNombre}
                      </span>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs border-accent/50 hover:bg-accent/20 hover:border-accent"
                      onClick={() => window.open(currentNews.fuente, "_blank")}
                    >
                      Leer más
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  {/* Indicadores de carrusel */}
                  {newsList.length > 1 && (
                    <div className="flex justify-center gap-1.5 pt-2">
                      {newsList.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentNewsIndex(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentNewsIndex 
                              ? 'w-4 bg-accent' 
                              : 'w-1.5 bg-accent/30 hover:bg-accent/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
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
