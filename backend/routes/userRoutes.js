import express from 'express';
import { addMemberToGroup, addExpense } from '../controllers/userController.js';
const  userRouter = express.Router();   

userRouter.post('/addMember', addMemberToGroup);
userRouter.post('/addExpense', addExpense);
export default userRouter;