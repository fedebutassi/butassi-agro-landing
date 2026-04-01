# Butassi Hnos. — Landing Web

Sitio web de **Butassi Hnos.**, empresa familiar de Corralito, Córdoba, dedicada a la compra y venta de cereales, agroquímicos y servicios de apoyo agrícola.

**URL de producción:** https://butassihnos.com.ar

## Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (auth, storage, Edge Functions)
- **Email:** Resend (formulario de contacto)
- **Hosting:** GitHub Pages (deploy automático via GitHub Actions)
- **Analytics:** Google Analytics 4 (opcional, requiere consentimiento)
- **Error tracking:** Sentry (opcional)

## Setup local

### 1. Clonar e instalar

```bash
git clone https://github.com/federicobutassi/butassi-agro-landing.git
cd butassi-agro-landing
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Completar `.env.local` con los valores reales. Las variables obligatorias son:

| Variable | Descripción |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon key de Supabase |
| `VITE_SUPABASE_PROJECT_ID` | ID del proyecto Supabase |
| `VITE_CONTACT_EMAIL` | Email de destino del formulario |
| `VITE_WHATSAPP_NUMBER` | Número de WhatsApp (formato: 5493571XXXXXX) |

Las variables opcionales (`VITE_GA_MEASUREMENT_ID`, `VITE_SENTRY_DSN`, URLs de redes sociales) simplemente no activan esas funcionalidades si están vacías.

### 3. Iniciar en desarrollo

```bash
npm run dev
```

Abre http://localhost:8080

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Linting con ESLint |
| `npm run typecheck` | Verificación de tipos con TypeScript |
| `npm run test` | Ejecutar tests |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con reporte de cobertura |

## Deploy

El deploy a producción es **automático** al hacer push a `main`:

```
git push origin main
# → GitHub Actions buildea y despliega en ~2-3 minutos
```

Para staging, hacer push a `develop` genera un artefacto de build sin publicarlo automáticamente.

### Variables en GitHub Actions

Configurar en **Settings → Secrets and variables → Actions → Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_CONTACT_EMAIL`
- `VITE_WHATSAPP_NUMBER`
- `VITE_GA_MEASUREMENT_ID` (opcional)
- `VITE_SENTRY_DSN` (opcional)

## Supabase

### Edge Functions

| Función | Descripción |
|---|---|
| `send-contact` | Envía el formulario de contacto via Resend |
| `weather` | Datos meteorológicos para el Radar Agro-Climático |
| `agro-news` | Noticias agropecuarias via RSS |

#### Variables de entorno en Supabase

Configurar en **Supabase Dashboard → Settings → Edge Functions**:

- `RESEND_API_KEY` — API key de [Resend](https://resend.com)
- `CONTACT_EMAIL` — Email de destino

### RLS (Row Level Security)

Para proteger el bucket `pizarra` ejecutar en **SQL Editor**:

```sql
-- Ver archivo supabase/rls-pizarra.sql
```

## Estructura del proyecto

```
src/
  components/       # Componentes reutilizables
    ui/             # shadcn/ui primitives
  hooks/            # Custom hooks (useAuth, useAnalytics)
  integrations/
    supabase/       # Cliente Supabase y tipos generados
  pages/            # Páginas de la aplicación
  test/             # Tests unitarios
supabase/
  functions/        # Edge Functions de Supabase
  rls-pizarra.sql   # Políticas RLS para Storage
public/
  sitemap.xml       # Sitemap para SEO
  robots.txt        # Directivas para crawlers
```

## Pre-push hooks

Husky ejecuta automáticamente antes de cada push:
1. `typecheck` — verifica que no haya errores de TypeScript
2. `test` — corre la suite de tests

Para saltear en casos de emergencia (no recomendado): `git push --no-verify`
