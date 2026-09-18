import { apiRequest } from './apiClient';
import { AuthUser, UserRole } from '../types';

export type { AuthUser, UserRole };

const SESSION_COOKIE_NAME = 'fitmanage_session';

export const authService = {
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  },

  async login(username: string, password: string): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    try {
      const data = await apiRequest<{ success: boolean; user: AuthUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao autenticar' };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Ignora falha de rede ao sair
    }
    document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  },

  async checkAuth(): Promise<AuthUser | null> {
    try {
      const res = await apiRequest<{ authenticated: boolean; user: AuthUser }>('/auth/me');
      return res.user || null;
    } catch {
      return null;
    }
  },

  getCurrentUser(): AuthUser | null {
    const cookieData = this.getCookie(SESSION_COOKIE_NAME);
    if (!cookieData) return null;
    try {
      return JSON.parse(cookieData) as AuthUser;
    } catch {
      return null;
    }
  },
};
