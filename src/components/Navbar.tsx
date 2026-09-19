import React, { useRef } from 'react';
import { Dumbbell, UserPlus, RotateCcw, Download, Upload, LogOut, ShieldCheck, Terminal } from 'lucide-react';
import { AuthUser } from '../services/authService';

interface NavbarProps {
  currentUser: AuthUser | null;
  onLogout: () => void;
  onNewStudent: () => void;
  onGoHome: () => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (fileContent: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onNewStudent,
  onGoHome,
  onResetData,
  onExportData,
  onImportData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onImportData(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px] py-2 gap-2 flex-wrap sm:flex-nowrap">
          {/* Logo & Marca */}
          <div 
            onClick={onGoHome}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950 group-hover:scale-105 transition-transform flex-shrink-0">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-400">
                  FitManage
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
                  Full Stack
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                Gestão de Alunos, Treinos e Nutrição
              </p>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap justify-end flex-grow sm:flex-grow-0">
            {/* Input oculto para importação */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />

            {/* Menu de Utilidades de Dados */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
              <button
                onClick={onResetData}
                title="Restaurar dados de demonstração no servidor"
                className="p-1.5 sm:px-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 rounded-md transition-colors text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Resetar</span>
              </button>

              <button
                onClick={onExportData}
                title="Exportar backup completo em JSON"
                className="p-1.5 sm:px-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/60 rounded-md transition-colors text-xs flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Backup</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                title="Importar backup de dados em JSON"
                className="p-1.5 sm:px-2 text-slate-400 hover:text-sky-400 hover:bg-slate-700/60 rounded-md transition-colors text-xs flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Restaurar</span>
              </button>
            </div>

            {/* Link para o Swagger UI - Apenas Visível para o papel DEV */}
            {currentUser?.role === 'dev' && (
              <a
                href="http://localhost:3001/api-docs"
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir Documentação Interativa da API no Swagger (Apenas Devs)"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:border-cyan-500/70 rounded-lg text-xs font-bold transition-all shadow-sm shadow-cyan-950/40"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Swagger</span>
                <span className="text-[9px] bg-cyan-400/20 text-cyan-300 px-1 py-0.2 rounded font-mono uppercase">DEV</span>
              </a>
            )}

            {/* Botão Novo Aluno */}
            <button
              onClick={onNewStudent}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-lg shadow-lg shadow-emerald-950 text-xs transition-all hover:shadow-emerald-900/40 active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-950" />
              <span>Novo Aluno</span>
            </button>

            {/* Usuário Logado & Botão de Sair */}
            {currentUser && (
              <div className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-slate-800">
                {/* Badge no Desktop/Tablet */}
                <div 
                  className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs ${
                    currentUser.role === 'dev'
                      ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
                      : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  }`}
                  title={`Conectado como ${currentUser.username} (${currentUser.roleLabel || currentUser.role})`}
                >
                  {currentUser.role === 'dev' ? (
                    <Terminal className="w-3 h-3 text-cyan-400" />
                  ) : (
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  )}
                  <span className="font-semibold text-white">{currentUser.username}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                    currentUser.role === 'dev' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>

                {/* Badge Compacto no Mobile */}
                <span 
                  className={`sm:hidden text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                    currentUser.role === 'dev' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                  title={`Papel: ${currentUser.role}`}
                >
                  {currentUser.role}
                </span>

                <button
                  onClick={onLogout}
                  title="Sair do sistema (limpar cookie de sessão)"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs flex items-center gap-1 border border-transparent hover:border-rose-500/20"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
