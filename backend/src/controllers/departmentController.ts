import { Request, Response } from 'express';
import Department from '../models/Department';

export const createDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
        const department = new Department(req.body);
        await department.save();
        res.status(201).json(department);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getDepartments = async (_req: Request, res: Response): Promise<void> => {
    try {
        const departments = await Department.find().populate('head');
        res.json(departments);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getDepartmentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const department = await Department.findById(req.params.id).populate('head');
        if (!department) {
            res.status(404).json({ error: 'Department not found' });
            return;
        }
        res.json(department);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!department) {
            res.status(404).json({ error: 'Department not found' });
            return;
        }
        res.json(department);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            res.status(404).json({ error: 'Department not found' });
            return;
        }
        res.json({ message: 'Department deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
