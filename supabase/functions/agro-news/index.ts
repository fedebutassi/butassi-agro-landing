import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// RSS feeds de noticias agropecuarias argentinas
const RSS_FEEDS = [
  'https://www.infocampo.com.ar/feed/',
  'https://bichosdecampo.com/feed/',
];

type NewsItem = {
  titulo: string;
  resumen: string;
  fuente: string;
  fecha: string;
  fuenteNombre: string;
};

// Función simple para parsear XML
function parseXMLValue(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  if (match) {
    return (match[1] || match[2] || '').trim();
  }
  return '';
}

// Limpiar HTML del resumen
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchRSSFeed(url: string): Promise<NewsItem[]> {
  try {
    console.log(`Fetching RSS from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    });

    if (!response.ok) {
      console.error(`Error fetching ${url}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    console.log(`Received ${xml.length} bytes from ${url}`);
    
    // Extraer items del RSS
    const items: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    
    // Obtener nombre de la fuente
    const channelTitle = parseXMLValue(xml, 'title') || new URL(url).hostname;
    
    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
      const itemXml = match[1];
      
      const titulo = stripHtml(parseXMLValue(itemXml, 'title'));
      const descripcion = stripHtml(parseXMLValue(itemXml, 'description'));
      const link = parseXMLValue(itemXml, 'link');
      const pubDate = parseXMLValue(itemXml, 'pubDate');
      
      if (titulo && link) {
        items.push({
          titulo,
          resumen: descripcion.substring(0, 200) + (descripcion.length > 200 ? '...' : ''),
          fuente: link,
          fecha: pubDate,
          fuenteNombre: channelTitle.replace(' - RSS', '').replace(' RSS', ''),
        });
      }
    }
    
    console.log(`Parsed ${items.length} items from ${url}`);
    return items;
  } catch (error) {
    console.error(`Error processing ${url}:`, error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching agro news from RSS feeds...');
    
    // Intentar obtener noticias de múltiples fuentes
    const allNews: NewsItem[] = [];
    
    for (const feedUrl of RSS_FEEDS) {
      const news = await fetchRSSFeed(feedUrl);
      allNews.push(...news);
      if (allNews.length >= 5) break;
    }
    
    // Si no hay noticias de RSS, usar noticias de respaldo
    if (allNews.length === 0) {
      console.log('No RSS news found, using fallback');
      allNews.push({
        titulo: "El clima favorable impulsa las expectativas de cosecha en la región pampeana",
        resumen: "Las lluvias de las últimas semanas han mejorado significativamente las condiciones para los cultivos de verano en la zona núcleo agrícola.",
        fuente: "https://www.infocampo.com.ar",
        fecha: new Date().toISOString(),
        fuenteNombre: "Infocampo"
      });
    }
    
    // Ordenar por fecha (más recientes primero)
    allNews.sort((a, b) => {
      const dateA = new Date(a.fecha || 0).getTime();
      const dateB = new Date(b.fecha || 0).getTime();
      return dateB - dateA;
    });

    const result = {
      noticias: allNews.slice(0, 5),
      timestamp: new Date().toISOString(),
    };

    console.log(`Returning ${result.noticias.length} news items`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in agro-news function:', error);
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
