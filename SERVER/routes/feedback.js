// routes/feedback.js
import express from 'express';
import {Feedback} from '../Models/feedback.js';
import {User} from '../Models/UserModel.js';
import { authenticateToken } from '../middleware/authtoken.js';


const router = express.Router();




router.post('/api/feedback', authenticateToken,async (req, res) => {
  try {
    const userId=req.userId
    
    const existingUser = await User.findOne({_id: userId});
    if (existingUser && existingUser.hasSubmittedFeedback) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already submitted feedback' 
      });
    }
    
    
    const feedbackData = {
      userId,
      ...req.body
    };
    
    const newFeedback = new Feedback(feedbackData);
    await newFeedback.save();
    
    
    if (existingUser) {
      existingUser.hasSubmittedFeedback = true;
      await existingUser.save();
    }    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: newFeedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
});


router.get('/api/getfeedback',authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const feedback = await Feedback.findOne({ userId });
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'No feedback found for this user'
      });
    }
    
    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message
    });
  }
});

export default router;