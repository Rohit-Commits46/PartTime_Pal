const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for recruiter user information
const recruiterUserSchema = new Schema({
  recid: {
    type: String,
  },
  first_name: {
    type: String,
  },
  password:{
    type: String,
  },
  contact: {
    type: String,
  },
  email: {
    type: String,
  },
  
}, { timestamps: true });

// Create and export the model
const RecruiterUser = mongoose.model('recuiters', recruiterUserSchema);
module.exports ={RecruiterUser} ;