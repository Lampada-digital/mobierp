import { Link } from 'react-router-dom';
import { Search, ArrowRight, Building2, Home, TrendingUp, Shield } from 'lucide-react';
import { useState } from 'react';
import { getImoveis } from '../lib/storage';
import { ImovelCard } from '../components/ImovelCard';
import { Button, Select } from '../components/ui';
import { FinalidadeImovel, TipoImovel } from '../types';

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
    window.location.href = `/imoveis?${params.toString()}`;
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=800&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Encontre o imóvel dos seus <span className="text-blue-300">sonhos</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Mais de {totalImoveis} imóveis disponíveis para venda e aluguel. 
              Atendimento personalizado para encontrar o lar perfeito.
            </p>

            {/* Busca rápida */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Buscar por bairro, cidade..."
                  value={buscaRapida}
                  onChange={(e) => setBuscaRapida(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                <Select
                  options={[
                    { value: '', label: 'Finalidade' },
                    { value: 'venda', label: 'Venda' },
                    { value: 'aluguel', label: 'Aluguel' },
                  ]}
                  value={finalidadeRapida}
                  onChange={(e) => setFinalidadeRapida(e.target.value)}
                />
                <Button onClick={handleBuscaRapida} size="lg" className="w-full">
                  <Search size={18} className="mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{totalImoveis}+</p>
              <p className="text-sm text-gray-600 mt-1">Imóveis disponíveis</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">500+</p>
              <p className="text-sm text-gray-600 mt-1">Clientes satisfeitos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">15+</p>
              <p className="text-sm text-gray-600 mt-1">Anos de experiência</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">98%</p>
              <p className="text-sm text-gray-600 mt-1">Aprovação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Imóveis em destaque */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Imóveis em Destaque</h2>
            <p className="text-gray-600 mt-1">Confira nossas melhores oportunidades</p>
          </div>
          <Link
            to="/imoveis"
            className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800"
          >
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destaqueImoveis.map((imovel) => (
            <ImovelCard key={imovel.id} imovel={imovel} onClick={() => window.location.href = `/imoveis/${imovel.id}`} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link to="/imoveis" className="inline-flex items-center gap-2 text-blue-600 font-medium">
            Ver todos os imóveis <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Por que nos escolher */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Por que escolher a ImobERP?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Home size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ampla Carteira</h3>
              <p className="text-sm text-gray-600">
                Diversos imóveis para todos os perfis e orçamentos, sempre atualizados.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Avaliação Justa</h3>
              <p className="text-sm text-gray-600">
                Preços competitivos baseados em análise de mercado atualizada.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Segurança Jurídica</h3>
              <p className="text-sm text-gray-600">
                Toda documentação verificada e suporte jurídico em todas as etapas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Entre em contato conosco. Temos uma equipe pronta para ajudar você a encontrar o imóvel ideal.
          </p>
          <Link
            to="/contato"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <Building2 size={20} />
            Fale Conosco
          </Link>
        </div>
      </section>
    </div>
  );
}
