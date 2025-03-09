import express from 'express'
import { LogoutCont } from '../controllers/userLogout.js';

const router = express.Router();

router.post('/api/logout',LogoutCont)
export default router;