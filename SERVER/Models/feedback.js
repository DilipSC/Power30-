import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true 
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  subjectRatings: {
    type: Map,
    of: {
      type: String,
      enum: ['easy', 'moderate', 'hard']
    }
  },
  learningStyles: [{
    type: String,
    enum: ['lecture', 'visual', 'practical', 'group', 'realworld']
  }],
  difficultTopics: [{
    type: String
  }],
  teachingImprovement: {
    type: String,
    required: true
  },
  studyResources: [{
    type: String,
    enum: ['video', 'practice', 'ebooks', 'interactive', 'quizzes']
  }],
  additionalResources: {
    type: String
  },
  learningChallenge: {
    type: {
      type: String,
      enum: ['timeManagement', 'understanding', 'examPrep', 'resources', 'other'],
      required: true
    },
    otherDescription: String
  },
  teachingMethodsFeedback: {
    type: Map,
    of: {
      type: String,
      enum: ['like', 'dislike']
    }
  },
  overallRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);