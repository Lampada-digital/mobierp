import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { getImovelById, createImovel, updateImovel } from '../../lib/storage';
import { Input, Select, Textarea, Button } from '../../components/ui';
import { Imovel, TipoImovel, FinalidadeImovel, StatusImovel } from '../../types';

export function ImovelFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    tipo: 'casa' as TipoImovel,
    finalidade: 'venda' as FinalidadeImovel,
    preco: '',
    area: '',
    quartos: '0',
    banheiros: '0',
    vagas: '0',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    status: 'disponivel' as StatusImovel,
    fotos: [] as string[],
  });
  const [novaFoto, setNovaFoto] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const imovel = getImovelById(id);
      if (imovel) {
        setForm({
          titulo: imovel.titulo,
          descricao: imovel.descricao,
          tipo: imovel.tipo,
          finalidade: imovel.finalidade,
          preco: imovel.preco.toString(),
          area: imovel.area.toString(),
          quartos: imovel.quartos.toString(),
          banheiros: imovel.banheiros.toString(),
          vagas: imovel.vagas.toString(),
          endereco: imovel.endereco,
          bairro: imovel.bairro,
          cidade: imovel.cidade,
          estado: imovel.estado,
          cep: imovel.cep,
          status: imovel.status,
          fotos: imovel.fotos,
        });
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      titulo: form.titulo,
      descricao: form.descricao,
      tipo: form.tipo,
      finalidade: form.finalidade,
      preco: parseFloat(form.preco) || 0,
      area: parseFloat(form.area) || 0,
      quartos: parseInt(form.quartos) || 0,
      banheiros: parseInt(form.banheiros) || 0,
      vagas: parseInt(form.vagas) || 0,
      endereco: form.endereco,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado,
      cep: form.cep,
      status: form.status,
      fotos: form.fotos,
    };

    setTimeout(() => {
      if (isEdit && id) {
        updateImovel(id, data);
      } else {
        createImovel(data);
      }
      navigate('/admin/imoveis');
    }, 500);
  };

  const adicionarFoto = () => {
    if (novaFoto.trim()) {
      setForm({ ...form, fotos: [...form.fotos, novaFoto.trim()] });
      setNovaFoto('');
    }
  };

  const removerFoto = (index: number) => {
    setForm({ ...form, fotos: form.fotos.filter((_, i) => i !== index) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Imóvel' : 'Novo Imóvel'}
          </h1>
          <p className="text-gray-600 text-sm">{isEdit ? 'Atualize as informações do imóvel' : 'Preencha os dados do novo imóvel'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações básicas */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">Informações Básicas</h2>
          
          <Input
            label="Título"
            required
            placeholder="Ex: Casa moderna com piscina"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />

          <Textarea
            label="Descrição"
            required
            placeholder="Descreva o imóvel em detalhes..."
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Tipo"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoImovel })}
              options={[
                { value: 'casa', label: 'Casa' },
                { value: 'apartamento', label: 'Apartamento' },
                { value: 'terreno', label: 'Terreno' },
                { value: 'comercial', label: 'Comercial' },
              ]}
            />
            <Select
              label="Finalidade"
              value={form.finalidade}
              onChange={(e) => setForm({ ...form, finalidade: e.target.value as FinalidadeImovel })}
              options={[
                { value: 'venda', label: 'Venda' },
                { value: 'aluguel', label: 'Aluguel' },
              ]}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as StatusImovel })}
              options={[
                { value: 'disponivel', label: 'Disponível' },
                { value: 'reservado', label: 'Reservado' },
                { value: 'vendido', label: 'Vendido' },
                { value: 'alugado', label: 'Alugado' },
              ]}
            />
          </div>
        </div>

        {/* Preço e características */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">Preço e Características</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Preço (R$)"
              type="number"
              required
              placeholder="0"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
            />
            <Input
              label="Área (m²)"
              type="number"
              required
              placeholder="0"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Quartos"
              type="number"
              min="0"
              value={form.quartos}
              onChange={(e) => setForm({ ...form, quartos: e.target.value })}
            />
            <Input
              label="Banheiros"
              type="number"
              min="0"
              value={form.banheiros}
              onChange={(e) => setForm({ ...form, banheiros: e.target.value })}
            />
            <Input
              label="Vagas"
              type="number"
              min="0"
              value={form.vagas}
              onChange={(e) => setForm({ ...form, vagas: e.target.value })}
            />
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">Localização</h2>
          
          <Input
            label="Endereço"
            required
            placeholder="Rua, número"
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bairro"
              required
              placeholder="Bairro"
              value={form.bairro}
              onChange={(e) => setForm({ ...form, bairro: e.target.value })}
            />
            <Input
              label="Cidade"
              required
              placeholder="Cidade"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Estado"
              required
              placeholder="SP"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            />
            <Input
              label="CEP"
              required
              placeholder="00000-000"
              value={form.cep}
              onChange={(e) => setForm({ ...form, cep: e.target.value })}
            />
          </div>
        </div>

        {/* Fotos */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">Fotos</h2>
          
          <div className="flex gap-2">
            <Input
              placeholder="URL da imagem (https://...)"
              value={novaFoto}
              onChange={(e) => setNovaFoto(e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="secondary" onClick={adicionarFoto}>
              <Plus size={16} className="mr-1" /> Adicionar
            </Button>
          </div>

          {form.fotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {form.fotos.map((foto, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden aspect-square">
                  <img src={foto} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removerFoto(i)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {form.fotos.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Adicione URLs de imagens acima</p>
              <p className="text-xs text-gray-400 mt-1">Em produção, será implementado upload de arquivos</p>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : isEdit ? 'Atualizar Imóvel' : 'Criar Imóvel'}
          </Button>
        </div>
      </form>
    </div>
  );
}
