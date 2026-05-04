const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: String,
    // ref: 'Job',
    required: true
  },
  seekerId:{
    type:String,
    required:true
  },
  providerId: {
    type: String,
    // ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const JobApplication=mongoose.model('JobApplication', JobApplicationSchema);

module.exports={
    JobApplication
}