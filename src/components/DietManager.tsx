import React, { useState } from 'react';
import { DietPlan, Meal, MealItem, Student } from '../types';
import { calculateWaterIntake } from '../utils/healthCalculators';
import { 
  Utensils, 
  Plus, 
  Trash2, 
  Edit3, 
  Droplets, 
  Clock, 
  Check, 
  X, 
  Flame, 
  Apple, 
  Printer 
} from 'lucide-react';

interface DietManagerProps {
  student: Student;
  dietPlan?: DietPlan;
  onSaveDiet: (diet: Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onDeleteDiet: (studentId: string) => void;
}

const DEFAULT_MEAL_NAMES = [
  'Café da Manhã',
  'Lanche da Manhã',
  'Almoço',
  'Lanche da Tarde',
  'Pré-Treino',
  'Pós-Treino',
  'Jantar',
  'Ceia',
];

export const DietManager: React.FC<DietManagerProps> = ({
  student,
  dietPlan,
  onSaveDiet,
  onDeleteDiet,
}) => {
  // Modal de edição do plano geral (título, calorias, macros, água)
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planTitle, setPlanTitle] = useState('');
  const [dailyWater, setDailyWater] = useState<number>(calculateWaterIntake(student.weight));
  const [targetCalories, setTargetCalories] = useState<number | ''>('');
  const [targetProtein, setTargetProtein] = useState<number | ''>('');
  const [targetCarbs, setTargetCarbs] = useState<number | ''>('');
  const [targetFats, setTargetFats] = useState<number | ''>('');
  const [planNotes, setPlanNotes] = useState('');

  // Modal de refeição (adicionar ou editar)
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [mealName, setMealName] = useState(DEFAULT_MEAL_NAMES[0]);
  const [mealTime, setMealTime] = useState('08:00');
  const [mealNotes, setMealNotes] = useState('');
  const [mealItems, setMealItems] = useState<MealItem[]>([]);

  // Item em edição dentro do modal da refeição
  const [newItemName, setNewItemName] = useState('');
  const [newItemPortion, setNewItemPortion] = useState('');
  const [newItemCalories, setNewItemCalories] = useState<number | ''>('');
  const [newItemProtein, setNewItemProtein] = useState<number | ''>('');

  const openPlanModal = () => {
    if (dietPlan) {
      setPlanTitle(dietPlan.title);
      setDailyWater(dietPlan.dailyWaterMl);
      setTargetCalories(dietPlan.targetCalories || '');
      setTargetProtein(dietPlan.targetProteinG || '');
      setTargetCarbs(dietPlan.targetCarbsG || '');
      setTargetFats(dietPlan.targetFatsG || '');
      setPlanNotes(dietPlan.notes || '');
    } else {
      setPlanTitle(`Plano Nutricional - ${student.goal}`);
      setDailyWater(calculateWaterIntake(student.weight));
      setTargetCalories(student.goal === 'Emagrecimento' ? 1800 : student.goal === 'Hipertrofia' ? 2800 : 2200);
      setTargetProtein(Math.round(student.weight * 2));
      setTargetCarbs(Math.round(student.weight * 3.5));
      setTargetFats(Math.round(student.weight * 0.9));
      setPlanNotes('Manter boa ingestão hídrica ao longo de todo o dia.');
    }
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDiet({
      id: dietPlan?.id,
      studentId: student.id,
      title: planTitle.trim() || `Plano Nutricional - ${student.goal}`,
      dailyWaterMl: Number(dailyWater) || calculateWaterIntake(student.weight),
      targetCalories: targetCalories ? Number(targetCalories) : undefined,
      targetProteinG: targetProtein ? Number(targetProtein) : undefined,
      targetCarbsG: targetCarbs ? Number(targetCarbs) : undefined,
      targetFatsG: targetFats ? Number(targetFats) : undefined,
      notes: planNotes.trim() || undefined,
      meals: dietPlan?.meals || [],
    });
    setIsPlanModalOpen(false);
  };

  const openNewMealModal = () => {
    setEditingMeal(null);
    setMealName(DEFAULT_MEAL_NAMES[0]);
    setMealTime('08:00');
    setMealNotes('');
    setMealItems([]);
    setIsMealModalOpen(true);
  };

  const openEditMealModal = (meal: Meal) => {
    setEditingMeal(meal);
    setMealName(meal.name);
    setMealTime(meal.time);
    setMealNotes(meal.notes || '');
    setMealItems([...meal.items]);
    setIsMealModalOpen(true);
  };

  const handleAddItemToMeal = () => {
    if (!newItemName.trim() || !newItemPortion.trim()) return;
    const item: MealItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: newItemName.trim(),
      portion: newItemPortion.trim(),
      calories: newItemCalories ? Number(newItemCalories) : undefined,
      proteinG: newItemProtein ? Number(newItemProtein) : undefined,
    };
    setMealItems([...mealItems, item]);
    setNewItemName('');
    setNewItemPortion('');
    setNewItemCalories('');
    setNewItemProtein('');
  };

  const handleRemoveItemFromMeal = (itemId: string) => {
    setMealItems(mealItems.filter((it) => it.id !== itemId));
  };

  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    const currentMeals = dietPlan?.meals || [];
    let updatedMeals: Meal[];

    if (editingMeal) {
      updatedMeals = currentMeals.map((m) =>
        m.id === editingMeal.id
          ? {
              ...m,
              name: mealName.trim(),
              time: mealTime,
              notes: mealNotes.trim() || undefined,
              items: mealItems,
            }
          : m
      );
    } else {
      const newMeal: Meal = {
        id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        name: mealName.trim(),
        time: mealTime,
        notes: mealNotes.trim() || undefined,
        items: mealItems,
      };
      updatedMeals = [...currentMeals, newMeal];
    }

    // Ordena as refeições por horário
    updatedMeals.sort((a, b) => a.time.localeCompare(b.time));

    onSaveDiet({
      id: dietPlan?.id,
      studentId: student.id,
      title: dietPlan?.title || `Plano Nutricional - ${student.goal}`,
      dailyWaterMl: dietPlan?.dailyWaterMl || calculateWaterIntake(student.weight),
      targetCalories: dietPlan?.targetCalories,
      targetProteinG: dietPlan?.targetProteinG,
      targetCarbsG: dietPlan?.targetCarbsG,
      targetFatsG: dietPlan?.targetFatsG,
      notes: dietPlan?.notes,
      meals: updatedMeals,
    });

    setIsMealModalOpen(false);
  };

  const handleDeleteMeal = (mealId: string) => {
    if (!dietPlan) return;
    const updatedMeals = dietPlan.meals.filter((m) => m.id !== mealId);
    onSaveDiet({
      ...dietPlan,
      meals: updatedMeals,
    });
  };

  const totalCalculatedCalories = dietPlan?.meals.reduce((sum, m) => {
    return sum + m.items.reduce((s, it) => s + (it.calories || 0), 0);
  }, 0) || 0;

  const totalCalculatedProtein = dietPlan?.meals.reduce((sum, m) => {
    return sum + m.items.reduce((s, it) => s + (it.proteinG || 0), 0), 0;
  }, 0) || 0;

  return (
    <div className="space-y-6">
      {dietPlan ? (
        <>
          {/* Header do Plano Nutricional */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Utensils className="w-4 h-4" />
                  </span>
                  <h3 className="text-xl font-bold text-white">{dietPlan.title}</h3>
                </div>
                {dietPlan.notes && (
                  <p className="text-xs text-slate-400 mt-1">{dietPlan.notes}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors"
                  title="Imprimir plano de dieta"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={openPlanModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Metas</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Deseja excluir este plano nutricional completo?')) {
                      onDeleteDiet(student.id);
                    }
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Excluir Dieta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metas Nutricionais & Hidratação */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Meta de Água */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-sky-400 mb-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Meta de Água</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {dietPlan.dailyWaterMl} <span className="text-xs font-normal text-slate-400">ml/dia</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {(dietPlan.dailyWaterMl / 1000).toFixed(1)}L (35ml/kg)
                </div>
              </div>

              {/* Meta de Calorias */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Calorias Alvo</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {dietPlan.targetCalories || totalCalculatedCalories || '—'}{' '}
                  <span className="text-xs font-normal text-slate-400">kcal</span>
                </div>
                {totalCalculatedCalories > 0 && (
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Cadastradas: {totalCalculatedCalories} kcal
                  </div>
                )}
              </div>

              {/* Proteínas */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-1">
                  <Apple className="w-3.5 h-3.5" />
                  <span>Proteínas</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {dietPlan.targetProteinG || totalCalculatedProtein || '—'}{' '}
                  <span className="text-xs font-normal text-slate-400">g</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {student.weight ? `${(totalCalculatedProtein / student.weight).toFixed(1)}g/kg` : ''}
                </div>
              </div>

              {/* Carbos e Gorduras */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Carbos / Gorduras</div>
                <div className="text-lg font-bold text-slate-200">
                  {dietPlan.targetCarbsG || '—'}g / {dietPlan.targetFatsG || '—'}g
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Distribuição diária</div>
              </div>
            </div>
          </div>

          {/* Seção das Refeições */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span>Cronograma de Refeições</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400">
                  {dietPlan.meals.length} refeições
                </span>
              </h4>

              <button
                onClick={openNewMealModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Refeição</span>
              </button>
            </div>

            {dietPlan.meals.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
                <Utensils className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-400">Nenhuma refeição cadastrada neste plano.</p>
                <button
                  onClick={openNewMealModal}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 text-amber-400 rounded-lg text-xs font-bold hover:bg-amber-500/25 border border-amber-500/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Primeira Refeição</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dietPlan.meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-3 hover:border-slate-700/80 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top da Refeição: Nome, Horário e Ações */}
                      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                            <Clock className="w-3 h-3" />
                            {meal.time}
                          </span>
                          <h5 className="font-bold text-white text-sm">{meal.name}</h5>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditMealModal(meal)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                            title="Editar refeição"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMeal(meal.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                            title="Excluir refeição"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Observações da refeição */}
                      {meal.notes && (
                        <p className="text-xs text-slate-400 italic pt-1">
                          💡 {meal.notes}
                        </p>
                      )}

                      {/* Itens / Alimentos */}
                      <div className="mt-3 space-y-2">
                        {meal.items.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">Nenhum alimento cadastrado.</p>
                        ) : (
                          meal.items.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/70 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-medium text-slate-200">{item.name}</span>
                                <span className="text-slate-400 block text-[11px]">{item.portion}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-right">
                                {item.calories && (
                                  <span className="text-amber-400/90 font-medium">{item.calories} kcal</span>
                                )}
                                {item.proteinG && (
                                  <span className="text-emerald-400/90 font-medium">{item.proteinG}g prot</span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Resumo da Refeição */}
                    <div className="pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{meal.items.length} alimentos</span>
                      <span>
                        Total: {meal.items.reduce((s, it) => s + (it.calories || 0), 0)} kcal • {meal.items.reduce((s, it) => s + (it.proteinG || 0), 0)}g prot
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Tela quando ainda não existe dieta criada para o aluno */
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <Utensils className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">Nenhum plano alimentar criado para este aluno</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Cadastre refeições com horários, porções de alimentos e meta de hidratação calculada para o peso de {student.name}.
          </p>
          <button
            onClick={openPlanModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-amber-950"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Plano Nutricional</span>
          </button>
        </div>
      )}

      {/* Modal Criar / Editar Metas do Plano */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Configurar Plano Nutricional</h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Título do Plano *
                </label>
                <input
                  type="text"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="Ex: Hipertrofia Limpa - 2800 kcal"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Meta de Água (ml)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={dailyWater}
                    onChange={(e) => setDailyWater(Number(e.target.value))}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Calorias Alvo (kcal)
                  </label>
                  <input
                    type="number"
                    value={targetCalories}
                    onChange={(e) => setTargetCalories(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ex: 2500"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Proteína (g)
                  </label>
                  <input
                    type="number"
                    value={targetProtein}
                    onChange={(e) => setTargetProtein(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ex: 160"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Carbos (g)
                  </label>
                  <input
                    type="number"
                    value={targetCarbs}
                    onChange={(e) => setTargetCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ex: 300"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Gorduras (g)
                  </label>
                  <input
                    type="number"
                    value={targetFats}
                    onChange={(e) => setTargetFats(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ex: 70"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Diretrizes Nutricionais / Orientações
                </label>
                <textarea
                  rows={2}
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  placeholder="Ex: Evitar frituras, priorizar alimentos integrais e bater a meta de água."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-lg shadow-amber-950"
                >
                  Salvar Plano
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Criar / Editar Refeição */}
      {isMealModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingMeal ? 'Editar Refeição' : 'Adicionar Refeição'}
              </h3>
              <button onClick={() => setIsMealModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMeal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Nome da Refeição *
                  </label>
                  <input
                    type="text"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    placeholder="Ex: Almoço"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Horário *
                  </label>
                  <input
                    type="time"
                    value={mealTime}
                    onChange={(e) => setMealTime(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Orientação da Refeição (Opcional)
                </label>
                <input
                  type="text"
                  value={mealNotes}
                  onChange={(e) => setMealNotes(e.target.value)}
                  placeholder="Ex: Salada de folhas verdes à vontade com azeite"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Subformulário: Adicionar Alimentos */}
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Adicionar Alimento / Porção
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Alimento (Ex: Filé de Frango)"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={newItemPortion}
                    onChange={(e) => setNewItemPortion(e.target.value)}
                    placeholder="Porção (Ex: 150g ou 3 ovos)"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={newItemCalories}
                    onChange={(e) => setNewItemCalories(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Kcal aprox."
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="number"
                    value={newItemProtein}
                    onChange={(e) => setNewItemProtein(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Prot (g)"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddItemToMeal}
                    disabled={!newItemName.trim() || !newItemPortion.trim()}
                    className="col-span-2 sm:col-span-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-lg transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Incluir</span>
                  </button>
                </div>

                {/* Lista de alimentos já adicionados nesta refeição */}
                {mealItems.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    {mealItems.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center justify-between bg-slate-900/90 px-2.5 py-1 rounded-lg text-xs"
                      >
                        <span className="text-slate-200">
                          {it.name} <span className="text-slate-400">({it.portion})</span>
                        </span>
                        <div className="flex items-center gap-2">
                          {it.calories && <span className="text-amber-400/90 text-[11px]">{it.calories} kcal</span>}
                          <button
                            type="button"
                            onClick={() => handleRemoveItemFromMeal(it.id)}
                            className="text-slate-500 hover:text-rose-400 p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMealModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-lg shadow-amber-950 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingMeal ? 'Salvar Refeição' : 'Concluir Refeição'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
