// Formatação de valores
export function formatarPreco(valor: number, finalidade: 'venda' | 'aluguel'): string {
  const formatado = valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return finalidade === 'aluguel' ? `${formatado}/mês` : formatado;
}

export function formatarArea(area: number): string {
  return `${area} m²`;
}

export function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatarDataHora(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function labelTipo(tipo: string): string {
  const map: Record<string, string> = {
    casa: 'Casa',
    apartamento: 'Apartamento',
    terreno: 'Terreno',
    comercial: 'Comercial',
  };
  return map[tipo] || tipo;
}

export function labelFinalidade(f: string): string {
  return f === 'venda' ? 'Venda' : 'Aluguel';
}

export function labelStatusImovel(s: string): string {
  const map: Record<string, string> = {
    disponivel: 'Disponível',
    reservado: 'Reservado',
    vendido: 'Vendido',
    alugado: 'Alugado',
  };
  return map[s] || s;
}

export function labelStatusLead(s: string): string {
  const map: Record<string, string> = {
    novo: 'Novo',
    qualificando: 'Qualificando',
    atendido: 'Atendido',
    perdido: 'Perdido',
  };
  return map[s] || s;
}

export function labelOrigem(o: string): string {
  const map: Record<string, string> = {
    site: 'Site',
    indicacao: 'Indicação',
    portal: 'Portal',
  };
  return map[o] || o;
}

export function corStatusImovel(s: string): string {
  const map: Record<string, string> = {
    disponivel: 'bg-green-100 text-green-800',
    reservado: 'bg-yellow-100 text-yellow-800',
    vendido: 'bg-red-100 text-red-800',
    alugado: 'bg-blue-100 text-blue-800',
  };
  return map[s] || 'bg-gray-100 text-gray-800';
}

export function corStatusLead(s: string): string {
  const map: Record<string, string> = {
    novo: 'bg-blue-100 text-blue-800',
    qualificando: 'bg-yellow-100 text-yellow-800',
    atendido: 'bg-green-100 text-green-800',
    perdido: 'bg-red-100 text-red-800',
  };
  return map[s] || 'bg-gray-100 text-gray-800';
}
