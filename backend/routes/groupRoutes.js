import express from 'express';
import { createGroup,inviteUser,listGroups , updateActiveGroup} from '../controllers/groupController.js';
import authMiddleware from '../middlewares/auth.js';
const groupRouter = express.Router();
groupRouter.post('/create',authMiddleware, createGroup);
groupRouter.get('/list',authMiddleware, listGroups);
groupRouter.put("/activeGroup/:groupId", authMiddleware, updateActiveGroup);
groupRouter.post("/invite",authMiddleware, inviteUser)
export default groupRouter;