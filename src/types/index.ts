export type StudentLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export type StudentGoal = 
  | 'Hipertrofia' 
  | 'Emagrecimento' 
  | 'Definição Muscular' 
  | 'Ganho de Força' 
  | 'Condicionamento Físico' 
  | 'Saúde & Longevidade'
  | 'Reabilitação Postural';

export interface Student {
  id: string;
  name: string;
  age: number;
  weight: number; // em kg
  height: number; // em cm
  goal: StudentGoal;
  level: StudentLevel;
  phone?: string;
  email?: string;
  notes?: string;
  medicalConditions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  loadKg?: string | number;
  restSeconds?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  studentId: string;
  name: string; // Ex: Treino A - Peito e Tríceps
  division: string; // A, B, C, D, Full Body
  targetMuscles: string;
  notes?: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface MealItem {
  id: string;
  name: string;
  portion: string; // Ex: 150g, 3 ovos, 1 scoop (30g)
  calories?: number;
  proteinG?: number;
  notes?: string;
}

export interface Meal {
  id: string;
  name: string; // Ex: Café da Manhã, Almoço, Lanche da Tarde
  time: string; // Ex: 07:30
  items: MealItem[];
  notes?: string;
}

export interface DietPlan {
  id: string;
  studentId: string;
  title: string;
  dailyWaterMl: number;
  targetCalories?: number;
  targetProteinG?: number;
  targetCarbsG?: number;
  targetFatsG?: number;
  notes?: string;
  meals: Meal[];
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseState {
  students: Student[];
  workouts: Workout[];
  diets: DietPlan[];
}
