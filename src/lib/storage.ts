// Camada de dados que simula a API REST usando localStorage
// Em produção, estas funções seriam chamadas HTTP para /api/*
import { Imovel, Lead, FiltrosImovel, Paginacao, RespostaListagem } from '../types';
import { imoveisMock, leadsMock } from '../data/mock';

const STORAGE_KEYS = {
  imoveis: 'erp_imoveis',
  leads: 'erp_leads',
};

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.imoveis)) {
    localStorage.setItem(STORAGE_KEYS.imoveis, JSON.stringify(imoveisMock));
  }
  if (!localStorage.getItem(STORAGE_KEYS.leads)) {
    localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(leadsMock));
  }
}

// Inicializar na importação
initStorage();

// ===== IMÓVEIS =====

export function getImoveis(
  filtros: FiltrosImovel = {},
  pagina = 1,
  porPagina = 9
): RespostaListagem<Imovel> {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.imoveis) || '[]') as Imovel[];
  
  let filtrados = [...todos];

  if (filtros.busca) {
    const termo = filtros.busca.toLowerCase();
    filtrados = filtrados.filter(
      (i) =>
        i.titulo.toLowerCase().includes(termo) ||
        i.bairro.toLowerCase().includes(termo) ||
        i.cidade.toLowerCase().includes(termo) ||
        i.descricao.toLowerCase().includes(termo)
    );
  }
  if (filtros.bairro) {
    filtrados = filtrados.filter((i) => i.bairro.toLowerCase() === filtros.bairro!.toLowerCase());
  }
  if (filtros.tipo) {
    filtrados = filtrados.filter((i) => i.tipo === filtros.tipo);
  }
  if (filtros.finalidade) {
    filtrados = filtrados.filter((i) => i.finalidade === filtros.finalidade);
  }
  if (filtros.preco_min !== undefined) {
    filtrados = filtrados.filter((i) => i.preco >= filtros.preco_min!);
  }
  if (filtros.preco_max !== undefined) {
    filtrados = filtrados.filter((i) => i.preco <= filtros.preco_max!);
  }
  if (filtros.quartos !== undefined && filtros.quartos > 0) {
    filtrados = filtrados.filter((i) => i.quartos >= filtros.quartos!);
  }
  if (filtros.status) {
    filtrados = filtrados.filter((i) => i.status === filtros.status);
  }

  const total = filtrados.length;
  const totalPaginas = Math.ceil(total / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const dados = filtrados.slice(inicio, inicio + porPagina);

  const paginacao: Paginacao = { pagina, porPagina, total, totalPaginas };
  return { dados, paginacao };
}

export function getImovelById(id: string): Imovel | null {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.imoveis) || '[]') as Imovel[];
  return todos.find((i) => i.id === id) || null;
}

export function createImovel(data: Omit<Imovel, 'id' | 'createdAt' | 'updatedAt'>): Imovel {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.imoveis) || '[]') as Imovel[];
  const novo: Imovel = {
    ...data,
    id: `imv-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  todos.push(novo);
  localStorage.setItem(STORAGE_KEYS.imoveis, JSON.stringify(todos));
  return novo;
}

export function updateImovel(id: string, data: Partial<Imovel>): Imovel | null {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.imoveis) || '[]') as Imovel[];
  const index = todos.findIndex((i) => i.id === id);
  if (index === -1) return null;
  todos[index] = { ...todos[index], ...data, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.imoveis, JSON.stringify(todos));
  return todos[index];
}

export function deleteImovel(id: string): boolean {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.imoveis) || '[]') as Imovel[];
  const filtrados = todos.filter((i) => i.id !== id);
  if (filtrados.length === todos.length) return false;
  localStorage.setItem(STORAGE_KEYS.imoveis, JSON.stringify(filtrados));
  return true;
}

// ===== LEADS =====

export function getLeads(): Lead[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.leads) || '[]') as Lead[];
}

export function createLead(data: Omit<Lead, 'id' | 'createdAt'>): Lead {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.leads) || '[]') as Lead[];
  const novo: Lead = {
    ...data,
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  todos.push(novo);
  localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(todos));
  return novo;
}

export function updateLead(id: string, data: Partial<Lead>): Lead | null {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.leads) || '[]') as Lead[];
  const index = todos.findIndex((l) => l.id === id);
  if (index === -1) return null;
  todos[index] = { ...todos[index], ...data };
  localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(todos));
  return todos[index];
}

// ===== UTILS =====

export function getBairros(): string[] {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.imoveis) || '[]') as Imovel[];
  return [...new Set(todos.map((i) => i.bairro))].sort();
}

export function getImovelCount(): number {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.imoveis) || '[]') as Imovel[];
  return todos.length;
}

export function getLeadCount(): number {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.leads) || '[]') as Lead[];
  return todos.length;
}

export function getLeadCountByStatus(): Record<string, number> {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.leads) || '[]') as Lead[];
  return {
    novo: todos.filter((l) => l.status === 'novo').length,
    qualificando: todos.filter((l) => l.status === 'qualificando').length,
    atendido: todos.filter((l) => l.status === 'atendido').length,
    perdido: todos.filter((l) => l.status === 'perdido').length,
  };
}
