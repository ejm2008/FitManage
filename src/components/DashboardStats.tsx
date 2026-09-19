import React from 'react';
import { Student, StudentLevel } from '../types';
import { Users, Activity, Flame, Dumbbell, Utensils } from 'lucide-react';

interface DashboardStatsProps {
  students: Student[];
  totalWorkouts: number;
  totalDiets: number;
  selectedLevelFilter: StudentLevel | 'Todos';
  onSelectLevelFilter: (level: StudentLevel | 'Todos') => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  students,
  totalWorkouts,
  totalDiets,
  selectedLevelFilter,
  onSelectLevelFilter,
}) => {
  const total = students.length;
  const iniciantes = students.filter(s => s.level === 'Iniciante').length;
  const intermediarios = students.filter(s => s.level === 'Intermediário').length;
  const avancados = students.filter(s => s.level === 'Avançado').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6">
      {/* Total de Alunos */}
      <div 
        onClick={() => onSelectLevelFilter('Todos')}
        className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
          selectedLevelFilter === 'Todos'
            ? 'bg-slate-800/90 border-emerald-500/50 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-950/20'
            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-400">Total de Alunos</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{total}</div>
        <p className="text-xs text-slate-400 mt-0.5">Todos os alunos ativos</p>
      </div>

      {/* Iniciantes */}
      <div 
        onClick={() => onSelectLevelFilter('Iniciante')}
        className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
          selectedLevelFilter === 'Iniciante'
            ? 'bg-slate-800/90 border-emerald-500/50 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-950/20'
            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-emerald-400">Iniciantes</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{iniciantes}</div>
        <p className="text-xs text-slate-400 mt-0.5">
          {total > 0 ? `${Math.round((iniciantes / total) * 100)}% da academia` : '0%'}
        </p>
      </div>

      {/* Intermediários */}
      <div 
        onClick={() => onSelectLevelFilter('Intermediário')}
        className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
          selectedLevelFilter === 'Intermediário'
            ? 'bg-slate-800/90 border-blue-500/50 ring-1 ring-blue-500/40 shadow-lg shadow-blue-950/20'
            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-blue-400">Intermediários</span>
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Flame className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{intermediarios}</div>
        <p className="text-xs text-slate-400 mt-0.5">
          {total > 0 ? `${Math.round((intermediarios / total) * 100)}% da academia` : '0%'}
        </p>
      </div>

      {/* Avançados & Métricas Rápidas */}
      <div 
        onClick={() => onSelectLevelFilter('Avançado')}
        className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
          selectedLevelFilter === 'Avançado'
            ? 'bg-slate-800/90 border-purple-500/50 ring-1 ring-purple-500/40 shadow-lg shadow-purple-950/20'
            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-purple-400">Avançados</span>
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
            <Dumbbell className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{avancados}</div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mt-0.5">
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <Dumbbell className="w-3 h-3" /> {totalWorkouts} treinos
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-amber-400">
            <Utensils className="w-3 h-3" /> {totalDiets} dietas
          </span>
        </div>
      </div>
    </div>
  );
};
