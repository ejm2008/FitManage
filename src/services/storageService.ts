import { DatabaseState, Student, Workout, DietPlan } from '../types';
import { apiRequest } from './apiClient';

class StorageService {
  // --- ALUNOS ---
  public async getStudents(search?: string, level?: string, goal?: string): Promise<Student[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (level && level !== 'Todos') params.append('level', level);
    if (goal && goal !== 'Todos') params.append('goal', goal);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<Student[]>(`/students${queryString}`);
  }

  public async getStudentById(id: string): Promise<Student | undefined> {
    try {
      return await apiRequest<Student>(`/students/${id}`);
    } catch {
      return undefined;
    }
  }

  public async saveStudent(
    studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<Student> {
    if (studentData.id) {
      return apiRequest<Student>(`/students/${studentData.id}`, {
        method: 'PUT',
        body: JSON.stringify(studentData),
      });
    } else {
      return apiRequest<Student>('/students', {
        method: 'POST',
        body: JSON.stringify(studentData),
      });
    }
  }

  public async deleteStudent(id: string): Promise<void> {
    await apiRequest(`/students/${id}`, { method: 'DELETE' });
  }

  // --- TREINOS ---
  public async getWorkoutsByStudent(studentId: string): Promise<Workout[]> {
    return apiRequest<Workout[]>(`/workouts/student/${studentId}`);
  }

  public async saveWorkout(
    workoutData: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<Workout> {
    return apiRequest<Workout>('/workouts', {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  }

  public async deleteWorkout(workoutId: string): Promise<void> {
    await apiRequest(`/workouts/${workoutId}`, { method: 'DELETE' });
  }

  // --- DIETAS ---
  public async getDietByStudent(studentId: string): Promise<DietPlan | undefined> {
    try {
      return await apiRequest<DietPlan>(`/diets/student/${studentId}`);
    } catch {
      return undefined;
    }
  }

  public async saveDiet(
    dietData: Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<DietPlan> {
    return apiRequest<DietPlan>('/diets', {
      method: 'POST',
      body: JSON.stringify(dietData),
    });
  }

  public async deleteDiet(studentId: string): Promise<void> {
    try {
      await apiRequest(`/diets/student/${studentId}`, { method: 'DELETE' });
    } catch {
      // Ignora se não havia dieta
    }
  }

  // --- ADMIN & DADOS MOCKADOS ---
  public async resetToDefault(): Promise<void> {
    await apiRequest('/admin/reset', { method: 'POST' });
  }

  public async exportDatabaseJson(): Promise<string> {
    const data = await apiRequest<DatabaseState>('/admin/export');
    return JSON.stringify(data, null, 2);
  }

  public async importDatabaseJson(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      await apiRequest('/admin/import', {
        method: 'POST',
        body: JSON.stringify(parsed),
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const storageService = new StorageService();
