import React, { useState, useEffect } from 'react';
import { Student, StudentGoal, StudentLevel } from '../types';
import { calculateBmi, calculateWaterIntake } from '../utils/healthCalculators';
import { X, Check, Activity, AlertCircle, Droplets, User } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  initialStudent?: Student | null;
}

const GOAL_OPTIONS: StudentGoal[] = [
  'Hipertrofia',
  'Emagrecimento',
  'Definição Muscular',
  'Ganho de Força',
  'Condicionamento Físico',
  'Saúde & Longevidade',
  'Reabilitação Postural',
];

const LEVEL_OPTIONS: StudentLevel[] = ['Iniciante', 'Intermediário', 'Avançado'];

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStudent,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [goal, setGoal] = useState<StudentGoal>('Hipertrofia');
  const [level, setLevel] = useState<StudentLevel>('Iniciante');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialStudent) {
      setName(initialStudent.name);
      setAge(initialStudent.age);
      setWeight(initialStudent.weight);
      setHeight(initialStudent.height);
      setGoal(initialStudent.goal);
      setLevel(initialStudent.level);
      setPhone(initialStudent.phone || '');
      setEmail(initialStudent.email || '');
      setMedicalConditions(initialStudent.medicalConditions || '');
      setNotes(initialStudent.notes || '');
    } else {
      setName('');
      setAge('');
      setWeight('');
      setHeight('');
      setGoal('Hipertrofia');
      setLevel('Iniciante');
      setPhone('');
      setEmail('');
      setMedicalConditions('');
      setNotes('');
    }
    setErrors({});
  }, [initialStudent, isOpen]);

  if (!isOpen) return null;

  const currentWeightNum = typeof weight === 'number' ? weight : 0;
  const currentHeightNum = typeof height === 'number' ? height : 0;
  const bmiInfo = calculateBmi(currentWeightNum, currentHeightNum);
  const waterIntake = calculateWaterIntake(currentWeightNum);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nome completo é obrigatório';
    if (!age || Number(age) <= 0 || Number(age) > 120) newErrors.age = 'Informe uma idade válida';
    if (!weight || Number(weight) <= 20 || Number(weight) > 300) newErrors.weight = 'Informe um peso válido (20 a 300 kg)';
    if (!height || Number(height) <= 80 || Number(height) > 250) newErrors.height = 'Informe uma altura válida em cm (80 a 250)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: initialStudent?.id,
      name: name.trim(),
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      goal,
      level,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      medicalConditions: medicalConditions.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {initialStudent ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
              </h2>
              <p className="text-xs text-slate-400">
                Preencha os dados biométricos e objetivos de treino
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nome Completo */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Nome Completo *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Carlos Henrique Silva"
              className={`w-full bg-slate-950/80 border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                errors.name ? 'border-rose-500 focus:ring-rose-500/30' : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Dados Físicos: Idade, Peso, Altura */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Idade (anos) *
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 28"
                min="10"
                max="120"
                className={`w-full bg-slate-950/80 border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                  errors.age ? 'border-rose-500 focus:ring-rose-500/30' : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20'
                }`}
              />
              {errors.age && <p className="text-xs text-rose-400 mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Peso (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 75.5"
                className={`w-full bg-slate-950/80 border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                  errors.weight ? 'border-rose-500 focus:ring-rose-500/30' : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20'
                }`}
              />
              {errors.weight && <p className="text-xs text-rose-400 mt-1">{errors.weight}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Altura (cm) *
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 175"
                className={`w-full bg-slate-950/80 border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                  errors.height ? 'border-rose-500 focus:ring-rose-500/30' : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20'
                }`}
              />
              {errors.height && <p className="text-xs text-rose-400 mt-1">{errors.height}</p>}
            </div>
          </div>

          {/* Pré-visualização Automática de IMC & Água */}
          {currentWeightNum > 0 && currentHeightNum > 0 && (
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">IMC Calculado:</span>
                    <span className={`font-bold text-sm ${bmiInfo.colorClass}`}>{bmiInfo.bmi}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${bmiInfo.badgeBg} ${bmiInfo.badgeText}`}>
                      {bmiInfo.classification}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-0.5">{bmiInfo.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sky-400 bg-sky-950/40 border border-sky-800/40 px-3 py-1.5 rounded-lg whitespace-nowrap">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Meta de água: <strong>{waterIntake} ml/dia</strong></span>
              </div>
            </div>
          )}

          {/* Nível do Aluno (Iniciante, Intermediário, Avançado) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Nível do Aluno *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {LEVEL_OPTIONS.map((lvl) => {
                const isSelected = level === lvl;
                return (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? lvl === 'Iniciante'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-950'
                          : lvl === 'Intermediário'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/60 shadow-lg shadow-blue-950'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/60 shadow-lg shadow-purple-950'
                        : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{lvl}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Objetivo do Aluno */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Objetivo Principal *
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as StudentGoal)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              {GOAL_OPTIONS.map((g) => (
                <option key={g} value={g} className="bg-slate-900 text-white">
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Contato (Telefone e Email) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Telefone / WhatsApp (Opcional)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (11) 99999-8888"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                E-mail (Opcional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: aluno@email.com"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Restrições Médicas / Articulares */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Restrições Médicas / Lesões (Opcional)</span>
            </label>
            <input
              type="text"
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              placeholder="Ex: Condromalácia patelar grau 2 no joelho esquerdo, evitar flexão profunda"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Observações Gerais */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Observações Gerais (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Disponibilidade para treinar 4x por semana. Prefere treinos mais curtos e intensos."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Botões do Rodapé */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-sm font-bold shadow-lg shadow-emerald-950 transition-all hover:shadow-emerald-900/40"
            >
              {initialStudent ? 'Salvar Alterações' : 'Cadastrar Aluno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
