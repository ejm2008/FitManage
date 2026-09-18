import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseState, Student, Workout, DietPlan } from '../types/index.js';
import { INITIAL_DATABASE } from './mockDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'mock-db.json');

class DatabaseStore {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent) as DatabaseState;
        if (parsed.students && Array.isArray(parsed.students)) {
          return parsed;
        }
      }

      // Se não existir arquivo válido, inicializa com seed
      this.saveToFile(INITIAL_DATABASE);
      return JSON.parse(JSON.stringify(INITIAL_DATABASE));
    } catch (err) {
      console.error('Erro ao ler mock-db.json, usando base inicial:', err);
      return JSON.parse(JSON.stringify(INITIAL_DATABASE));
    }
  }

  private saveToFile(state: DatabaseState): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Erro ao gravar mock-db.json:', err);
    }
  }

  // --- ALUNOS ---
  public getStudents(search?: string, level?: string, goal?: string): Student[] {
    let result = this.state.students;

    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.goal.toLowerCase().includes(term) ||
          (s.phone && s.phone.includes(term)) ||
          (s.email && s.email.toLowerCase().includes(term))
      );
    }

    if (level && level !== 'Todos') {
      result = result.filter((s) => s.level === level);
    }

    if (goal && goal !== 'Todos') {
      result = result.filter((s) => s.goal === goal);
    }

    return result;
  }

  public getStudentById(id: string): Student | undefined {
    return this.state.students.find((s) => s.id === id);
  }

  public createStudent(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Student {
    const now = new Date().toISOString();
    const newStudent: Student = {
      ...data,
      id: `student-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    this.state.students.unshift(newStudent);
    this.saveToFile(this.state);
    return newStudent;
  }

  public updateStudent(id: string, data: Partial<Omit<Student, 'id' | 'createdAt'>>): Student | null {
    const index = this.state.students.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updated: Student = {
      ...this.state.students[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };

    this.state.students[index] = updated;
    this.saveToFile(this.state);
    return updated;
  }

  public deleteStudent(id: string): boolean {
    const prevLength = this.state.students.length;
    this.state.students = this.state.students.filter((s) => s.id !== id);
    // Remove também treinos e dietas associados
    this.state.workouts = this.state.workouts.filter((w) => w.studentId !== id);
    this.state.diets = this.state.diets.filter((d) => d.studentId !== id);

    if (this.state.students.length !== prevLength) {
      this.saveToFile(this.state);
      return true;
    }
    return false;
  }

  // --- TREINOS ---
  public getWorkoutsByStudent(studentId: string): Workout[] {
    return this.state.workouts.filter((w) => w.studentId === studentId);
  }

  public saveWorkout(data: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Workout {
    const now = new Date().toISOString();

    if (data.id) {
      const index = this.state.workouts.findIndex((w) => w.id === data.id);
      if (index !== -1) {
        const updated: Workout = {
          ...this.state.workouts[index],
          ...data,
          id: data.id,
          updatedAt: now,
        };
        this.state.workouts[index] = updated;
        this.saveToFile(this.state);
        return updated;
      }
    }

    const newWorkout: Workout = {
      ...data,
      id: `workout-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    this.state.workouts.push(newWorkout);
    this.saveToFile(this.state);
    return newWorkout;
  }

  public deleteWorkout(id: string): boolean {
    const prevLength = this.state.workouts.length;
    this.state.workouts = this.state.workouts.filter((w) => w.id !== id);
    if (this.state.workouts.length !== prevLength) {
      this.saveToFile(this.state);
      return true;
    }
    return false;
  }

  // --- DIETAS ---
  public getDietByStudent(studentId: string): DietPlan | undefined {
    return this.state.diets.find((d) => d.studentId === studentId);
  }

  public saveDiet(data: Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): DietPlan {
    const now = new Date().toISOString();
    const existingIndex = this.state.diets.findIndex((d) => d.studentId === data.studentId);

    if (existingIndex !== -1) {
      const updated: DietPlan = {
        ...this.state.diets[existingIndex],
        ...data,
        id: this.state.diets[existingIndex].id,
        updatedAt: now,
      };
      this.state.diets[existingIndex] = updated;
      this.saveToFile(this.state);
      return updated;
    }

    const newDiet: DietPlan = {
      ...data,
      id: `diet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    this.state.diets.push(newDiet);
    this.saveToFile(this.state);
    return newDiet;
  }

  public deleteDiet(studentId: string): boolean {
    const prevLength = this.state.diets.length;
    this.state.diets = this.state.diets.filter((d) => d.studentId !== studentId);
    if (this.state.diets.length !== prevLength) {
      this.saveToFile(this.state);
      return true;
    }
    return false;
  }

  // --- ADMIN / BACKUP ---
  public resetToDefault(): DatabaseState {
    this.state = JSON.parse(JSON.stringify(INITIAL_DATABASE));
    this.saveToFile(this.state);
    return this.state;
  }

  public exportDatabase(): DatabaseState {
    return this.state;
  }

  public importDatabase(newState: DatabaseState): boolean {
    if (!newState || !Array.isArray(newState.students)) {
      return false;
    }
    this.state = {
      students: newState.students || [],
      workouts: newState.workouts || [],
      diets: newState.diets || [],
    };
    this.saveToFile(this.state);
    return true;
  }
}

export const dbStore = new DatabaseStore();
