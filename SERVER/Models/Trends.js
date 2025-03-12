import mongoose from 'mongoose'


const TrendSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    skills: {
      type: [String],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  export const Trend = mongoose.model('Trend', TrendSchema);