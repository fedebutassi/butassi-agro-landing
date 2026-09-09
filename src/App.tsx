// src/App.tsx
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import CookieConsent from "@/components/CookieConsent";

const Index = lazy(() => import("./pages/Index"));
const Productos = lazy(() => import("./pages/Productos"));
const Pizarra = lazy(() => import("./pages/Pizarra"));
const Contacto = lazy(() => import("./pages/Contacto"));
const Privacidad = lazy(() => import("./pages/Privacidad"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Cargando">
                  <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/pizarra" element={<Pizarra />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/privacidad" element={<Privacidad />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <CookieConsent />
          </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
