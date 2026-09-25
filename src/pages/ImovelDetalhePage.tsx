import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Bath, Car, Maximize, Share2, Heart, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImovelById, createLead } from '../lib/storage';
import { formatarPreco, formatarArea, labelTipo, labelFinalidade, labelStatusImovel } from '../lib/utils';
import { Badge, Button, Input, Textarea, Card, Skeleton } from '../components/ui';
import { Imovel } from '../types';

export function ImovelDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formEnviado, setFormEnviado] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', mensagem: '' });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (id) setImovel(getImovelById(id));
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-4 w-1/3 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!imovel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4 font-display">Imóvel não encontrado</h2>
        <Link to="/imoveis" className="text-brand-600 hover:text-brand-700 font-medium">
          ← Voltar para a listagem
        </Link>
      </div>
    );
  }

  const handleEnviarContato = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setTimeout(() => {
      createLead({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        mensagem: formData.mensagem,
        imovelId: imovel.id,
        origem: 'site',
        status: 'novo',
      });
      setFormEnviado(true);
      setEnviando(false);
      setTimeout(() => {
        setFormEnviado(false);
        setShowForm(false);
        setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
      }, 3000);
    }, 800);
  };

  const proximaFoto = () => setFotoAtiva((fotoAtiva + 1) % imovel.fotos.length);
  const fotoAnterior = () => setFotoAtiva((fotoAtiva - 1 + imovel.fotos.length) % imovel.fotos.length);

  const statusVariant = imovel.status === 'disponivel' ? 'success' : imovel.status === 'reservado' ? 'warning' : imovel.status === 'vendido' ? 'danger' : 'info';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <Link to="/" className="hover:text-brand-600 transition-colors">Início</Link>
        <span className="text-neutral-300">/</span>
        <Link to="/imoveis" className="hover:text-brand-600 transition-colors">Imóveis</Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900 font-medium truncate">{imovel.titulo}</span>
      </nav>

      {/* Galeria de fotos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-100 group">
          <img
            src={imovel.fotos[fotoAtiva] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop'}
            alt={imovel.titulo}
            className="w-full h-full object-cover transition-transform duration-500"
          />
          {imovel.fotos.length > 1 && (
            <>
              <button
                onClick={fotoAnterior}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={proximaFoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                {fotoAtiva + 1} / {imovel.fotos.length}
              </div>
            </>
          )}
        </div>
        <div className="hidden lg:grid grid-cols-2 gap-2">
          {imovel.fotos.slice(0, 4).map((foto, i) => (
            <button
              key={i}
              onClick={() => setFotoAtiva(i)}
              className={`rounded-xl overflow-hidden aspect-square ring-2 transition-all ${
                fotoAtiva === i ? 'ring-brand-600 ring-offset-2' : 'ring-transparent opacity-80 hover:opacity-100'
              }`}
            >
              <img src={foto} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Thumbnails mobile */}
      {imovel.fotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 lg:hidden -mx-4 px-4">
          {imovel.fotos.map((foto, i) => (
            <button
              key={i}
              onClick={() => setFotoAtiva(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ring-2 transition-all ${
                fotoAtiva === i ? 'ring-brand-600' : 'ring-transparent opacity-70'
              }`}
            >
              <img src={foto} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conteúdo principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Título e badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="default">{labelTipo(imovel.tipo)}</Badge>
              <Badge variant="info">{labelFinalidade(imovel.finalidade)}</Badge>
              <Badge variant={statusVariant} dot>{labelStatusImovel(imovel.status)}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-3 font-display leading-tight text-balance">
              {imovel.titulo}
            </h1>
            <div className="flex items-center text-neutral-600">
              <MapPin size={16} className="mr-1.5 text-neutral-400" />
              <span className="text-sm">{imovel.endereco} - {imovel.bairro}, {imovel.cidade}/{imovel.estado}</span>
            </div>
          </div>

          {/* Preço */}
          <Card className="bg-gradient-to-br from-brand-50 to-white border-brand-100">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
              {imovel.finalidade === 'aluguel' ? 'Aluguel mensal' : 'Valor de venda'}
            </p>
            <p className="text-3xl md:text-4xl font-bold text-neutral-900 font-display">
              {formatarPreco(imovel.preco, imovel.finalidade)}
            </p>
          </Card>

          {/* Características */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {imovel.quartos > 0 && (
              <Card className="text-center">
                <Bed size={22} className="mx-auto text-brand-600 mb-2" />
                <p className="text-xl font-bold text-neutral-900 font-display">{imovel.quartos}</p>
                <p className="text-xs text-neutral-500">Quartos</p>
              </Card>
            )}
            {imovel.banheiros > 0 && (
              <Card className="text-center">
                <Bath size={22} className="mx-auto text-brand-600 mb-2" />
                <p className="text-xl font-bold text-neutral-900 font-display">{imovel.banheiros}</p>
                <p className="text-xs text-neutral-500">Banheiros</p>
              </Card>
            )}
            {imovel.vagas > 0 && (
              <Card className="text-center">
                <Car size={22} className="mx-auto text-brand-600 mb-2" />
                <p className="text-xl font-bold text-neutral-900 font-display">{imovel.vagas}</p>
                <p className="text-xs text-neutral-500">Vagas</p>
              </Card>
            )}
            <Card className="text-center">
              <Maximize size={22} className="mx-auto text-brand-600 mb-2" />
              <p className="text-xl font-bold text-neutral-900 font-display">{imovel.area}</p>
              <p className="text-xs text-neutral-500">m²</p>
            </Card>
          </div>

          {/* Descrição */}
          <Card>
            <h2 className="text-lg font-bold text-neutral-900 mb-3 font-display">Sobre o imóvel</h2>
            <p className="text-neutral-700 leading-relaxed whitespace-pre-line text-sm">{imovel.descricao}</p>
          </Card>

          {/* Localização */}
          <Card>
            <h2 className="text-lg font-bold text-neutral-900 mb-3 font-display">Localização</h2>
            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl h-56 flex items-center justify-center border-2 border-dashed border-neutral-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <MapPin size={20} className="text-brand-600" />
                </div>
                <p className="text-sm font-medium text-neutral-900">{imovel.endereco}</p>
                <p className="text-sm text-neutral-600">{imovel.bairro}, {imovel.cidade}/{imovel.estado}</p>
                <p className="text-xs text-neutral-400 mt-2">CEP: {imovel.cep}</p>
                <p className="text-xs text-neutral-400 mt-1">Mapa será integrado em breve</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Ações rápidas */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" size="sm">
              <Share2 size={14} className="mr-1" /> Compartilhar
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              <Heart size={14} className="mr-1" /> Favoritar
            </Button>
          </div>

          {/* Formulário de contato */}
          <Card className="sticky top-20">
            <h3 className="font-bold text-neutral-900 mb-1 font-display text-lg">Tem interesse?</h3>
            <p className="text-sm text-neutral-500 mb-4">Entre em contato e agende uma visita.</p>
            
            {formEnviado ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={28} className="text-emerald-600" />
                </div>
                <p className="font-bold text-neutral-900 font-display">Mensagem enviada!</p>
                <p className="text-sm text-neutral-600 mt-1">Entraremos em contato em breve.</p>
              </div>
            ) : showForm ? (
              <form onSubmit={handleEnviarContato} className="space-y-3">
                <Input
                  label="Nome"
                  required
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Telefone"
                  required
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
                <Textarea
                  label="Mensagem"
                  placeholder={`Olá, tenho interesse no imóvel "${imovel.titulo}"...`}
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                />
                <Button type="submit" className="w-full" loading={enviando}>
                  Enviar mensagem
                </Button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full text-center text-sm text-neutral-500 hover:text-neutral-700"
                >
                  Cancelar
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <Button onClick={() => setShowForm(true)} className="w-full" size="lg">
                  Entrar em contato
                </Button>
                <div className="text-center pt-2 border-t border-neutral-100">
                  <p className="text-xs text-neutral-500 mb-1">Ou ligue diretamente:</p>
                  <p className="text-sm font-bold text-neutral-900">(11) 3456-7890</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
