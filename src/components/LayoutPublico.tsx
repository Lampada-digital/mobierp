import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, Phone, Menu, X, Instagram, Facebook, Linkedin, Mail, Phone as PhoneIcon, MapPin } from 'lucide-react';

interface LayoutPublicoProps {
  children: ReactNode;
}

export function LayoutPublico({ children }: LayoutPublicoProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Início', icon: Home },
    { to: '/imoveis', label: 'Imóveis', icon: Building2 },
    { to: '/contato', label: 'Contato', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-600 to-brand-800 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-neutral-900 font-display leading-tight block">ImobERP</span>
                <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider hidden sm:block">Imobiliária</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active ? 'text-brand-700' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
              <Link
                to="/admin"
                className="ml-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Área do Corretor
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -mr-2 rounded-lg hover:bg-neutral-100 text-neutral-700"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-neutral-100 bg-white animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-neutral-100">
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <Building2 size={18} />
                  Área do Corretor
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                  <Building2 size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-xl text-white font-display">ImobERP</p>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider">Imobiliária</p>
                </div>
              </div>
              <p className="text-sm text-neutral-400 max-w-md leading-relaxed mb-6">
                Sua imobiliária de confiança. Encontre o imóvel ideal para você e sua família
                com atendimento personalizado e as melhores condições do mercado.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-9 h-9 bg-neutral-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors">
                  <Instagram size={16} />
                </a>
                <a href="#" className="w-9 h-9 bg-neutral-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="#" className="w-9 h-9 bg-neutral-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors">
                  <Linkedin size={16} />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Navegação</h4>
              <div className="space-y-2.5 text-sm">
                <Link to="/" className="block hover:text-white transition-colors">Início</Link>
                <Link to="/imoveis" className="block hover:text-white transition-colors">Imóveis</Link>
                <Link to="/contato" className="block hover:text-white transition-colors">Contato</Link>
                <Link to="/admin" className="block hover:text-white transition-colors">Área do Corretor</Link>
              </div>
            </div>

            {/* Contato */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Contato</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <PhoneIcon size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>(11) 3456-7890</p>
                    <p className="text-neutral-400 text-xs">(11) 99999-8888</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
                  <p>contato@imob.com.br</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
                  <p>Av. Paulista, 1000<br />Bela Vista, São Paulo/SP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} ImobERP. Todos os direitos reservados. CRECI: 12345-J</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
