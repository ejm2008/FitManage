import React, { useRef } from 'react';
import { Dumbbell, UserPlus, RotateCcw, Download, Upload, LogOut, ShieldCheck, FileCode2 } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marca */}
          <div 
            onClick={onGoHome}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-400">
                  FitManage
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
                  Mock DB
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Gestão de Alunos, Treinos e Nutrição
              </p>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Input oculto para importação */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />

            {/* Menu de Utilidades de Dados */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700/60">
              <button
                onClick={onResetData}
                title="Restaurar dados de demonstração (mock inicial)"
                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 rounded-md transition-colors text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden md:inline">Resetar Demo</span>
              </button>

              <button
                onClick={onExportData}
                title="Exportar backup completo em JSON"
                className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/60 rounded-md transition-colors text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Backup</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                title="Importar backup de dados em JSON"
                className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-700/60 rounded-md transition-colors text-xs flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden md:inline">Restaurar</span>
              </button>
            </div>

            {/* Link para o Swagger UI */}
            <a
              href="http://localhost:3001/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir Documentação Interativa da API no Swagger"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 rounded-lg text-xs font-semibold transition-all shadow-sm shadow-emerald-950"
            >
              <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Swagger API</span>
            </a>

            {/* Botão Novo Aluno */}
            <button
              onClick={onNewStudent}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold rounded-lg shadow-lg shadow-emerald-950 text-xs sm:text-sm transition-all hover:shadow-emerald-900/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Novo Aluno</span>
            </button>

            {/* Usuário Logado & Botão de Sair */}
            {currentUser && (
              <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-slate-800">
                <div 
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs text-slate-300"
                  title={`Conectado como ${currentUser.username} (${currentUser.role})`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-white">{currentUser.username}</span>
                </div>

                <button
                  onClick={onLogout}
                  title="Sair do sistema (limpar cookie de sessão)"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs flex items-center gap-1.5 border border-transparent hover:border-rose-500/20"
                >
                  <LogOut className="w-4 h-4" />
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
