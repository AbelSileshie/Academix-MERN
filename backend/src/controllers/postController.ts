import { Request, Response } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Like from '../models/Like';

export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json(post);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getPosts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const posts = await Post.find()
            .populate('author', 'firstName lastName')
            .populate('club', 'name')
            .populate('course', 'name')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'firstName lastName')
            .populate('club', 'name')
            .populate('course', 'name');
        
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        
        // Get comment and like counts
        const commentCount = await Comment.countDocuments({ post: post._id });
        const likeCount = await Like.countDocuments({ post: post._id });
        
        res.json({
            ...post.toObject(),
            commentCount,
            likeCount
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json(post);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        
        // Also delete associated comments and likes
        await Comment.deleteMany({ post: req.params.id });
        await Like.deleteMany({ post: req.params.id });
        
        res.json({ message: 'Post deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
