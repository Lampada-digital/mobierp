import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Bath, Car, Maximize, Share2, Heart, Check } from 'lucide-react';
import { getImovelById, createLead } from '../lib/storage';
import { formatarPreco, formatarArea, labelTipo, labelFinalidade, labelStatusImovel, corStatusImovel } from '../lib/utils';
import { Badge, Button, Input, Textarea } from '../components/ui';
import { Imovel } from '../types';

export function ImovelDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const imovel = id ? getImovelById(id) : null;
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formEnviado, setFormEnviado] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', mensagem: '' });

  if (!imovel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Imóvel não encontrado</h2>
        <Link to="/imoveis" className="text-blue-600 hover:text-blue-800">
          ← Voltar para a listagem
        </Link>
      </div>
    );
  }

  const handleEnviarContato = (e: React.FormEvent) => {
    e.preventDefault();
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
    setTimeout(() => {
      setFormEnviado(false);
      setShowForm(false);
      setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600">Início</Link>
        <span>/</span>
        <Link to="/imoveis" className="hover:text-blue-600">Imóveis</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{imovel.titulo}</span>
      </div>

      {/* Galeria de fotos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden aspect-[16/10]">
          <img
            src={imovel.fotos[fotoAtiva] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'}
            alt={imovel.titulo}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden lg:grid grid-cols-2 gap-2">
          {imovel.fotos.slice(0, 4).map((foto, i) => (
            <button
              key={i}
              onClick={() => setFotoAtiva(i)}
              className={`rounded-xl overflow-hidden aspect-square ${
                fotoAtiva === i ? 'ring-2 ring-blue-600' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <img src={foto} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Thumbnails mobile */}
      {imovel.fotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 lg:hidden">
          {imovel.fotos.map((foto, i) => (
            <button
              key={i}
              onClick={() => setFotoAtiva(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
                fotoAtiva === i ? 'ring-2 ring-blue-600' : 'opacity-70'
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
              <Badge className="bg-blue-100 text-blue-800">{labelTipo(imovel.tipo)}</Badge>
              <Badge className="bg-purple-100 text-purple-800">{labelFinalidade(imovel.finalidade)}</Badge>
              <Badge className={corStatusImovel(imovel.status)}>{labelStatusImovel(imovel.status)}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{imovel.titulo}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span>{imovel.endereco} - {imovel.bairro}, {imovel.cidade}/{imovel.estado}</span>
            </div>
          </div>

          {/* Preço */}
          <div className="bg-blue-50 rounded-xl p-6">
            <p className="text-sm text-blue-600 font-medium">
              {imovel.finalidade === 'aluguel' ? 'Aluguel' : 'Venda'}
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {formatarPreco(imovel.preco, imovel.finalidade)}
            </p>
          </div>

          {/* Características */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imovel.quartos > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Bed size={24} className="mx-auto text-blue-600 mb-2" />
                <p className="text-lg font-bold text-gray-900">{imovel.quartos}</p>
                <p className="text-xs text-gray-600">Quartos</p>
              </div>
            )}
            {imovel.banheiros > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Bath size={24} className="mx-auto text-blue-600 mb-2" />
                <p className="text-lg font-bold text-gray-900">{imovel.banheiros}</p>
                <p className="text-xs text-gray-600">Banheiros</p>
              </div>
            )}
            {imovel.vagas > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Car size={24} className="mx-auto text-blue-600 mb-2" />
                <p className="text-lg font-bold text-gray-900">{imovel.vagas}</p>
                <p className="text-xs text-gray-600">Vagas</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Maximize size={24} className="mx-auto text-blue-600 mb-2" />
              <p className="text-lg font-bold text-gray-900">{formatarArea(imovel.area)}</p>
              <p className="text-xs text-gray-600">Área</p>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Descrição</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{imovel.descricao}</p>
          </div>

          {/* Mapa placeholder */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Localização</h2>
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">{imovel.endereco}</p>
                <p className="text-sm text-gray-500">{imovel.bairro}, {imovel.cidade}/{imovel.estado}</p>
                <p className="text-xs text-gray-400 mt-2">CEP: {imovel.cep}</p>
                <p className="text-xs text-gray-400 mt-1">Mapa será integrado em breve</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ações rápidas */}
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" size="sm">
              <Share2 size={14} className="mr-1" /> Compartilhar
            </Button>
            <Button variant="secondary" className="flex-1" size="sm">
              <Heart size={14} className="mr-1" /> Favoritar
            </Button>
          </div>

          {/* Formulário de contato */}
          <div className="bg-white rounded-xl border p-6 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">Tem interesse neste imóvel?</h3>
            
            {formEnviado ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={24} className="text-green-600" />
                </div>
                <p className="font-medium text-gray-900">Mensagem enviada!</p>
                <p className="text-sm text-gray-600 mt-1">Entraremos em contato em breve.</p>
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
                <Button type="submit" className="w-full">Enviar mensagem</Button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancelar
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <Button onClick={() => setShowForm(true)} className="w-full" size="lg">
                  Entrar em contato
                </Button>
                <p className="text-center text-sm text-gray-500">
                  Ou ligue: <strong>(11) 3456-7890</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
