import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import "@/styles/globals.css"; // ajustá la ruta si tu CSS global está en otra carpeta

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster richColors position="top-right" />
    </>
  );
}
