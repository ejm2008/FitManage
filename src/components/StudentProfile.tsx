import React, { useState } from 'react';
import { Student, Workout, DietPlan } from '../types';
import { calculateBmi, calculateWaterIntake, getLevelBadge } from '../utils/healthCalculators';
import { WorkoutManager } from './WorkoutManager';
import { DietManager } from './DietManager';
import { 
  ArrowLeft, 
  Dumbbell, 
  Utensils, 
  User, 
  Edit3, 
  Trash2, 
  Target, 
  Calendar, 
  Droplets, 
  Activity, 
  Phone, 
  Mail, 
  AlertTriangle 
} from 'lucide-react';

interface StudentProfileProps {
  student: Student;
  workouts: Workout[];
  dietPlan?: DietPlan;
  initialTab?: 'overview' | 'workouts' | 'diet';
  onBack: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string, studentName: string) => void;
  onSaveWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onDeleteWorkout: (workoutId: string) => void;
  onSaveDiet: (diet: Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onDeleteDiet: (studentId: string) => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  workouts,
  dietPlan,
  initialTab = 'overview',
  onBack,
  onEditStudent,
  onDeleteStudent,
  onSaveWorkout,
  onDeleteWorkout,
  onSaveDiet,
  onDeleteDiet,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workouts' | 'diet'>(initialTab);

  const bmiInfo = calculateBmi(student.weight, student.height);
  const levelBadge = getLevelBadge(student.level);
  const waterTarget = calculateWaterIntake(student.weight);

  return (
    <div className="space-y-6">
      {/* Botão Voltar e Ações do Topo */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Alunos</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditStudent(student)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Editar Cadastro</span>
          </button>
          <button
            onClick={() => onDeleteStudent(student.id, student.name)}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/20 transition-colors"
            title="Excluir Aluno"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cartão de Perfil do Aluno */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            {/* Avatar com Iniciais */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-950 flex-shrink-0">
              {student.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {student.name}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${levelBadge.badgeClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${levelBadge.dotClass}`} />
                  {levelBadge.label}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Target className="w-4 h-4" />
                  {student.goal}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  {student.age} anos
                </span>
                {student.phone && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {student.phone}
                    </span>
                  </>
                )}
                {student.email && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {student.email}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Biométricas do Aluno */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
            <span className="text-xs text-slate-400 block mb-1">Peso Atual</span>
            <span className="text-xl font-bold text-white">{student.weight}</span>
            <span className="text-xs text-slate-400 font-normal ml-1">kg</span>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
            <span className="text-xs text-slate-400 block mb-1">Altura</span>
            <span className="text-xl font-bold text-white">{student.height}</span>
            <span className="text-xs text-slate-400 font-normal ml-1">cm</span>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
            <span className="text-xs text-slate-400 block mb-1">IMC Corporal</span>
            <div className="flex items-center justify-center gap-2">
              <span className={`text-xl font-bold ${bmiInfo.colorClass}`}>{bmiInfo.bmi}</span>
            </div>
            <span className={`inline-block text-[10px] mt-0.5 px-2 py-0.2 rounded font-semibold ${bmiInfo.badgeText}`}>
              {bmiInfo.classification}
            </span>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
            <span className="text-xs text-slate-400 block mb-1">Meta Hídrica Diária</span>
            <span className="text-xl font-bold text-sky-400">{waterTarget}</span>
            <span className="text-xs text-slate-400 font-normal ml-1">ml</span>
          </div>
        </div>

        {/* Alerta de Restrições Médicas */}
        {student.medicalConditions && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-amber-300">Atenção a Restrições: </strong>
              <span>{student.medicalConditions}</span>
            </div>
          </div>
        )}
      </div>

        {/* Barra de Abas (Tabs) */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Visão Geral</span>
        </button>

        <button
          onClick={() => setActiveTab('workouts')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'workouts'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Treinos</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {workouts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('diet')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'diet'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Dieta & Nutrição</span>
          {dietPlan && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
              {dietPlan.meals.length}
            </span>
          )}
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Resumo dos Treinos */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Ficha de Treinos</h4>
                  <span className="text-xs text-slate-400">{workouts.length} divisões ativas</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('workouts')}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                Gerenciar Treinos →
              </button>
            </div>

            {workouts.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">Nenhum treino cadastrado.</p>
            ) : (
              <div className="space-y-2">
                {workouts.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => setActiveTab('workouts')}
                    className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-200">{w.name}</span>
                      <p className="text-xs text-slate-400">{w.targetMuscles}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300">
                      {w.exercises.length} exercícios
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card Resumo da Dieta */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Plano Nutricional</h4>
                  <span className="text-xs text-slate-400">
                    {dietPlan ? `${dietPlan.meals.length} refeições planejadas` : 'Sem plano cadastrado'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('diet')}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                {dietPlan ? 'Ver Dieta Completa →' : 'Criar Dieta →'}
              </button>
            </div>

            {dietPlan ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-sm font-bold text-slate-200 block">{dietPlan.title}</span>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="text-sky-400 flex items-center gap-1">
                      <Droplets className="w-3 h-3" /> {dietPlan.dailyWaterMl}ml água
                    </span>
                    {dietPlan.targetCalories && (
                      <span className="text-amber-400">
                        {dietPlan.targetCalories} kcal alvo
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  {dietPlan.meals.slice(0, 3).map((m) => (
                    <div key={m.id} className="text-xs flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/50">
                      <span className="font-medium text-slate-300">{m.time} - {m.name}</span>
                      <span className="text-slate-400">{m.items.length} alimentos</span>
                    </div>
                  ))}
                  {dietPlan.meals.length > 3 && (
                    <p className="text-[11px] text-slate-400 text-center pt-1">
                      + mais {dietPlan.meals.length - 3} refeições cadastradas
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-4 text-center">Nenhuma dieta cadastrada para este aluno.</p>
            )}
          </div>

          {/* Card Observações & Histórico */}
          <div className="col-span-1 md:col-span-2 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-2">
            <h4 className="font-bold text-white text-sm">Observações & Anotações do Instrutor</h4>
            <p className="text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 leading-relaxed">
              {student.notes || 'Nenhuma observação adicional anotada para este aluno.'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'workouts' && (
        <WorkoutManager
          student={student}
          workouts={workouts}
          onSaveWorkout={onSaveWorkout}
          onDeleteWorkout={onDeleteWorkout}
        />
      )}

      {activeTab === 'diet' && (
        <DietManager
          student={student}
          dietPlan={dietPlan}
          onSaveDiet={onSaveDiet}
          onDeleteDiet={onDeleteDiet}
        />
      )}
    </div>
  );
};
