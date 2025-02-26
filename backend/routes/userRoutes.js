import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { addMemberToGroup, addExpense, loginUser,takeOverView , listExpenses} from '../controllers/userController.js';

const  userRouter = express.Router();   
userRouter.post("/login", loginUser);
userRouter.post('/addMember', authMiddleware, addMemberToGroup);
userRouter.post('/addExpense',authMiddleware, addExpense);
userRouter.get('/overview',authMiddleware, takeOverView);
userRouter.get('/expenses',authMiddleware, listExpenses);
export default userRouter;