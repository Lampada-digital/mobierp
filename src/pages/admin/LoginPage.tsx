import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { login } from '../../lib/auth';
import { Input, Button } from '../../components/ui';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    setTimeout(() => {
      const result = login(email, senha);
      if (result) {
        navigate('/admin/dashboard');
      } else {
        setErro('Email ou senha inválidos');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-brand-50/30 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }} />

      <div className="w-full max-w-md relative animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl shadow-lg shadow-brand-600/20 mb-4">
            <Building2 size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 font-display">Área do Corretor</h1>
          <p className="text-neutral-500 text-sm mt-1">Faça login para acessar o painel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-neutral-900/5 border border-neutral-200/50 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {erro && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 animate-fade-in">
                <AlertCircle size={16} className="flex-shrink-0" />
                {erro}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              required
              placeholder="admin@imob.com"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Senha"
              type="password"
              required
              placeholder="••••••••"
              icon={<Lock size={16} />}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <Button type="submit" className="w-full" size="lg" loading={loading} iconRight={<ArrowRight size={16} />}>
              Entrar
            </Button>
          </form>

          <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <p className="text-xs font-semibold text-neutral-600 mb-2 uppercase tracking-wider">Credenciais de teste</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-neutral-100">
                <div>
                  <p className="font-semibold text-neutral-900">Admin</p>
                  <p className="text-neutral-500">admin@imob.com</p>
                </div>
                <button
                  onClick={() => { setEmail('admin@imob.com'); setSenha('admin123'); }}
                  className="text-brand-600 hover:text-brand-700 font-medium text-xs"
                >
                  Usar
                </button>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-neutral-100">
                <div>
                  <p className="font-semibold text-neutral-900">Corretor</p>
                  <p className="text-neutral-500">carlos@imob.com</p>
                </div>
                <button
                  onClick={() => { setEmail('carlos@imob.com'); setSenha('corretor123'); }}
                  className="text-brand-600 hover:text-brand-700 font-medium text-xs"
                >
                  Usar
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-6">
          <a href="#/" className="text-brand-600 hover:text-brand-700 font-medium">← Voltar ao site</a>
        </p>
      </div>
    </div>
  );
}
