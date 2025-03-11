import express from 'express'
import { getModels, getTrends, storeSkills, trendById } from '../controllers/AcadResults.js';
import { authenticateToken } from '../middleware/authtoken.js';

const router = express.Router();

router.post('/api/trends',authenticateToken,storeSkills);
router.get('/api/trends/:trendsId',trendById);
router.get('/api/trends',getTrends);
router.get('/api/models',getModels);

export default router;
