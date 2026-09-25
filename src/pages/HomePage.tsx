import { Link } from 'react-router-dom';
import { Search, ArrowRight, Building2, Home, TrendingUp, Shield, Sparkles, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { getImoveis } from '../lib/storage';
import { ImovelCard } from '../components/ImovelCard';
import { Button, Select } from '../components/ui';
import { Imovel } from '../types';

export function HomePage() {
  const [buscaRapida, setBuscaRapida] = useState('');
  const [tipoRapido, setTipoRapido] = useState('');
  const [finalidadeRapida, setFinalidadeRapida] = useState('');

  const { dados: destaqueImoveis } = getImoveis({ status: 'disponivel' }, 1, 3);
  const totalImoveis = getImoveis().paginacao.total;

  const handleBuscaRapida = () => {
    const params = new URLSearchParams();
    if (buscaRapida) params.set('busca', buscaRapida);
    if (tipoRapido) params.set('tipo', tipoRapido);
    if (finalidadeRapida) params.set('finalidade', finalidadeRapida);
    window.location.href = `#/imoveis?${params.toString()}`;
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-brand-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-600/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-6 text-xs font-medium">
              <Sparkles size={12} className="text-amber-300" />
              <span>Mais de {totalImoveis} imóveis disponíveis</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] text-balance font-display">
              Encontre o imóvel dos seus{' '}
              <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                sonhos
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 mb-8 max-w-2xl leading-relaxed">
              Atendimento personalizado para encontrar o lar perfeito. 
              Mais de 15 anos conectando pessoas aos melhores imóveis do mercado.
            </p>

            {/* Busca rápida */}
            <div className="bg-white rounded-2xl p-3 md:p-4 shadow-2xl shadow-black/20">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="md:col-span-5">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Buscar por bairro, cidade..."
                      value={buscaRapida}
                      onChange={(e) => setBuscaRapida(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Select
                    options={[
                      { value: '', label: 'Tipo' },
                      { value: 'casa', label: 'Casa' },
                      { value: 'apartamento', label: 'Apartamento' },
                      { value: 'terreno', label: 'Terreno' },
                      { value: 'comercial', label: 'Comercial' },
                    ]}
                    value={tipoRapido}
                    onChange={(e) => setTipoRapido(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Select
                    options={[
                      { value: '', label: 'Finalidade' },
                      { value: 'venda', label: 'Venda' },
                      { value: 'aluguel', label: 'Aluguel' },
                    ]}
                    value={finalidadeRapida}
                    onChange={(e) => setFinalidadeRapida(e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <Button onClick={handleBuscaRapida} size="lg" className="w-full">
                    <Search size={16} className="mr-1" />
                    Buscar
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Home size={14} className="text-brand-300" />
                </div>
                <div>
                  <p className="font-bold text-white">{totalImoveis}+</p>
                  <p className="text-xs text-neutral-400">Imóveis</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <TrendingUp size={14} className="text-emerald-300" />
                </div>
                <div>
                  <p className="font-bold text-white">500+</p>
                  <p className="text-xs text-neutral-400">Clientes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Shield size={14} className="text-amber-300" />
                </div>
                <div>
                  <p className="font-bold text-white">15+</p>
                  <p className="text-xs text-neutral-400">Anos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Imóveis em destaque */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">Destaques</p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 font-display text-balance">
              Imóveis selecionados para você
            </h2>
          </div>
          <Link
            to="/imoveis"
            className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Ver todos <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destaqueImoveis.map((imovel) => (
            <ImovelCard
              key={imovel.id}
              imovel={imovel}
              onClick={() => window.location.href = `#/imoveis/${imovel.id}`}
            />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link to="/imoveis" className="inline-flex items-center gap-1 text-brand-600 font-medium">
            Ver todos os imóveis <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Por que escolher */}
      <section className="bg-white py-16 lg:py-20 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">Por que nós</p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 font-display text-balance">
              A escolha certa para seu próximo imóvel
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Home,
                title: 'Ampla Carteira',
                description: 'Diversos imóveis para todos os perfis e orçamentos, sempre atualizados em tempo real.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: TrendingUp,
                title: 'Avaliação Justa',
                description: 'Preços competitivos baseados em análise de mercado atualizada e transparente.',
                color: 'from-emerald-500 to-emerald-600',
              },
              {
                icon: Shield,
                title: 'Segurança Jurídica',
                description: 'Toda documentação verificada e suporte jurídico em todas as etapas do processo.',
                color: 'from-amber-500 to-amber-600',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group p-6 lg:p-8 rounded-2xl bg-neutral-50 hover:bg-white border border-transparent hover:border-neutral-200 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform`}>
                  <item.icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg mb-2 font-display">{item.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }} />
          </div>
          <div className="relative px-6 py-12 md:px-12 md:py-16 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 font-display text-balance">
              Não encontrou o que procura?
            </h2>
            <p className="text-brand-100 mb-8 text-base md:text-lg max-w-2xl mx-auto">
              Entre em contato conosco. Temos uma equipe pronta para ajudar você a encontrar o imóvel ideal.
            </p>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 bg-white text-brand-700 px-6 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-colors shadow-lg hover:shadow-xl"
            >
              <Building2 size={18} />
              Fale Conosco
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
