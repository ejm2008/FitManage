import { DatabaseState, Student, Workout, DietPlan } from '../types';
import { INITIAL_DATABASE } from './mockData';

const STORAGE_KEY = 'fitmanage_database_v1';

class StorageService {
  private getState(): DatabaseState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveState(INITIAL_DATABASE);
        return INITIAL_DATABASE;
      }
      const parsed = JSON.parse(data) as DatabaseState;
      if (!parsed.students || !Array.isArray(parsed.students)) {
        this.saveState(INITIAL_DATABASE);
        return INITIAL_DATABASE;
      }
      return parsed;
    } catch (err) {
      console.error('Erro ao ler dados do localStorage, restaurando base inicial:', err);
      this.saveState(INITIAL_DATABASE);
      return INITIAL_DATABASE;
    }
  }

  private saveState(state: DatabaseState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Erro ao salvar dados no localStorage:', err);
    }
  }

  // --- ALUNOS ---
  public getStudents(): Student[] {
    return this.getState().students;
  }

  public getStudentById(id: string): Student | undefined {
    return this.getState().students.find(s => s.id === id);
  }

  public saveStudent(studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Student {
    const state = this.getState();
    const now = new Date().toISOString();

    if (studentData.id) {
      // Atualização
      const index = state.students.findIndex(s => s.id === studentData.id);
      if (index !== -1) {
        const updatedStudent: Student = {
          ...state.students[index],
          ...studentData,
          id: studentData.id,
          updatedAt: now,
        };
        state.students[index] = updatedStudent;
        this.saveState(state);
        return updatedStudent;
      }
    }

    // Criação de novo aluno
    const newStudent: Student = {
      ...studentData,
      id: `student-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    state.students.unshift(newStudent);
    this.saveState(state);
    return newStudent;
  }

  public deleteStudent(id: string): void {
    const state = this.getState();
    state.students = state.students.filter(s => s.id !== id);
    // Remove treinos e dietas relacionados ao aluno
    state.workouts = state.workouts.filter(w => w.studentId !== id);
    state.diets = state.diets.filter(d => d.studentId !== id);
    this.saveState(state);
  }

  // --- TREINOS ---
  public getWorkoutsByStudent(studentId: string): Workout[] {
    return this.getState().workouts.filter(w => w.studentId === studentId);
  }

  public saveWorkout(workoutData: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Workout {
    const state = this.getState();
    const now = new Date().toISOString();

    if (workoutData.id) {
      const index = state.workouts.findIndex(w => w.id === workoutData.id);
      if (index !== -1) {
        const updatedWorkout: Workout = {
          ...state.workouts[index],
          ...workoutData,
          id: workoutData.id,
          updatedAt: now,
        };
        state.workouts[index] = updatedWorkout;
        this.saveState(state);
        return updatedWorkout;
      }
    }

    const newWorkout: Workout = {
      ...workoutData,
      id: `workout-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    state.workouts.push(newWorkout);
    this.saveState(state);
    return newWorkout;
  }

  public deleteWorkout(workoutId: string): void {
    const state = this.getState();
    state.workouts = state.workouts.filter(w => w.id !== workoutId);
    this.saveState(state);
  }

  // --- DIETAS ---
  public getDietByStudent(studentId: string): DietPlan | undefined {
    return this.getState().diets.find(d => d.studentId === studentId);
  }

  public saveDiet(dietData: Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): DietPlan {
    const state = this.getState();
    const now = new Date().toISOString();

    const existingIndex = state.diets.findIndex(d => d.studentId === dietData.studentId);

    if (existingIndex !== -1) {
      const updatedDiet: DietPlan = {
        ...state.diets[existingIndex],
        ...dietData,
        id: state.diets[existingIndex].id,
        updatedAt: now,
      };
      state.diets[existingIndex] = updatedDiet;
      this.saveState(state);
      return updatedDiet;
    }

    const newDiet: DietPlan = {
      ...dietData,
      id: `diet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    state.diets.push(newDiet);
    this.saveState(state);
    return newDiet;
  }

  public deleteDiet(studentId: string): void {
    const state = this.getState();
    state.diets = state.diets.filter(d => d.studentId !== studentId);
    this.saveState(state);
  }

  // --- UTILITÁRIOS ---
  public resetToDefault(): DatabaseState {
    this.saveState(INITIAL_DATABASE);
    return INITIAL_DATABASE;
  }

  public exportDatabaseJson(): string {
    return JSON.stringify(this.getState(), null, 2);
  }

  public importDatabaseJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as DatabaseState;
      if (!data.students || !Array.isArray(data.students)) {
        return false;
      }
      this.saveState(data);
      return true;
    } catch {
      return false;
    }
  }
}

export const storageService = new StorageService();
