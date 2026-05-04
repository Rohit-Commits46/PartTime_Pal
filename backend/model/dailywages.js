const mongoose = require('mongoose');

const dailyWageJobSchema = new mongoose.Schema({
    recid:{
        type: String,
        required: true,
        trim: true
    },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Delivery', 'Cleaning', 'Tutoring', 'Helper'] // Add more if needed
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        const diff = (value - this.startDate) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 6; // Ensure max 7-day duration
      },
      message: 'Job duration must be between 1 and 7 days.'
    }
  },
  wage: {
    type: Number,
    required: true,
    min: 0
  },
  workingHours: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  positions: {
    type: Number,
    required: true,
    min: 1
  },
  skills: {
    type: [String],
    default: []
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  isFilled: {
    type: Boolean,
    default: false
  }
});

const DailyWageJob = mongoose.model('DailyWageJob', dailyWageJobSchema);

module.exports = DailyWageJob;
