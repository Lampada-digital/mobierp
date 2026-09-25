import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, Copy } from 'lucide-react';
import { getImoveis, deleteImovel, createImovel } from '../../lib/storage';
import { formatarPreco, labelTipo, labelStatusImovel, formatarData } from '../../lib/utils';
import { Input, Select, Button, Badge, Card, EmptyState, Skeleton } from '../../components/ui';
import { StatusImovel, Imovel } from '../../types';

export function AdminImoveisPage() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      const filtros: any = {};
      if (busca) filtros.busca = busca;
      if (filtroStatus) filtros.status = filtroStatus as StatusImovel;
      setImoveis(getImoveis(filtros, 1, 50).dados);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [busca, filtroStatus]);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      deleteImovel(id);
      setImoveis(getImoveis({}, 1, 50).dados);
    }
  };

  const handleDuplicar = (imovel: Imovel) => {
    const { id, createdAt, updatedAt, ...data } = imovel;
    createImovel({ ...data, titulo: `${imovel.titulo} (cópia)` });
    setImoveis(getImoveis({}, 1, 50).dados);
  };

  const statusCounts = {
    todos: getImoveis().paginacao.total,
    disponivel: getImoveis({ status: 'disponivel' }).paginacao.total,
    reservado: getImoveis({ status: 'reservado' }).paginacao.total,
    vendido: getImoveis({ status: 'vendido' }).paginacao.total,
    alugado: getImoveis({ status: 'alugado' }).paginacao.total,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">Imóveis</h1>
          <p className="text-neutral-500 text-sm mt-1">Gerencie todos os imóveis da imobiliária</p>
        </div>
        <Link
          to="/admin/imoveis/novo"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          <Plus size={16} />
          Novo Imóvel
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: '', label: 'Todos', count: statusCounts.todos },
          { key: 'disponivel', label: 'Disponíveis', count: statusCounts.disponivel },
          { key: 'reservado', label: 'Reservados', count: statusCounts.reservado },
          { key: 'vendido', label: 'Vendidos', count: statusCounts.vendido },
          { key: 'alugado', label: 'Alugados', count: statusCounts.alugado },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFiltroStatus(tab.key)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              filtroStatus === tab.key
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filtroStatus === tab.key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Busca */}
      <Card padding="sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por título, bairro, cidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
      </Card>

      {/* Tabela */}
      {loading ? (
        <Card padding="none">
          <div className="divide-y divide-neutral-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </Card>
      ) : imoveis.length === 0 ? (
        <EmptyState
          illustration="home"
          title="Nenhum imóvel cadastrado"
          description={busca || filtroStatus ? 'Nenhum imóvel corresponde aos filtros aplicados.' : 'Comece cadastrando seu primeiro imóvel.'}
          action={
            !busca && !filtroStatus ? (
              <Link to="/admin/imoveis/novo">
                <Button>
                  <Plus size={16} className="mr-1" />
                  Cadastrar Imóvel
                </Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={() => { setBusca(''); setFiltroStatus(''); }}>
                Limpar filtros
              </Button>
            )
          }
        />
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Imóvel</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Preço</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Data</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {imoveis.map((imovel) => (
                  <tr key={imovel.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={imovel.fotos[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=80&h=80&fit=crop'}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 ring-1 ring-neutral-200"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-900 truncate max-w-[200px]">{imovel.titulo}</p>
                          <p className="text-xs text-neutral-500">{imovel.bairro}, {imovel.cidade}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-neutral-600">{labelTipo(imovel.tipo)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-neutral-900">{formatarPreco(imovel.preco, imovel.finalidade)}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge
                        variant={imovel.status === 'disponivel' ? 'success' : imovel.status === 'reservado' ? 'warning' : imovel.status === 'vendido' ? 'danger' : 'info'}
                        dot
                      >
                        {labelStatusImovel(imovel.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-neutral-500">{formatarData(imovel.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        <Link
                          to={`/imoveis/${imovel.id}`}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 transition-colors"
                          title="Ver"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          onClick={() => handleDuplicar(imovel)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-neutral-500 hover:text-blue-600 transition-colors"
                          title="Duplicar"
                        >
                          <Copy size={15} />
                        </button>
                        <Link
                          to={`/admin/imoveis/${imovel.id}/editar`}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-neutral-500 hover:text-blue-600 transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(imovel.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
