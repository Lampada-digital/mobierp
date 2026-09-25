import { useState } from 'react';
import { getLeads, updateLead, getImovelById } from '../../lib/storage';
import { formatarDataHora, labelStatusLead, labelOrigem, corStatusLead } from '../../lib/utils';
import { Badge, Card, Button, Modal, Select } from '../../components/ui';
import { Lead, StatusLead } from '../../types';
import { GripVertical, Mail, Phone, MessageSquare, ChevronRight } from 'lucide-react';

const colunas: { status: StatusLead; label: string; cor: string }[] = [
  { status: 'novo', label: 'Novo', cor: 'bg-blue-500' },
  { status: 'qualificando', label: 'Qualificando', cor: 'bg-yellow-500' },
  { status: 'atendido', label: 'Atendido', cor: 'bg-green-500' },
  { status: 'perdido', label: 'Perdido', cor: 'bg-red-500' },
];

export function LeadsPage() {
  const [leads, setLeads] = useState(getLeads());
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null);
  const [showDetalhe, setShowDetalhe] = useState(false);

  const handleMoverStatus = (leadId: string, novoStatus: StatusLead) => {
    updateLead(leadId, { status: novoStatus });
    setLeads(getLeads());
  };

  const verDetalhe = (lead: Lead) => {
    setLeadSelecionado(lead);
    setShowDetalhe(true);
  };

  const getProximoStatus = (status: StatusLead): StatusLead | null => {
    const order: StatusLead[] = ['novo', 'qualificando', 'atendido'];
    const idx = order.indexOf(status);
    if (idx === -1 || idx >= order.length - 1) return null;
    return order[idx + 1];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600 text-sm mt-1">Gerencie seus leads no kanban</p>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {colunas.map((coluna) => {
          const leadsColuna = leads.filter((l) => l.status === coluna.status);
          return (
            <div key={coluna.status} className="space-y-3">
              {/* Header da coluna */}
              <div className="flex items-center gap-2 px-1">
                <div className={`w-3 h-3 rounded-full ${coluna.cor}`} />
                <h3 className="font-semibold text-gray-900 text-sm">{coluna.label}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {leadsColuna.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-[200px]">
                {leadsColuna.map((lead) => {
                  const imovel = lead.imovelId ? getImovelById(lead.imovelId) : null;
                  const proximoStatus = getProximoStatus(lead.status);
                  return (
                    <Card key={lead.id} className="p-3 cursor-pointer" onClick={() => verDetalhe(lead)}>
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                          {lead.nome.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{lead.nome}</p>
                          <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                          {imovel && (
                            <p className="text-xs text-blue-600 mt-1 truncate">📍 {imovel.titulo}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-gray-100 text-gray-600 text-[10px]">
                              {labelOrigem(lead.origem)}
                            </Badge>
                            <span className="text-[10px] text-gray-400">
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
                          className="mt-2 w-full flex items-center justify-center gap-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg py-1.5 transition-colors"
                        >
                          Mover para {labelStatusLead(proximoStatus)} <ChevronRight size={12} />
                        </button>
                      )}
                    </Card>
                  );
                })}
                {leadsColuna.length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    Sem leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de detalhe */}
      <Modal
        open={showDetalhe}
        onClose={() => setShowDetalhe(false)}
        title="Detalhes do Lead"
      >
        {leadSelecionado && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600">
                {leadSelecionado.nome.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{leadSelecionado.nome}</p>
                <Badge className={corStatusLead(leadSelecionado.status)}>
                  {labelStatusLead(leadSelecionado.status)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={14} />
                <span>{leadSelecionado.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={14} />
                <span>{leadSelecionado.telefone}</span>
              </div>
              {leadSelecionado.mensagem && (
                <div className="flex items-start gap-2 text-gray-600">
                  <MessageSquare size={14} className="mt-0.5" />
                  <span>{leadSelecionado.mensagem}</span>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Origem: {labelOrigem(leadSelecionado.origem)} | Criado: {formatarDataHora(leadSelecionado.createdAt)}
              </p>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Alterar status</label>
              <Select
                value={leadSelecionado.status}
                onChange={(e) => {
                  handleMoverStatus(leadSelecionado.id, e.target.value as StatusLead);
                  setLeadSelecionado({ ...leadSelecionado, status: e.target.value as StatusLead });
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
      </Modal>
    </div>
  );
}
