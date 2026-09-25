import { Link } from 'react-router-dom';
import { Home, Users, TrendingUp, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import { getImoveis, getLeads, getLeadCountByStatus } from '../../lib/storage';
import { Card, Badge } from '../../components/ui';
import { formatarPreco, corStatusLead, labelStatusLead, formatarData } from '../../lib/utils';

export function DashboardPage() {
  const { dados: imoveisRecentes } = getImoveis({}, 1, 5);
  const leads = getLeads();
  const leadCounts = getLeadCountByStatus();
  const imoveisDisponiveis = getImoveis({ status: 'disponivel' }).paginacao.total;
  const totalImoveis = getImoveis().paginacao.total;

  const stats = [
    { label: 'Total de Imóveis', value: totalImoveis, icon: Home, color: 'bg-blue-100 text-blue-600' },
    { label: 'Disponíveis', value: imoveisDisponiveis, icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Leads Novos', value: leadCounts.novo, icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Leads Totais', value: leads.length, icon: AlertCircle, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">Visão geral do sistema</p>
        </div>
        <Link
          to="/admin/imoveis/novo"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Novo Imóvel
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Imóveis recentes */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Imóveis Recentes</h2>
            <Link to="/admin/imoveis" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {imoveisRecentes.map((imovel) => (
              <Link
                key={imovel.id}
                to={`/admin/imoveis/${imovel.id}/editar`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src={imovel.fotos[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop'}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{imovel.titulo}</p>
                  <p className="text-xs text-gray-500">{formatarPreco(imovel.preco, imovel.finalidade)}</p>
                </div>
                <Badge className={imovel.status === 'disponivel' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {imovel.status}
                </Badge>
              </Link>
            ))}
          </div>
        </Card>

        {/* Leads recentes */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Leads Recentes</h2>
            <Link to="/admin/leads" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {leads.slice(-5).reverse().map((lead) => (
              <div key={lead.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                  {lead.nome.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{lead.nome}</p>
                  <p className="text-xs text-gray-500">{formatarData(lead.createdAt)}</p>
                </div>
                <Badge className={corStatusLead(lead.status)}>
                  {labelStatusLead(lead.status)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Kanban preview */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Pipeline de Leads</h2>
          <Link to="/admin/leads" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
            Ver kanban <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { status: 'novo', label: 'Novo', color: 'bg-blue-500' },
            { status: 'qualificando', label: 'Qualificando', color: 'bg-yellow-500' },
            { status: 'atendido', label: 'Atendido', color: 'bg-green-500' },
            { status: 'perdido', label: 'Perdido', color: 'bg-red-500' },
          ].map((col) => (
            <div key={col.status} className="text-center p-4 rounded-xl bg-gray-50">
              <div className={`w-3 h-3 rounded-full ${col.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-gray-900">{(leadCounts as any)[col.status]}</p>
              <p className="text-sm text-gray-600">{col.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
