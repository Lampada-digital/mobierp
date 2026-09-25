import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, Phone, Menu, X } from 'lucide-react';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">ImobERP</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <link.icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
              <Link
                to="/admin"
                className="ml-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Admin
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  location.pathname === link.to ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600"
            >
              Painel Admin
            </Link>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 size={18} className="text-white" />
                </div>
                <span className="font-bold text-xl text-white">ImobERP</span>
              </div>
              <p className="text-sm">
                Sua imobiliária de confiança. Encontre o imóvel ideal para você e sua família.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Links</h4>
              <div className="space-y-2 text-sm">
                <Link to="/" className="block hover:text-white">Início</Link>
                <Link to="/imoveis" className="block hover:text-white">Imóveis</Link>
                <Link to="/contato" className="block hover:text-white">Contato</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Contato</h4>
              <div className="space-y-2 text-sm">
                <p>📞 (11) 3456-7890</p>
                <p>📧 contato@imob.com.br</p>
                <p>📍 Av. Paulista, 1000 - São Paulo/SP</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2024 ImobERP. Todos os direitos reservados. CRECI: 12345-J</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
