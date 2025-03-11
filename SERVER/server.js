import express from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from "./config/db.js";
import userLogin from './routes/loginRoute.js'
import userSignup from './routes/singupRoute.js'
import userData from './routes/userDataRoute.js'
import Logout from './routes/logoutRoute.js'

const app=express();
import AcadTrends from './routes/AcadTrends.js'


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
app.use('/',userData);
app.use('/',Logout);
app.use('/',AcadTrends);













app.listen(8000, () => {
  console.log("Server is running on port 8000");
});