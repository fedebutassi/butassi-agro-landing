// pages/404.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Custom404() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-5xl font-bold tracking-tight mb-3">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          La página que buscás no existe o fue movida.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="#contacto">Contacto</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Si creés que es un error, escribinos por el formulario de contacto.
        </p>
      </div>
    </main>
  );
}
