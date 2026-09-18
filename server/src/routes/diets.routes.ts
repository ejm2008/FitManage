import { Router } from 'express';
import { dietsController } from '../controllers/diets.controller.js';

export const dietsRoutes = Router();

dietsRoutes.get('/student/:studentId', dietsController.getByStudent);
dietsRoutes.post('/', dietsController.save);
dietsRoutes.delete('/student/:studentId', dietsController.delete);
