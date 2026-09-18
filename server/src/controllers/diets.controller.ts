import { Request, Response } from 'express';
import { dbStore } from '../services/databaseStore.js';

export const dietsController = {
  getByStudent(req: Request, res: Response) {
    const { studentId } = req.params;
    const diet = dbStore.getDietByStudent(studentId);
    if (!diet) {
      return res.status(404).json({ error: 'Nenhum plano alimentar encontrado para este aluno' });
    }
    return res.status(200).json(diet);
  },

  save(req: Request, res: Response) {
    const {
      id,
      studentId,
      title,
      dailyWaterMl,
      targetCalories,
      targetProteinG,
      targetCarbsG,
      targetFatsG,
      notes,
      meals,
    } = req.body;

    if (!studentId || !title) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando: studentId e title são necessários.',
      });
    }

    const saved = dbStore.saveDiet({
      id: id || undefined,
      studentId,
      title: String(title).trim(),
      dailyWaterMl: Number(dailyWaterMl) || 2000,
      targetCalories: targetCalories ? Number(targetCalories) : undefined,
      targetProteinG: targetProteinG ? Number(targetProteinG) : undefined,
      targetCarbsG: targetCarbsG ? Number(targetCarbsG) : undefined,
      targetFatsG: targetFatsG ? Number(targetFatsG) : undefined,
      notes: notes ? String(notes).trim() : undefined,
      meals: Array.isArray(meals) ? meals : [],
    });

    return res.status(200).json(saved);
  },

  delete(req: Request, res: Response) {
    const { studentId } = req.params;
    const success = dbStore.deleteDiet(studentId);
    if (!success) {
      return res.status(404).json({ error: 'Plano nutricional não encontrado' });
    }
    return res.status(200).json({ success: true, message: 'Plano nutricional excluído com sucesso' });
  },
};
