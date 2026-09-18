import { Router } from 'express';
import { workoutsController } from '../controllers/workouts.controller.js';

export const workoutsRoutes = Router();

workoutsRoutes.get('/student/:studentId', workoutsController.getByStudent);
workoutsRoutes.post('/', workoutsController.save);
workoutsRoutes.delete('/:id', workoutsController.delete);
