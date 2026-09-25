// Tipos TypeScript baseados no schema Prisma

export type TipoImovel = 'casa' | 'apartamento' | 'terreno' | 'comercial';
export type FinalidadeImovel = 'venda' | 'aluguel';
export type StatusImovel = 'disponivel' | 'reservado' | 'vendido' | 'alugado';
export type OrigemLead = 'site' | 'indicacao' | 'portal';
export type StatusLead = 'novo' | 'qualificando' | 'atendido' | 'perdido';
export type PapelUsuario = 'admin' | 'corretor';

export interface Imovel {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoImovel;
  finalidade: FinalidadeImovel;
  preco: number;
  area: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude?: number;
  longitude?: number;
  status: StatusImovel;
  fotos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  mensagem?: string;
  imovelId?: string;
  origem: OrigemLead;
  status: StatusLead;
  createdAt: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string; // Em produção, seria hash
  papel: PapelUsuario;
  createdAt: string;
  updatedAt: string;
}

export interface FiltrosImovel {
  bairro?: string;
  tipo?: TipoImovel;
  finalidade?: FinalidadeImovel;
  preco_min?: number;
  preco_max?: number;
  quartos?: number;
  status?: StatusImovel;
  busca?: string;
}

export interface Paginacao {
  pagina: number;
  porPagina: number;
  total: number;
  totalPaginas: number;
}

export interface RespostaListagem<T> {
  dados: T[];
  paginacao: Paginacao;
}
