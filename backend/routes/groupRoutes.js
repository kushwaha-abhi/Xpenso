import express from 'express';
import { createGroup } from '../controllers/groupController.js';
import authMiddleware from '../middlewares/auth.js';
const groupRouter = express.Router();
groupRouter.post('/create',authMiddleware, createGroup);
export default groupRouter;