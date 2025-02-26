import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { addMemberToGroup, addExpense, loginUser } from '../controllers/userController.js';

const  userRouter = express.Router();   
userRouter.post("/login", loginUser);
userRouter.post('/addMember/:groupId', addMemberToGroup);
userRouter.post('/addExpense/:groupId', addExpense);
export default userRouter;