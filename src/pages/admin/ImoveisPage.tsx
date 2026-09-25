import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { getImoveis, deleteImovel } from '../../lib/storage';
import { formatarPreco, labelTipo, labelStatusImovel, corStatusImovel, formatarData } from '../../lib/utils';
import { Input, Select, Button, Badge } from '../../components/ui';
import { StatusImovel } from '../../types';

export function AdminImoveisPage() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [refresh, setRefresh] = useState(0);

  const filtros: any = {};
  if (busca) filtros.busca = busca;
  if (filtroStatus) filtros.status = filtroStatus as StatusImovel;

  const { dados: imoveis } = getImoveis(filtros, 1, 50);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      deleteImovel(id);
      setRefresh(refresh + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Imóveis</h1>
          <p className="text-gray-600 text-sm mt-1">{imoveis.length} imóvel(is)</p>
        </div>
        <Link
          to="/admin/imoveis/novo"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Novo Imóvel
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título, bairro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          options={[
            { value: '', label: 'Todos os status' },
            { value: 'disponivel', label: 'Disponível' },
            { value: 'reservado', label: 'Reservado' },
            { value: 'vendido', label: 'Vendido' },
            { value: 'alugado', label: 'Alugado' },
          ]}
          className="w-full sm:w-48"
        />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Imóvel</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Preço</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Data</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {imoveis.map((imovel) => (
                <tr key={imovel.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={imovel.fotos[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=80&h=80&fit=crop'}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{imovel.titulo}</p>
                        <p className="text-xs text-gray-500">{imovel.bairro}, {imovel.cidade}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-600">{labelTipo(imovel.tipo)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{formatarPreco(imovel.preco, imovel.finalidade)}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge className={corStatusImovel(imovel.status)}>{labelStatusImovel(imovel.status)}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-gray-500">{formatarData(imovel.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/imoveis/${imovel.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                        title="Ver"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/admin/imoveis/${imovel.id}/editar`}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(imovel.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {imoveis.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum imóvel encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
