// Autenticação simulada (em produção, usar JWT + bcrypt)
import { Usuario, PapelUsuario } from '../types';
import { usuariosMock } from '../data/mock';

const AUTH_KEY = 'erp_auth';

interface AuthState {
  usuario: Omit<Usuario, 'senha'>;
  token: string;
}

export function login(email: string, senha: string): AuthState | null {
  const user = usuariosMock.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
  );
  if (!user) return null;

  const { senha: _, ...usuarioSemSenha } = user;
  const state: AuthState = {
    usuario: usuarioSemSenha,
    token: `token-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(state));
  return state;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getAuth(): AuthState | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getAuth() !== null;
}

export function hasRole(papel: PapelUsuario): boolean {
  const auth = getAuth();
  return auth?.usuario.papel === papel;
}

export function requireAuth(): AuthState {
  const auth = getAuth();
  if (!auth) {
    throw new Error('Não autenticado');
  }
  return auth;
}
