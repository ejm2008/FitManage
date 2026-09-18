import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';

export const adminRoutes = Router();

adminRoutes.post('/reset', adminController.reset);
adminRoutes.get('/stats', adminController.stats);
adminRoutes.get('/export', adminController.exportDb);
adminRoutes.post('/import', adminController.importDb);
