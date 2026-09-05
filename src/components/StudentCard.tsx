import React from 'react';
import { Student } from '../types';
import { calculateBmi, getLevelBadge } from '../utils/healthCalculators';
import { Dumbbell, Utensils, ChevronRight, Edit3, Trash2, Target, Calendar } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  workoutCount: number;
  hasDiet: boolean;
  onSelect: (student: Student, defaultTab?: 'overview' | 'workouts' | 'diet') => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string, studentName: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  workoutCount,
  hasDiet,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const bmiInfo = calculateBmi(student.weight, student.height);
  const levelBadge = getLevelBadge(student.level);

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-slate-700/80 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-slate-950/50 group">
      <div>
        {/* Top bar: Level badge & Action buttons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${levelBadge.badgeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${levelBadge.dotClass}`} />
            {levelBadge.label}
          </span>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(student);
              }}
              title="Editar dados cadastrais"
              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(student.id, student.name);
              }}
              title="Excluir aluno"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Student Name and Basic Info */}
        <div 
          onClick={() => onSelect(student, 'overview')}
          className="cursor-pointer"
        >
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {student.name}
          </h3>
          
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {student.age} anos
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Target className="w-3.5 h-3.5" />
              {student.goal}
            </span>
          </div>
        </div>

        {/* Physical Stats Box */}
        <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-center">
          <div>
            <div className="text-[11px] text-slate-400">Peso</div>
            <div className="text-sm font-semibold text-slate-200">{student.weight} <span className="text-[10px] text-slate-400 font-normal">kg</span></div>
          </div>
          <div className="border-x border-slate-800">
            <div className="text-[11px] text-slate-400">Altura</div>
            <div className="text-sm font-semibold text-slate-200">{student.height} <span className="text-[10px] text-slate-400 font-normal">cm</span></div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">IMC</div>
            <div className={`text-sm font-semibold ${bmiInfo.colorClass}`}>{bmiInfo.bmi}</div>
          </div>
        </div>

        {/* IMC Classification Pill */}
        <div className="mt-2 text-center">
          <span className={`inline-block text-[11px] px-2 py-0.5 rounded-md border ${bmiInfo.badgeBg} ${bmiInfo.badgeText} font-medium`}>
            {bmiInfo.classification}
          </span>
        </div>

        {/* Restrictions or Notes */}
        {student.medicalConditions && (
          <p className="mt-3 text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg line-clamp-2">
            ⚠️ {student.medicalConditions}
          </p>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Badge Treinos */}
          <button
            onClick={() => onSelect(student, 'workouts')}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors border border-slate-700/50"
            title="Ver treinos cadastrados"
          >
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            <span>{workoutCount} treinos</span>
          </button>

          {/* Badge Dieta */}
          <button
            onClick={() => onSelect(student, 'diet')}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors border ${
              hasDiet 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border-slate-700/50' 
                : 'bg-slate-900/50 text-slate-400 border-dashed border-slate-700 hover:border-slate-600'
            }`}
            title="Ver plano alimentar"
          >
            <Utensils className={`w-3.5 h-3.5 ${hasDiet ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>{hasDiet ? 'Dieta Ativa' : 'Sem Dieta'}</span>
          </button>
        </div>

        {/* View profile button */}
        <button
          onClick={() => onSelect(student, 'overview')}
          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors"
          title="Abrir ficha completa"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
