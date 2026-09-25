import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Home, Users, Settings, FileText, LogOut,
  Menu, X, Building2, ChevronRight, Bell
} from 'lucide-react';
import { useState } from 'react';
import { getAuth, logout } from '../lib/auth';

interface LayoutAdminProps {
  children: ReactNode;
}

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/imoveis', label: 'Imóveis', icon: Home },
  { to: '/admin/leads', label: 'Leads', icon: Users },
  { to: '/admin/financeiro', label: 'Financeiro', icon: FileText, badge: 'Em breve' },
  { to: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];

export function LayoutAdmin({ children }: LayoutAdminProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200">
      {/* Logo */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-neutral-100 flex-shrink-0">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-600 to-brand-800 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-neutral-900 text-sm leading-tight font-display">ImobERP</p>
            <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Admin</p>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
          Menu principal
        </p>
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-600 rounded-r-full" />
              )}
              <item.icon size={18} className={active ? 'text-brand-600' : 'text-neutral-400 group-hover:text-neutral-600'} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                  {item.badge}
                </span>
              )}
              {active && <ChevronRight size={14} className="text-brand-600" />}
            </Link>
          );
        })}
      </nav>

      {/* Usuário */}
      <div className="border-t border-neutral-100 p-3">
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors text-left"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {auth?.usuario.nome.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">{auth?.usuario.nome}</p>
              <p className="text-xs text-neutral-500 capitalize">{auth?.usuario.papel}</p>
            </div>
            <ChevronRight size={14} className={`text-neutral-400 transition-transform ${userMenuOpen ? 'rotate-90' : ''}`} />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-20 animate-scale-in">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  Ver site público
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={14} />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 z-50 animate-slide-in-right" style={{ animation: 'slideInRight 0.3s var(--ease-out)' }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-neutral-100 text-neutral-700"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-neutral-400">Admin</span>
              <ChevronRight size={14} className="text-neutral-300" />
              <span className="text-neutral-900 font-medium">
                {navItems.find((i) => isActive(i.to))?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 relative"
              aria-label="Notificações"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-200 ml-1">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                {auth?.usuario.nome.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-neutral-900 leading-tight">{auth?.usuario.nome}</p>
                <p className="text-xs text-neutral-500 capitalize">{auth?.usuario.papel}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
