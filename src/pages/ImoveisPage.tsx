import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getImoveis, getBairros } from '../lib/storage';
import { ImovelCard } from '../components/ImovelCard';
import { Input, Select, Button } from '../components/ui';
import { FiltrosImovel, TipoImovel, FinalidadeImovel } from '../types';

export function ImoveisPage() {
  const [searchParams] = useSearchParams();
  const [filtros, setFiltros] = useState<FiltrosImovel>({});
  const [pagina, setPagina] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const f: FiltrosImovel = {};
    if (searchParams.get('busca')) f.busca = searchParams.get('busca')!;
    if (searchParams.get('tipo')) f.tipo = searchParams.get('tipo') as TipoImovel;
    if (searchParams.get('finalidade')) f.finalidade = searchParams.get('finalidade') as FinalidadeImovel;
    if (searchParams.get('bairro')) f.bairro = searchParams.get('bairro')!;
    if (searchParams.get('quartos')) f.quartos = parseInt(searchParams.get('quartos')!);
    if (searchParams.get('preco_min')) f.preco_min = parseFloat(searchParams.get('preco_min')!);
    if (searchParams.get('preco_max')) f.preco_max = parseFloat(searchParams.get('preco_max')!);
    setFiltros(f);
  }, []);

  const { dados: imoveis, paginacao } = getImoveis(filtros, pagina, 9);
  const bairros = getBairros();

  const atualizarFiltro = (key: keyof FiltrosImovel, value: string | number | undefined) => {
    const novos = { ...filtros };
    if (value === '' || value === undefined) {
      delete novos[key];
    } else {
      (novos as Record<string, any>)[key] = value;
    }
    setFiltros(novos);
    setPagina(1);
  };

  const limparFiltros = () => {
    setFiltros({});
    setPagina(1);
  };

  const filtrosAtivos = Object.keys(filtros).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Imóveis Disponíveis</h1>
          <p className="text-gray-600 text-sm mt-1">
            {paginacao.total} imóvel(is) encontrado(s)
          </p>
        </div>
        <button
          className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
          onClick={() => setSidebarOpen(true)}
        >
          <SlidersHorizontal size={16} />
          Filtros
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar de filtros - Desktop */}
        <aside className="hidden md:block w-72 flex-shrink-0">
          <FiltrosSidebar
            filtros={filtros}
            bairros={bairros}
            onChange={atualizarFiltro}
            onLimpar={limparFiltros}
            filtrosAtivos={filtrosAtivos}
          />
        </aside>

        {/* Sidebar mobile (overlay) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-80 bg-white overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Filtros</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <FiltrosSidebar
                filtros={filtros}
                bairros={bairros}
                onChange={atualizarFiltro}
                onLimpar={limparFiltros}
                filtrosAtivos={filtrosAtivos}
              />
            </div>
          </div>
        )}

        {/* Lista de imóveis */}
        <div className="flex-1">
          {imoveis.length === 0 ? (
            <div className="text-center py-16">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum imóvel encontrado</h3>
              <p className="text-gray-600 mb-4">Tente ajustar os filtros de busca</p>
              <Button variant="secondary" onClick={limparFiltros}>
                Limpar filtros
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {imoveis.map((imovel) => (
                  <ImovelCard
                    key={imovel.id}
                    imovel={imovel}
                    onClick={() => window.location.href = `/imoveis/${imovel.id}`}
                  />
                ))}
              </div>

              {/* Paginação */}
              {paginacao.totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={pagina === 1}
                    onClick={() => setPagina(pagina - 1)}
                  >
                    Anterior
                  </Button>
                  {Array.from({ length: paginacao.totalPaginas }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPagina(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${
                        p === pagina ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={pagina === paginacao.totalPaginas}
                    onClick={() => setPagina(pagina + 1)}
                  >
                    Próximo
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface FiltrosSidebarProps {
  filtros: FiltrosImovel;
  bairros: string[];
  onChange: (key: keyof FiltrosImovel, value: string | number | undefined) => void;
  onLimpar: () => void;
  filtrosAtivos: boolean;
}

function FiltrosSidebar({ filtros, bairros, onChange, onLimpar, filtrosAtivos }: FiltrosSidebarProps) {
  return (
    <div className="bg-white rounded-xl border p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filtros</h3>
        {filtrosAtivos && (
          <button onClick={onLimpar} className="text-xs text-blue-600 hover:text-blue-800">
            Limpar tudo
          </button>
        )}
      </div>

      <Input
        label="Buscar"
        placeholder="Palavra-chave..."
        value={filtros.busca || ''}
        onChange={(e) => onChange('busca', e.target.value)}
      />

      <Select
        label="Tipo"
        value={filtros.tipo || ''}
        onChange={(e) => onChange('tipo', e.target.value || undefined)}
        options={[
          { value: '', label: 'Todos' },
          { value: 'casa', label: 'Casa' },
          { value: 'apartamento', label: 'Apartamento' },
          { value: 'terreno', label: 'Terreno' },
          { value: 'comercial', label: 'Comercial' },
        ]}
      />

      <Select
        label="Finalidade"
        value={filtros.finalidade || ''}
        onChange={(e) => onChange('finalidade', e.target.value || undefined)}
        options={[
          { value: '', label: 'Todas' },
          { value: 'venda', label: 'Venda' },
          { value: 'aluguel', label: 'Aluguel' },
        ]}
      />

      <Select
        label="Bairro"
        value={filtros.bairro || ''}
        onChange={(e) => onChange('bairro', e.target.value || undefined)}
        options={[
          { value: '', label: 'Todos' },
          ...bairros.map((b) => ({ value: b, label: b })),
        ]}
      />

      <Select
        label="Quartos (mínimo)"
        value={filtros.quartos?.toString() || ''}
        onChange={(e) => onChange('quartos', e.target.value ? parseInt(e.target.value) : undefined)}
        options={[
          { value: '', label: 'Qualquer' },
          { value: '1', label: '1+' },
          { value: '2', label: '2+' },
          { value: '3', label: '3+' },
          { value: '4', label: '4+' },
          { value: '5', label: '5+' },
        ]}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Preço mín"
          type="number"
          placeholder="R$ 0"
          value={filtros.preco_min?.toString() || ''}
          onChange={(e) => onChange('preco_min', e.target.value ? parseFloat(e.target.value) : undefined)}
        />
        <Input
          label="Preço máx"
          type="number"
          placeholder="Sem limite"
          value={filtros.preco_max?.toString() || ''}
          onChange={(e) => onChange('preco_max', e.target.value ? parseFloat(e.target.value) : undefined)}
        />
      </div>
    </div>
  );
}
