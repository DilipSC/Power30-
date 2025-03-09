import { User } from '../Models/UserModel.js';

export const LoginFunc =async ()=>{
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
          return res.status(400).json({ message: "Missing required fields" });
        }
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
    
        const newUser = new User({
          fullName,
          email,
          password,
        });
    
        await newUser.save();
        return res.status(201).json({ message: "User created successfully" });
      } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
}