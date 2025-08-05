import { Request, Response } from 'express';
import Course from '../models/Course';

export const createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getCourses = async (_req: Request, res: Response): Promise<void> => {
    try {
        const courses = await Course.find().populate('department lecturers');
        res.json(courses);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await Course.findById(req.params.id).populate('department lecturers');
        if (!course) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }
        res.json(course);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }
        res.json(course);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const enrollStudent = async (_req: Request, res: Response): Promise<void> => {
    try {
        // Implementation for student enrollment
        // This would typically involve updating a Class or creating an enrollment record
        res.json({ message: 'Student enrollment functionality to be implemented' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
