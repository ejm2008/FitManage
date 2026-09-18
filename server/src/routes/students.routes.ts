import { Router } from 'express';
import { studentsController } from '../controllers/students.controller.js';

export const studentsRoutes = Router();

studentsRoutes.get('/', studentsController.getAll);
studentsRoutes.get('/:id', studentsController.getById);
studentsRoutes.post('/', studentsController.create);
studentsRoutes.put('/:id', studentsController.update);
studentsRoutes.delete('/:id', studentsController.delete);
