const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    "jobId": { "type": "String", "required": true, "unique": true },
    "recid": { "type": "String", "required": true },
    "title": { "type": "String", "required": true },
    "description": { "type": "String", "required": true },
    "requirements": { "type": ["String"], "default": [] },
    "type": { "type": "String", "required": true },
    "category": { "type": "String", "required": true },
    "slug": { "type": "String", "required": true, "unique": true },
    "isApplied": { "type": "Boolean", "default": false },
    "tags": { "type": ["String"], "required": true },
    "duration": { "type": "String" },
    "skills": { "type": ["String"], "default": [] },
    "vacancies": { "type": "Number", "required": true },
    "salary": {
      "amount": { "type": "Number", "required": true },
      "currency": { "type": "String", "default": "USD" },
      "frequency": { "type": "String", "default": "monthly" }
    },
    "preferredTime": {
      "start": { "type": "String" },
      "end": { "type": "String" }
    },
    "location": {
      "city": { "type": "String", "required": true },
      "area": { "type": "String" }
    },
    "employer": {
      "name": { "type": "String", "required": true },
      "contact": { "type": "String" },
      "phone": { "type": "String" },
      "owner": { "type": "String" }
    },
    "schedule": {
      "shifts": { "type": ["String"], "default": [] },
      "days": { "type": ["String"], "default": [] }
    },
    "latitude": { "type": "Number" },
    "longitude": { "type": "Number" },
    "createdAt": { "type": "Date", "default": "Date.now" }
  }
  
);

const Job = mongoose.model("Jobs", jobSchema);

module.exports = Job;

