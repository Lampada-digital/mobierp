import { Link } from 'react-router-dom';
import { Home, Users, TrendingUp, AlertCircle, Plus, ArrowRight, ArrowUpRight, Building2, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getImoveis, getLeads, getLeadCountByStatus } from '../../lib/storage';
import { Card, Badge, Button, Skeleton } from '../../components/ui';
import { formatarPreco, corStatusLead, labelStatusLead, formatarData } from '../../lib/utils';

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setData({
        imoveisRecentes: getImoveis({}, 1, 5).dados,
        leads: getLeads(),
        leadCounts: getLeadCountByStatus(),
        imoveisDisponiveis: getImoveis({ status: 'disponivel' }).paginacao.total,
        totalImoveis: getImoveis().paginacao.total,
      });
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const stats = [
    { label: 'Total de Imóveis', value: data.totalImoveis, icon: Home, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Disponíveis', value: data.imoveisDisponiveis, icon: Building2, color: 'from-emerald-500 to-emerald-600', change: '+5%' },
    { label: 'Leads Novos', value: data.leadCounts.novo, icon: Users, color: 'from-violet-500 to-violet-600', change: '+23%' },
    { label: 'Leads Totais', value: data.leads.length, icon: FileText, color: 'from-amber-500 to-amber-600', change: '+8%' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-1">Visão geral do seu negócio imobiliário</p>
        </div>
        <Link
          to="/admin/imoveis/novo"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          <Plus size={16} />
          Novo Imóvel
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={stat.label} padding="none" className="overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <TrendingUp size={10} />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-neutral-900 font-display">{stat.value}</p>
              <p className="text-sm text-neutral-500 mt-0.5">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Imóveis recentes */}
        <Card padding="none">
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <div>
              <h2 className="font-bold text-neutral-900 font-display">Imóveis Recentes</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Últimos imóveis cadastrados</p>
            </div>
            <Link to="/admin/imoveis" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {data.imoveisRecentes.map((imovel: any) => (
              <Link
                key={imovel.id}
                to={`/admin/imoveis/${imovel.id}/editar`}
                className="flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors group"
              >
                <img
                  src={imovel.fotos[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop'}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 ring-1 ring-neutral-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-brand-700 transition-colors">
                    {imovel.titulo}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">{imovel.bairro}, {imovel.cidade}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-neutral-900">{formatarPreco(imovel.preco, imovel.finalidade)}</p>
                  <Badge
                    variant={imovel.status === 'disponivel' ? 'success' : imovel.status === 'reservado' ? 'warning' : 'neutral'}
                    size="sm"
                    className="mt-1"
                  >
                    {imovel.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Leads recentes */}
        <Card padding="none">
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <div>
              <h2 className="font-bold text-neutral-900 font-display">Leads Recentes</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Últimos contatos recebidos</p>
            </div>
            <Link to="/admin/leads" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {data.leads.slice(-5).reverse().map((lead: any) => (
              <div key={lead.id} className="flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {lead.nome.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{lead.nome}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{formatarData(lead.createdAt)}</p>
                </div>
                <Badge variant={lead.status === 'novo' ? 'info' : lead.status === 'qualificando' ? 'warning' : lead.status === 'atendido' ? 'success' : 'danger'} size="sm">
                  {labelStatusLead(lead.status)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pipeline de leads */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-neutral-900 font-display">Pipeline de Leads</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Distribuição por status</p>
          </div>
          <Link to="/admin/leads" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
            Abrir kanban <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { status: 'novo', label: 'Novo', color: 'from-sky-500 to-sky-600', bg: 'bg-sky-50' },
            { status: 'qualificando', label: 'Qualificando', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
            { status: 'atendido', label: 'Atendido', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
            { status: 'perdido', label: 'Perdido', color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
          ].map((col) => (
            <div key={col.status} className={`${col.bg} rounded-xl p-4 border border-neutral-100`}>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${col.color} flex items-center justify-center mb-3 shadow-sm`}>
                <span className="text-white font-bold text-sm">{data.leadCounts[col.status]}</span>
              </div>
              <p className="text-sm font-semibold text-neutral-900">{col.label}</p>
              <p className="text-xs text-neutral-500 mt-0.5">leads</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="w-11 h-11 rounded-xl" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-7 w-16 mb-1" />
            <Skeleton className="h-4 w-28" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} padding="none">
            <div className="p-5 border-b border-neutral-100">
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
