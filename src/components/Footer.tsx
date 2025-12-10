import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com",
      label: "Facebook"
    },
    {
      icon: Instagram,
      href: "https://instagram.com",
      label: "Instagram"
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com",
      label: "LinkedIn"
    }
  ];

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
            <div>
              <h4 className="text-lg font-semibold mb-4">Seguinos</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
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
          </div>

          {/* Divider */}
          <div className="border-t border-primary-foreground/20 my-8"></div>

          {/* Copyright */}
          <div className="text-center text-primary-foreground/80">
            <p>© {currentYear} Butassi Hnos. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
