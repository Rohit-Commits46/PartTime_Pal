const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for recruiter user information
const recruiterUserSchema = new Schema({
  recid: {
    type: String,
  },
  first_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
}, { 
  timestamps: true, 
  collection: 'recuiters' // Specify the existing MongoDB collection name
});

// Check if the model already exists to avoid overwriting
const RecruiterUser = mongoose.models.RecruiterUser || mongoose.model('RecruiterUser', recruiterUserSchema);

module.exports = RecruiterUser;
