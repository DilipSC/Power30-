import express from "express";
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { User } from './Models/UserModel.js'
import { connectDB } from "./config/db.js";
import userLogin from './routes/loginRoute.js'
import userSignup from './routes/singupRoute.js'

const app=express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

connectDB();

app.use('/',userLogin);
app.use('/',userSignup);





app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/api/logout', (req, res) => {
  res.cookie('yourAuthCookie', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ message: 'Logged out successfully' });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});