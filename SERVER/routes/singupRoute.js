import express from 'express'
import { SignupFunc } from '../controllers/userSignUp.js';
const router=express.Router();

router.post('/api/signup',SignupFunc);
export default router;