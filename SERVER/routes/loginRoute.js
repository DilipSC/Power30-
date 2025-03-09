import express from "express";
import  {LoginFunc} from '../controllers/userLogin.js'

const router=express.Router();

router.post('/api/login',LoginFunc);
export default router;
