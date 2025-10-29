// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-5xl font-bold tracking-tight mb-3">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          La página que buscás no existe o fue movida.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="px-4 py-2 rounded bg-primary text-primary-foreground">
            Volver al inicio
          </Link>
          <a href="/#contacto" className="px-4 py-2 rounded border">
            Contacto
          </a>
        </div>
      </div>
    </main>
  );
}
