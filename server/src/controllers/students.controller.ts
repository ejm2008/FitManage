import { Request, Response } from 'express';
import { dbStore } from '../services/databaseStore.js';

export const studentsController = {
  getAll(req: Request, res: Response) {
    const { search, level, goal } = req.query;
    const students = dbStore.getStudents(
      search ? String(search) : undefined,
      level ? String(level) : undefined,
      goal ? String(goal) : undefined
    );
    const enriched = students.map((s) => ({
      ...s,
      workoutCount: dbStore.getWorkoutsByStudent(s.id).length,
      hasDiet: Boolean(dbStore.getDietByStudent(s.id)),
    }));
    return res.status(200).json(enriched);
  },

  getById(req: Request, res: Response) {
    const { id } = req.params;
    const student = dbStore.getStudentById(id);
    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    return res.status(200).json({
      ...student,
      workoutCount: dbStore.getWorkoutsByStudent(student.id).length,
      hasDiet: Boolean(dbStore.getDietByStudent(student.id)),
    });
  },

  create(req: Request, res: Response) {
    const { name, age, weight, height, goal, level, phone, email, notes, medicalConditions } = req.body;

    if (!name || !age || !weight || !height || !goal || !level) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando: name, age, weight, height, goal, level são necessários.',
      });
    }

    const newStudent = dbStore.createStudent({
      name: String(name).trim(),
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      goal,
      level,
      phone: phone ? String(phone).trim() : undefined,
      email: email ? String(email).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
      medicalConditions: medicalConditions ? String(medicalConditions).trim() : undefined,
    });

    return res.status(201).json(newStudent);
  },

  update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = dbStore.updateStudent(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    return res.status(200).json(updated);
  },

  delete(req: Request, res: Response) {
    const { id } = req.params;
    const success = dbStore.deleteStudent(id);
    if (!success) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    return res.status(200).json({ success: true, message: 'Aluno excluído com sucesso' });
  },
};
