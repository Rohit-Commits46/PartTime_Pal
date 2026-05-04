const mongoose = require("mongoose");
let schema = mongoose.Schema;

const localizedString = {
  en: { type: String, required: false },
  hi: { type: String, required: false }
};

const localizedArray = {
  en: { type: [String], required: false },
  hi: { type: [String], required: false }
};

const jobSchema = new schema({
  jobId: String,
  title: localizedString,
  description: localizedString,
  requirements: localizedString,

  salary: {
    amount: localizedString,
    currency: localizedString,
    frequency: localizedString
  },

  type: localizedString,
  category: localizedString,
  preferredTime: {
    start: localizedString,
    end: localizedString
  },

  location: {
    city: localizedString,
    area: localizedString
  },

  employer: {
    name: localizedString,
    contact: localizedString,
    phone: localizedString,
    owner: localizedString
  },

  slug: localizedString,
  isApplied: localizedString, // you can change this to Boolean if storing true/false as boolean
  tags: localizedArray,
  duration: localizedString,
  skills: localizedArray,
  vacancies: localizedString,

  schedule: {
    shifts: localizedString, // ideally store shifts as array of objects instead of string
    days: localizedArray
  },

  latitude: localizedString,
  longitude: localizedString,
  recid: String
});

const Job = mongoose.model("Job", jobSchema);
module.exports = { Job };
