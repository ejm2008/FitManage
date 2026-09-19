import React, { useState } from 'react';
import { Workout, Exercise, Student } from '../types';
import { 
  Plus, 
  Dumbbell, 
  Trash2, 
  Edit2, 
  Clock, 
  Layers, 
  Weight, 
  Check, 
  X,
  Printer
} from 'lucide-react';

interface WorkoutManagerProps {
  student: Student;
  workouts: Workout[];
  onSaveWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onDeleteWorkout: (workoutId: string) => void;
}

const MUSCLE_GROUPS = [
  'Peito',
  'Costas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Antebraço',
  'Quadríceps',
  'Posterior de Coxa',
  'Panturrilha',
  'Glúteos',
  'Abdômen / Core',
  'Cardio / Aeróbico',
];

export const WorkoutManager: React.FC<WorkoutManagerProps> = ({
  student,
  workouts,
  onSaveWorkout,
  onDeleteWorkout,
}) => {
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(
    workouts.length > 0 ? workouts[0].id : null
  );

  // Modal para criar/editar Treino
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDivision, setWorkoutDivision] = useState('A');
  const [workoutMuscles, setWorkoutMuscles] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Modal para adicionar/editar Exercício
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [exName, setExName] = useState('');
  const [exMuscle, setExMuscle] = useState(MUSCLE_GROUPS[0]);
  const [exSets, setExSets] = useState<number>(4);
  const [exReps, setExReps] = useState('10 - 12');
  const [exLoad, setExLoad] = useState('');
  const [exRest, setExRest] = useState<number>(60);
  const [exNotes, setExNotes] = useState('');

  const activeWorkout = workouts.find((w) => w.id === activeWorkoutId) || workouts[0] || null;

  // Abrir modal de criação de treino
  const openNewWorkoutModal = () => {
    setEditingWorkout(null);
    const divisions = ['A', 'B', 'C', 'D', 'E'];
    const nextDivision = divisions[workouts.length % divisions.length] || 'A';
    setWorkoutDivision(nextDivision);
    setWorkoutName(`Treino ${nextDivision}`);
    setWorkoutMuscles('');
    setWorkoutNotes('');
    setIsWorkoutModalOpen(true);
  };

  // Abrir modal de edição de treino
  const openEditWorkoutModal = (w: Workout) => {
    setEditingWorkout(w);
    setWorkoutName(w.name);
    setWorkoutDivision(w.division);
    setWorkoutMuscles(w.targetMuscles);
    setWorkoutNotes(w.notes || '');
    setIsWorkoutModalOpen(true);
  };

  // Salvar treino
  const handleSaveWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutName.trim()) return;

    onSaveWorkout({
      id: editingWorkout ? editingWorkout.id : undefined,
      studentId: student.id,
      name: workoutName.trim(),
      division: workoutDivision,
      targetMuscles: workoutMuscles.trim() || 'Geral',
      notes: workoutNotes.trim() || undefined,
      exercises: editingWorkout ? editingWorkout.exercises : [],
    });

    setIsWorkoutModalOpen(false);
  };

  // Abrir modal de novo exercício
  const openNewExerciseModal = () => {
    setEditingExercise(null);
    setExName('');
    setExMuscle(MUSCLE_GROUPS[0]);
    setExSets(4);
    setExReps('10 - 12');
    setExLoad('');
    setExRest(60);
    setExNotes('');
    setIsExerciseModalOpen(true);
  };

  // Abrir modal de edição de exercício
  const openEditExerciseModal = (ex: Exercise) => {
    setEditingExercise(ex);
    setExName(ex.name);
    setExMuscle(ex.muscleGroup);
    setExSets(ex.sets);
    setExReps(ex.reps);
    setExLoad(ex.loadKg ? String(ex.loadKg) : '');
    setExRest(ex.restSeconds || 60);
    setExNotes(ex.notes || '');
    setIsExerciseModalOpen(true);
  };

  // Salvar exercício no treino ativo
  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkout || !exName.trim()) return;

    let updatedExercises: Exercise[];

    if (editingExercise) {
      updatedExercises = activeWorkout.exercises.map((ex) =>
        ex.id === editingExercise.id
          ? {
              ...ex,
              name: exName.trim(),
              muscleGroup: exMuscle,
              sets: Number(exSets),
              reps: exReps.trim(),
              loadKg: exLoad.trim() || undefined,
              restSeconds: Number(exRest),
              notes: exNotes.trim() || undefined,
            }
          : ex
      );
    } else {
      const newEx: Exercise = {
        id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        name: exName.trim(),
        muscleGroup: exMuscle,
        sets: Number(exSets),
        reps: exReps.trim(),
        loadKg: exLoad.trim() || undefined,
        restSeconds: Number(exRest),
        notes: exNotes.trim() || undefined,
      };
      updatedExercises = [...activeWorkout.exercises, newEx];
    }

    onSaveWorkout({
      id: activeWorkout.id,
      studentId: student.id,
      name: activeWorkout.name,
      division: activeWorkout.division,
      targetMuscles: activeWorkout.targetMuscles,
      notes: activeWorkout.notes,
      exercises: updatedExercises,
    });

    setIsExerciseModalOpen(false);
  };

  // Remover exercício
  const handleDeleteExercise = (exId: string) => {
    if (!activeWorkout) return;
    const updatedExercises = activeWorkout.exercises.filter((ex) => ex.id !== exId);
    onSaveWorkout({
      id: activeWorkout.id,
      studentId: student.id,
      name: activeWorkout.name,
      division: activeWorkout.division,
      targetMuscles: activeWorkout.targetMuscles,
      notes: activeWorkout.notes,
      exercises: updatedExercises,
    });
  };

  // Imprimir ficha de treino
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header com Abas de Divisões e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-slate-900/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
        {/* Abas das Divisões de Treino */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full sm:w-auto pb-1 sm:pb-0">
          {workouts.map((w) => {
            const isSelected = activeWorkout?.id === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setActiveWorkoutId(w.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950 scale-105'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>{w.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                  {w.exercises.length}
                </span>
              </button>
            );
          })}

          <button
            onClick={openNewWorkoutModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-emerald-400 border border-dashed border-emerald-500/30 text-xs font-semibold hover:border-emerald-500/60 transition-all whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Divisão</span>
          </button>
        </div>

        {/* Botão de Impressão */}
        {activeWorkout && (
          <button
            onClick={handlePrint}
            title="Imprimir ficha de treino"
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors w-full sm:w-auto flex-shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ficha</span>
          </button>
        )}
      </div>

      {/* Conteúdo do Treino Selecionado */}
      {activeWorkout ? (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-6">
          {/* Header do Treino */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 font-extrabold flex items-center justify-center text-sm border border-emerald-500/30">
                  {activeWorkout.division}
                </span>
                <h3 className="text-xl font-bold text-white">{activeWorkout.name}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                <strong>Grupos Foco:</strong> {activeWorkout.targetMuscles}
              </p>
              {activeWorkout.notes && (
                <p className="text-xs text-slate-400 mt-0.5">
                  <strong>Recomendações:</strong> {activeWorkout.notes}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => openEditWorkoutModal(activeWorkout)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar Treino</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Excluir ${activeWorkout.name}?`)) {
                    onDeleteWorkout(activeWorkout.id);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
                title="Excluir este treino"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lista de Exercícios */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span>Exercícios Cadastrados</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400">
                  {activeWorkout.exercises.length}
                </span>
              </h4>

              <button
                onClick={openNewExerciseModal}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold transition-colors w-full sm:w-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Exercício</span>
              </button>
            </div>

            {activeWorkout.exercises.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-400">Nenhum exercício cadastrado para este treino.</p>
                <p className="text-xs text-slate-400 mt-1">Clique no botão acima para adicionar o primeiro exercício.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {activeWorkout.exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-xs font-mono font-bold text-slate-400 w-5 pt-0.5 flex-shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-100 text-sm break-words">{ex.name}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex-shrink-0">
                            {ex.muscleGroup}
                          </span>
                        </div>
                        {ex.notes && (
                          <p className="text-xs text-slate-400 mt-1 italic break-words">
                            💡 {ex.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Métricas: Séries, Reps, Carga, Descanso */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                      <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300" title="Séries">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        <span><strong>{ex.sets}</strong> séries</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300" title="Repetições">
                        <span><strong>{ex.reps}</strong> reps</span>
                      </div>

                      {ex.loadKg && (
                        <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-400" title="Carga">
                          <Weight className="w-3.5 h-3.5" />
                          <span>{ex.loadKg}</span>
                        </div>
                      )}

                      {ex.restSeconds && (
                        <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-sky-400" title="Descanso">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{ex.restSeconds}s</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 pl-2 border-l border-slate-800 ml-auto sm:ml-0">
                        <button
                          onClick={() => openEditExerciseModal(ex)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="Editar exercício"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExercise(ex.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                          title="Excluir exercício"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">Nenhum treino criado para este aluno</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Crie divisões de treino como Treino A (Superior), Treino B (Inferior) e monte a rotina sob medida.
          </p>
          <button
            onClick={openNewWorkoutModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-950"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeiro Treino</span>
          </button>
        </div>
      )}

      {/* Modal Criar / Editar Treino */}
      {isWorkoutModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 shadow-2xl">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 flex-shrink-0">
              <h3 className="text-base font-bold text-white">
                {editingWorkout ? 'Editar Treino' : 'Nova Divisão de Treino'}
              </h3>
              <button
                onClick={() => setIsWorkoutModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkout} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Nome do Treino *
                </label>
                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="Ex: Treino A - Peito & Tríceps"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Letra / Divisão
                  </label>
                  <input
                    type="text"
                    value={workoutDivision}
                    onChange={(e) => setWorkoutDivision(e.target.value.toUpperCase())}
                    placeholder="Ex: A, B, C, Full"
                    maxLength={10}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Músculos Alvo
                  </label>
                  <input
                    type="text"
                    value={workoutMuscles}
                    onChange={(e) => setWorkoutMuscles(e.target.value)}
                    placeholder="Ex: Peito e Tríceps"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Observações / Recomendações
                </label>
                <textarea
                  rows={3}
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="Ex: Descanso de 90 segundos entre séries compostas"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsWorkoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shadow-lg shadow-emerald-950"
                >
                  Salvar Treino
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Criar / Editar Exercício */}
      {isExerciseModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 shadow-2xl">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 flex-shrink-0">
              <h3 className="text-base font-bold text-white">
                {editingExercise ? 'Editar Exercício' : 'Adicionar Exercício ao Treino'}
              </h3>
              <button
                onClick={() => setIsExerciseModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExercise} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Nome do Exercício *
                </label>
                <input
                  type="text"
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  placeholder="Ex: Supino Reto com Barra"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Grupo Muscular
                </label>
                <select
                  value={exMuscle}
                  onChange={(e) => setExMuscle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {MUSCLE_GROUPS.map((mg) => (
                    <option key={mg} value={mg} className="bg-slate-900">
                      {mg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Séries
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={exSets}
                    onChange={(e) => setExSets(Number(e.target.value))}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Repetições
                  </label>
                  <input
                    type="text"
                    value={exReps}
                    onChange={(e) => setExReps(e.target.value)}
                    placeholder="Ex: 8 - 12"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Carga (kg)
                  </label>
                  <input
                    type="text"
                    value={exLoad}
                    onChange={(e) => setExLoad(e.target.value)}
                    placeholder="Ex: 60kg"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Descanso (s)
                  </label>
                  <input
                    type="number"
                    step="5"
                    min="0"
                    max="300"
                    value={exRest}
                    onChange={(e) => setExRest(Number(e.target.value))}
                    placeholder="Ex: 60"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Instruções Técnicas / Observações (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={exNotes}
                  onChange={(e) => setExNotes(e.target.value)}
                  placeholder="Ex: Descer em 3 segundos e segurar 1s no peito. Fazer drop set na última."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsExerciseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shadow-lg shadow-emerald-950 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingExercise ? 'Salvar Exercício' : 'Adicionar ao Treino'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
