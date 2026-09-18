import { Request, Response } from 'express';
import { AuthUser } from '../types/index.js';

const SESSION_COOKIE_NAME = 'fitmanage_session';

export const authController = {
  login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Informe o usuário e a senha.',
      });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    let user: AuthUser | null = null;

    if (cleanUsername === 'admin' && (cleanPassword === '123456' || cleanPassword === 'admin123')) {
      user = {
        username: 'admin',
        role: 'admin',
        roleLabel: 'Administrador',
        loginTime: new Date().toISOString(),
      };
    } else if (cleanUsername === 'dev' && (cleanPassword === '123456' || cleanPassword === 'dev123')) {
      user = {
        username: 'dev',
        role: 'dev',
        roleLabel: 'Desenvolvedor (Dev)',
        loginTime: new Date().toISOString(),
      };
    }

    if (user) {
      // Define o cookie de sessão http
      res.cookie(SESSION_COOKIE_NAME, JSON.stringify(user), {
        httpOnly: false, // Permite leitura no frontend para sincronismo
        maxAge: 24 * 60 * 60 * 1000, // 1 dia
        path: '/',
        sameSite: 'lax',
      });

      return res.status(200).json({
        success: true,
        user,
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Usuário ou senha inválidos. Opções de teste: admin / 123456 ou dev / 123456',
    });
  },

  logout(req: Request, res: Response) {
    res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    return res.status(200).json({
      success: true,
      message: 'Sessão encerrada com sucesso',
    });
  },

  me(req: Request, res: Response) {
    const cookieData = req.cookies?.[SESSION_COOKIE_NAME];
    if (!cookieData) {
      return res.status(401).json({
        authenticated: false,
        message: 'Não autenticado',
      });
    }

    try {
      const user = JSON.parse(cookieData) as AuthUser;
      return res.status(200).json({
        authenticated: true,
        user,
      });
    } catch {
      return res.status(401).json({
        authenticated: false,
        message: 'Sessão inválida',
      });
    }
  },
};
