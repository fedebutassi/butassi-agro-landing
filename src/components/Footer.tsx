import { Link } from "react-router-dom";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FacebookIcon, href: import.meta.env.VITE_FACEBOOK_URL ?? "", label: "Facebook" },
    { icon: InstagramIcon, href: import.meta.env.VITE_INSTAGRAM_URL ?? "", label: "Instagram" },
    { icon: LinkedinIcon, href: import.meta.env.VITE_LINKEDIN_URL ?? "", label: "LinkedIn" },
  ].filter((s) => s.href.length > 0);

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Butassi Hnos.</h3>
              <p className="text-primary-foreground/80 mb-4">
                Servicios de apoyo agrícola. Comercialización de cereales y agroquímicos.
              </p>
              <p className="text-primary-foreground/80">
                Corralito, Córdoba, Argentina
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/productos"
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    Productos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pizarra"
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    Pizarra
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contacto"
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            {socialLinks.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-4">Seguinos</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-primary-foreground/20 my-8"></div>

          {/* Copyright */}
          <div className="text-center text-primary-foreground/80">
            <p>© {currentYear} Butassi Hnos. Todos los derechos reservados. Realizado por <a href="https://wa.me/543571327923?text=Hola%2C%20vi%20que%20realizaste%20la%20pagina%20para%20ButassiHnos%2C%20me%20interesaria%20saber%20mas%20sobre%20tus%20servicios." target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-foreground transition-colors">NextLevel</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
