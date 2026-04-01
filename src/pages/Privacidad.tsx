import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Privacidad = () => (
  <div className="min-h-screen">
    <Navbar />
    <main className="pt-20">
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold text-foreground mb-2">Política de Privacidad</h1>
          <p className="text-muted-foreground mb-8">Última actualización: abril 2026</p>

          <div className="prose prose-neutral max-w-none space-y-8 text-foreground">

            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Responsable del tratamiento</h2>
              <p className="text-muted-foreground">
                <strong>Butassi Hnos.</strong> — Corralito, Córdoba, Argentina.<br />
                Contacto: <a href="mailto:federicobuta51@gmail.com" className="text-primary underline">federicobuta51@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Datos que recopilamos</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Formulario de contacto:</strong> nombre, email, teléfono (opcional) y mensaje.</li>
                <li><strong>Datos de uso:</strong> páginas visitadas, duración de la visita y dispositivo (a través de Google Analytics, solo si aceptaste las cookies).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Finalidad</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Responder consultas enviadas a través del formulario de contacto.</li>
                <li>Analizar el uso del sitio para mejorar la experiencia (solo con consentimiento).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Base legal</h2>
              <p className="text-muted-foreground">
                El tratamiento de datos del formulario se basa en el consentimiento del usuario al enviar el formulario (Ley 25.326 de Protección de Datos Personales de Argentina).
                El uso de Google Analytics se realiza solo con tu consentimiento explícito.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Cookies</h2>
              <p className="text-muted-foreground">
                Utilizamos cookies de analítica de Google Analytics (GA4) únicamente si aceptaste el aviso de cookies.
                Podés revocar tu consentimiento en cualquier momento recargando la página y rechazando las cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Terceros</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Supabase</strong> (almacenamiento de datos e infraestructura)</li>
                <li><strong>Resend</strong> (envío de emails del formulario de contacto)</li>
                <li><strong>Google Analytics</strong> (analítica, solo con consentimiento)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Retención de datos</h2>
              <p className="text-muted-foreground">
                Los datos del formulario de contacto se conservan por el tiempo necesario para responder la consulta y hasta 1 año adicional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Tus derechos</h2>
              <p className="text-muted-foreground">
                Conforme a la Ley 25.326, tenés derecho a acceder, rectificar, suprimir y oponerte al tratamiento de tus datos personales.
                Podés ejercerlos escribiendo a <a href="mailto:federicobuta51@gmail.com" className="text-primary underline">federicobuta51@gmail.com</a>.
              </p>
            </section>

          </div>

          <div className="mt-10">
            <Link to="/" className="text-primary underline">← Volver al inicio</Link>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Privacidad;
