import express from 'express'
import { authenticateToken } from '../middleware/authtoken.js';
import { getUserData } from '../controllers/userData.js';


const router = express.Router();

router.get('/api/user',authenticateToken,getUserData)
export default router