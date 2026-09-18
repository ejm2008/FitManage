import React, { useState } from 'react';
import { authService, AuthUser } from '../services/authService';
import { Dumbbell, User, Lock, Eye, EyeOff, LogIn, AlertCircle, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Por favor, preencha o usuário e a senha.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login(username, password);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(result.error || 'Credenciais inválidas.');
      }
    } catch {
      setErrorMessage('Não foi possível conectar ao servidor. Verifique se a API está em execução.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillAdmin = () => {
    setUsername('admin');
    setPassword('123456');
    setErrorMessage('');
  };

  const handleFillDev = () => {
    setUsername('dev');
    setPassword('123456');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Luzes de fundo decorativas (ambient glow) */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Card Principal */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-950/80">
          {/* Logo e Título Centralizado */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-950/80 mb-4 ring-4 ring-emerald-500/10">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acesso do Instrutor</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-400">
              FitManage
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sistema de Gestão de Alunos, Treinos & Dietas
            </p>
          </div>

          {/* Mensagem de Erro */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulário de Login */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Campo Usuário */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Usuário
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoFocus
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 transition-colors"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botão de Entrar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-sm shadow-xl shadow-emerald-950 transition-all hover:shadow-emerald-900/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-slate-950" />
                  <span>Acessar o Painel</span>
                </>
              )}
            </button>
          </form>

          {/* Banner de Credenciais por Perfil */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-300 text-center mb-2.5">
              Selecione um perfil para teste rápido:
            </p>

            <div className="grid grid-cols-2 gap-2 text-left">
              {/* Opção Admin */}
              <button
                type="button"
                onClick={handleFillAdmin}
                className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition-all text-xs group"
              >
                <div className="font-bold text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                  <span>👑 Admin</span>
                  <span className="text-[10px] text-slate-400">123456</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Gestão de alunos, treinos e dietas</p>
              </button>

              {/* Opção Dev */}
              <button
                type="button"
                onClick={handleFillDev}
                className="p-2.5 rounded-xl bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 transition-all text-xs group"
              >
                <div className="font-bold text-cyan-300 group-hover:text-cyan-200 flex items-center justify-between">
                  <span>💻 Dev</span>
                  <span className="text-[10px] text-cyan-400 font-mono">123456</span>
                </div>
                <p className="text-[10px] text-cyan-400/80 mt-1 font-medium">⚡ Swagger API liberado na tela</p>
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé Informativo */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Sessão autenticada e gerenciada via Cookie de Navegador
        </p>
      </div>
    </div>
  );
};
