const mongoose = require("mongoose");
let schema = mongoose.Schema;

const jobSeeker = new schema({
    seekerId: { type: String},
    name: { type: String, required: false },
    password: { type: String, required: false },
    email: { type: String, required: false, unique: false },
    phone: { type: String, required: false },
    location: {
        city: { type: String, required: false },
        area: { type: String }
    }, 
    preferredJobTypes: { type: [String], default: ["Part-time"] },
    skills: { type: [String], required: false },
    experience: { type: String },
    availability: {
        start: { type: String },
        end: { type: String },
        days: { type: [String] }
    },
    appliedJobs: [{ type: String}],
    resume: { type: String },
    isEmployed: { type: Boolean, default: false }
});

const jobSeekers = mongoose.model("jobSeekers", jobSeeker);
module.exports = {jobSeekers};
