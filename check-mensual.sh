#!/bin/bash
# ============================================================
# Chequeo mensual de mantenimiento — butassihnos.com.ar
# Uso: ./check-mensual.sh
# ============================================================

SITE="https://www.butassihnos.com.ar"
DOMAIN="www.butassihnos.com.ar"
APEX="https://butassihnos.com.ar"

PASS=0
FAIL=0

ok()   { echo "  ✅ $1"; PASS=$((PASS+1)); }
bad()  { echo "  ❌ $1"; FAIL=$((FAIL+1)); }

echo "============================================"
echo " Mantenimiento Butassi Hnos — $(date '+%Y-%m-%d %H:%M')"
echo "============================================"

# --- 1. Uptime: rutas de la SPA -----------------------------
# Nota: es una SPA con rewrite total a index.html en Vercel,
# así que TODAS las rutas devuelven 200 (el 404 es client-side).
echo ""
echo "1) Disponibilidad de rutas"
for path in "/" "/productos" "/pizarra" "/contacto" "/privacidad"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$SITE$path")
  if [ "$code" = "200" ]; then
    ok "$path → $code"
  else
    bad "$path → $code (esperado 200)"
  fi
done

# Apex debe redirigir a www
redirect=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" --max-time 15 "$APEX/")
if echo "$redirect" | grep -q "^30[78] $SITE/"; then
  ok "apex → redirige a www ($redirect)"
else
  bad "apex → $redirect (esperado redirect 307/308 a $SITE/)"
fi

# --- 2. Certificado SSL -------------------------------------
echo ""
echo "2) Certificado SSL"
expiry=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null \
  | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
if [ -n "$expiry" ]; then
  expiry_epoch=$(date -j -f "%b %e %T %Y %Z" "$expiry" +%s 2>/dev/null || date -d "$expiry" +%s 2>/dev/null)
  now_epoch=$(date +%s)
  days_left=$(( (expiry_epoch - now_epoch) / 86400 ))
  if [ "$days_left" -gt 14 ]; then
    ok "SSL vence en $days_left días ($expiry)"
  else
    bad "SSL vence en $days_left días — ¡renovar pronto!"
  fi
else
  bad "No se pudo leer el certificado SSL"
fi

# --- 3. Assets estáticos ------------------------------------
echo ""
echo "3) Assets estáticos"
ASSETS=(
  "/favicon.ico"
  "/robots.txt"
  "/sitemap.xml"
  "/og-image.jpg"
  "/hero-bg.webp"
)
for asset in "${ASSETS[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$SITE$asset")
  if [ "$code" = "200" ]; then
    ok "$asset"
  else
    bad "$asset → $code"
  fi
done

# --- 4. Bundle JS/CSS del build (hashes de Vite) ------------
echo ""
echo "4) Bundle JS/CSS referenciado en index.html"
html=$(curl -s --max-time 15 "$SITE/")
bundles=$(echo "$html" | grep -oE '(src|href)="/assets/[^"]+\.(js|css)"' | sed 's/^[a-z]*="//;s/"$//' | sort -u)
if [ -z "$bundles" ]; then
  bad "No se encontraron bundles /assets/ en index.html"
else
  for b in $bundles; do
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$SITE$b")
    if [ "$code" = "200" ]; then
      ok "$b"
    else
      bad "$b → $code"
    fi
  done
fi

# --- 5. Dependencias del repo -------------------------------
echo ""
echo "5) Dependencias npm (repo local)"
outdated_count=$(cd "$(dirname "$0")" && npm outdated --json 2>/dev/null | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null)
if [ -z "$outdated_count" ]; then
  bad "No se pudo ejecutar npm outdated"
elif [ "$outdated_count" = "0" ]; then
  ok "Todas las dependencias al día"
else
  echo "  🟡 $outdated_count paquetes desactualizados (revisar con: npm outdated)"
  PASS=$((PASS+1))
fi

# --- 6. PageSpeed Insights (mobile) -------------------------
echo ""
echo "6) PageSpeed Insights (mobile) — puede tardar ~30s"
# Opcional: exportar PSI_API_KEY para evitar la cuota anónima compartida
PSI_URL="https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=$SITE/&strategy=mobile&category=performance"
[ -n "$PSI_API_KEY" ] && PSI_URL="$PSI_URL&key=$PSI_API_KEY"
psi=$(curl -s --max-time 90 "$PSI_URL")
score=$(echo "$psi" | python3 -c "import sys,json; d=json.load(sys.stdin); print(int(d['lighthouseResult']['categories']['performance']['score']*100))" 2>/dev/null)
if [ -n "$score" ]; then
  if [ "$score" -ge 85 ]; then
    ok "Performance mobile: $score/100 (objetivo: 85+)"
  else
    bad "Performance mobile: $score/100 — por debajo del objetivo 85"
  fi
else
  api_err=$(echo "$psi" | python3 -c "import sys,json; print(json.load(sys.stdin)['error']['message'])" 2>/dev/null)
  bad "PageSpeed no disponible: ${api_err:-sin respuesta}. Reintentar más tarde o usar PSI_API_KEY."
fi

# --- 7. Chequeos manuales (recordatorio) --------------------
echo ""
echo "7) Chequeos manuales pendientes (no automatizables):"
echo "  📋 Enviar un test al formulario de contacto y verificar que llegue el mail (edge function send-contact)"
echo "  📋 Verificar que la pizarra muestre precios y que el clima/noticias carguen (edge functions weather / agro-news)"
echo "  📋 Supabase: revisar que el proyecto no esté pausado por inactividad (plan free)"
echo "  📋 GA4: visitas del mes vs. anterior + fuentes de tráfico"
echo "  📋 Search Console: errores de indexación, clicks e impresiones"
echo "  📋 Verificar vencimiento del dominio butassihnos.com.ar (NIC.ar)"

# --- Resumen ------------------------------------------------
echo ""
echo "============================================"
echo " Resultado: $PASS OK / $FAIL con problemas"
echo "============================================"
[ "$FAIL" = "0" ] && exit 0 || exit 1
