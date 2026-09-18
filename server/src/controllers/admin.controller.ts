import { Request, Response } from 'express';
import { dbStore } from '../services/databaseStore.js';

export const adminController = {
  reset(_req: Request, res: Response) {
    const defaultData = dbStore.resetToDefault();
    return res.status(200).json({
      success: true,
      message: 'Base de dados restaurada para os dados padrão de demonstração',
      data: defaultData,
    });
  },

  stats(_req: Request, res: Response) {
    const state = dbStore.exportDatabase();
    return res.status(200).json({
      totalStudents: state.students.length,
      totalWorkouts: state.workouts.length,
      totalDiets: state.diets.length,
    });
  },

  exportDb(_req: Request, res: Response) {
    const data = dbStore.exportDatabase();
    return res.status(200).json(data);
  },

  importDb(req: Request, res: Response) {
    const success = dbStore.importDatabase(req.body);
    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Estrutura JSON inválida. O formato deve conter o array students.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Dados importados com sucesso',
    });
  },
};
