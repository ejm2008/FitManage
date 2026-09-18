import { Request, Response } from 'express';
import { dbStore } from '../services/databaseStore.js';

export const workoutsController = {
  getByStudent(req: Request, res: Response) {
    const { studentId } = req.params;
    const workouts = dbStore.getWorkoutsByStudent(studentId);
    return res.status(200).json(workouts);
  },

  save(req: Request, res: Response) {
    const { id, studentId, name, division, targetMuscles, notes, exercises } = req.body;

    if (!studentId || !name || !division) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando: studentId, name, division são necessários.',
      });
    }

    const saved = dbStore.saveWorkout({
      id: id || undefined,
      studentId,
      name: String(name).trim(),
      division: String(division).trim().toUpperCase(),
      targetMuscles: targetMuscles ? String(targetMuscles).trim() : 'Geral',
      notes: notes ? String(notes).trim() : undefined,
      exercises: Array.isArray(exercises) ? exercises : [],
    });

    return res.status(200).json(saved);
  },

  delete(req: Request, res: Response) {
    const { id } = req.params;
    const success = dbStore.deleteWorkout(id);
    if (!success) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }
    return res.status(200).json({ success: true, message: 'Treino excluído com sucesso' });
  },
};
