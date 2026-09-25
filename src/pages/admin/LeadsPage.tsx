import { useState, useEffect } from 'react';
import { getLeads, updateLead, getImovelById } from '../../lib/storage';
import { formatarDataHora, labelStatusLead, labelOrigem } from '../../lib/utils';
import { Badge, Card, Button, Dialog, Select, EmptyState, Skeleton } from '../../components/ui';
import { Lead, StatusLead } from '../../types';
import { Mail, Phone, MessageSquare, ChevronRight } from 'lucide-react';

const colunas: { status: StatusLead; label: string; variant: 'info' | 'warning' | 'success' | 'danger' }[] = [
  { status: 'novo', label: 'Novo', variant: 'info' },
  { status: 'qualificando', label: 'Qualificando', variant: 'warning' },
  { status: 'atendido', label: 'Atendido', variant: 'success' },
  { status: 'perdido', label: 'Perdido', variant: 'danger' },
];

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null);
  const [showDetalhe, setShowDetalhe] = useState(false);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  useEffect(() => {
    const t = setTimeout(() => {
      setLeads(getLeads());
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const handleMoverStatus = (leadId: string, novoStatus: StatusLead) => {
    updateLead(leadId, { status: novoStatus });
    setLeads(getLeads());
    if (leadSelecionado?.id === leadId) {
      setLeadSelecionado({ ...leadSelecionado, status: novoStatus });
    }
  };

  const getProximoStatus = (status: StatusLead): StatusLead | null => {
    const order: StatusLead[] = ['novo', 'qualificando', 'atendido'];
    const idx = order.indexOf(status);
    if (idx === -1 || idx >= order.length - 1) return null;
    return order[idx + 1];
  };

  if (loading) {
    return <LeadsSkeleton />;
  }

  if (leads.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">Leads</h1>
          <p className="text-neutral-500 text-sm mt-1">Gerencie seus leads no kanban</p>
        </div>
        <EmptyState
          illustration="users"
          title="Nenhum lead cadastrado"
          description="Os leads aparecerão aqui quando forem capturados pelo site ou cadastrados manualmente."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">Leads</h1>
          <p className="text-neutral-500 text-sm mt-1">Gerencie seus leads no kanban</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                view === 'kanban' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                view === 'list' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
              }`}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Kanban */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {colunas.map((coluna) => {
            const leadsColuna = leads.filter((l) => l.status === coluna.status);
            return (
              <div key={coluna.status} className="space-y-3">
                {/* Header da coluna */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={coluna.variant} dot>
                      {coluna.label}
                    </Badge>
                    <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {leadsColuna.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-2 min-h-[200px]">
                  {leadsColuna.map((lead) => {
                    const imovel = lead.imovelId ? getImovelById(lead.imovelId) : null;
                    const proximoStatus = getProximoStatus(lead.status);
                    return (
                      <Card
                        key={lead.id}
                        padding="sm"
                        className="group cursor-pointer hover:border-brand-200"
                        onClick={() => {
                          setLeadSelecionado(lead);
                          setShowDetalhe(true);
                        }}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {lead.nome.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 truncate">{lead.nome}</p>
                            <p className="text-xs text-neutral-500 truncate">{lead.email}</p>
                            {imovel && (
                              <p className="text-xs text-brand-600 mt-1.5 flex items-center gap-1 truncate">
                                📍 {imovel.titulo}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="neutral" size="sm">
                                {labelOrigem(lead.origem)}
                              </Badge>
                              <span className="text-[10px] text-neutral-400">
                                {formatarDataHora(lead.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {proximoStatus && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoverStatus(lead.id, proximoStatus);
                            }}
                            className="mt-2.5 w-full flex items-center justify-center gap-1 text-xs font-medium text-brand-600 hover:bg-brand-50 rounded-lg py-1.5 transition-colors border border-transparent hover:border-brand-200"
                          >
                            Mover para {labelStatusLead(proximoStatus)} <ChevronRight size={12} />
                          </button>
                        )}
                      </Card>
                    );
                  })}
                  {leadsColuna.length === 0 && (
                    <div className="text-center py-12 text-sm text-neutral-400 border-2 border-dashed border-neutral-200 rounded-xl">
                      Sem leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lista */}
      {view === 'list' && (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Lead</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Contato</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Origem</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => {
                      setLeadSelecionado(lead);
                      setShowDetalhe(true);
                    }}
                    className="hover:bg-neutral-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {lead.nome.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-900 truncate">{lead.nome}</p>
                          <p className="text-xs text-neutral-500 truncate md:hidden">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm text-neutral-600 truncate">{lead.email}</p>
                      <p className="text-xs text-neutral-500">{lead.telefone}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="neutral" size="sm">{labelOrigem(lead.origem)}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={lead.status === 'novo' ? 'info' : lead.status === 'qualificando' ? 'warning' : lead.status === 'atendido' ? 'success' : 'danger'}
                        dot
                      >
                        {labelStatusLead(lead.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-neutral-500">{formatarDataHora(lead.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal de detalhe */}
      <Dialog
        open={showDetalhe}
        onClose={() => setShowDetalhe(false)}
        title="Detalhes do Lead"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowDetalhe(false)}>Fechar</Button>
            {leadSelecionado && getProximoStatus(leadSelecionado.status) && (
              <Button
                onClick={() => {
                  const proximo = getProximoStatus(leadSelecionado.status)!;
                  handleMoverStatus(leadSelecionado.id, proximo);
                }}
              >
                Avançar status
              </Button>
            )}
          </>
        }
      >
        {leadSelecionado && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {leadSelecionado.nome.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-neutral-900 font-display">{leadSelecionado.nome}</p>
                <Badge
                  variant={leadSelecionado.status === 'novo' ? 'info' : leadSelecionado.status === 'qualificando' ? 'warning' : leadSelecionado.status === 'atendido' ? 'success' : 'danger'}
                  dot
                >
                  {labelStatusLead(leadSelecionado.status)}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={14} className="text-neutral-400" />
                <span className="text-neutral-700">{leadSelecionado.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={14} className="text-neutral-400" />
                <span className="text-neutral-700">{leadSelecionado.telefone}</span>
              </div>
              {leadSelecionado.mensagem && (
                <div className="flex items-start gap-3 text-sm pt-2 border-t border-neutral-200">
                  <MessageSquare size={14} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700 leading-relaxed">{leadSelecionado.mensagem}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-neutral-50 rounded-lg">
                <p className="text-xs text-neutral-500 mb-1">Origem</p>
                <p className="font-semibold text-neutral-900">{labelOrigem(leadSelecionado.origem)}</p>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg">
                <p className="text-xs text-neutral-500 mb-1">Criado em</p>
                <p className="font-semibold text-neutral-900">{formatarDataHora(leadSelecionado.createdAt)}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Alterar status</label>
              <Select
                value={leadSelecionado.status}
                onChange={(e) => {
                  handleMoverStatus(leadSelecionado.id, e.target.value as StatusLead);
                }}
                options={[
                  { value: 'novo', label: 'Novo' },
                  { value: 'qualificando', label: 'Qualificando' },
                  { value: 'atendido', label: 'Atendido' },
                  { value: 'perdido', label: 'Perdido' },
                ]}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

function LeadsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <Card key={j} padding="sm">
                  <div className="flex items-start gap-2.5">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
