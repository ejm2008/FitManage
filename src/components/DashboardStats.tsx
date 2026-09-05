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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {/* Total de Alunos */}
      <div 
        onClick={() => onSelectLevelFilter('Todos')}
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
          selectedLevelFilter === 'Todos'
            ? 'bg-slate-800/90 border-emerald-500/50 ring-1 ring-emerald-500/40'
            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Total de Alunos</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{total}</div>
        <p className="text-[11px] text-slate-400 mt-1">Todos os alunos ativos</p>
      </div>

      {/* Iniciantes */}
      <div 
        onClick={() => onSelectLevelFilter('Iniciante')}
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
          selectedLevelFilter === 'Iniciante'
            ? 'bg-slate-800/90 border-emerald-500/50 ring-1 ring-emerald-500/40'
            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-emerald-400">Iniciantes</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{iniciantes}</div>
        <p className="text-[11px] text-slate-400 mt-1">
          {total > 0 ? `${Math.round((iniciantes / total) * 100)}% da academia` : '0%'}
        </p>
      </div>

      {/* Intermediários */}
      <div 
        onClick={() => onSelectLevelFilter('Intermediário')}
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
          selectedLevelFilter === 'Intermediário'
            ? 'bg-slate-800/90 border-blue-500/50 ring-1 ring-blue-500/40'
            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-400">Intermediários</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{intermediarios}</div>
        <p className="text-[11px] text-slate-400 mt-1">
          {total > 0 ? `${Math.round((intermediarios / total) * 100)}% da academia` : '0%'}
        </p>
      </div>

      {/* Avançados */}
      <div 
        onClick={() => onSelectLevelFilter('Avançado')}
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
          selectedLevelFilter === 'Avançado'
            ? 'bg-slate-800/90 border-purple-500/50 ring-1 ring-purple-500/40'
            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-purple-400">Avançados</span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Dumbbell className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{avancados}</div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
          <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3 text-emerald-400" /> {totalWorkouts} treinos</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Utensils className="w-3 h-3 text-amber-400" /> {totalDiets} dietas</span>
        </div>
      </div>
    </div>
  );
};
