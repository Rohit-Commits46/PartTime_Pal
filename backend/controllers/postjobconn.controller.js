const {Job}=require('../model/job.js');
const { JobApplication } = require("../database/application.js");
// const { insertJob } = require("../controllers/ml.js");
const { jobSeekers } = require("../model/freelancer.js");
// const {insertJob}=require("../../ML/insertJobs.js");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid'); // Optional: for fallback jobId
const fs = require('fs');
const path = require('path');
const DailyWageJob = require('../model/dailywages.js');
const DailyWageApplication= require('../model/dailywageApplication.js');
const { log } = require('console');


const postjobconn = (req, res) => {
  console.log("Request body:", req.body);

  let {
    jobId,
    recid,
    slug,
    category,
    type,
    employer,
    salary
  } = req.body;

  // Validate required fields
  if (!slug || !category || !type || !recid) {
    return res.status(400).json({ error: "Slug, category, type, and recruiterId are required" });
  }

  if (!employer?.name) {
    return res.status(400).json({ error: "Employer name is required" });
  }

  if (!salary?.amount) {
    return res.status(400).json({ error: "Salary amount is required" });
  }

  // Fallback IDs
  if (!jobId) jobId = uuidv4();
  if (!recid) recid = uuidv4();

  // Remove IDs before translation
  const { jobId: _, recid: __, ...bodyWithoutIds } = req.body;

  console.log("Sending data to FastAPI service:", bodyWithoutIds);

  axios.post('http://127.0.0.1:8000/translate-job', bodyWithoutIds)
    .then(response => {
      console.log("Response from FastAPI:", response.data);

      const finalResponse = {
        ...response.data,
        jobId,
        recid
      };

      console.log("Final bilingual job object:", finalResponse);

      Job.create(finalResponse)
        .then(createdJob => {
          // Append to joblist.json
          const joblistPath = path.join(__dirname, '../../ML/joblist.json');
          fs.readFile(joblistPath, 'utf8', (err, data) => {
            let jobs = [];
            if (!err && data) {
              try {
                jobs = JSON.parse(data);
                if (!Array.isArray(jobs)) jobs = [];
              } catch {
                jobs = [];
              }
            }
            jobs.push(finalResponse);
            fs.writeFile(joblistPath, JSON.stringify(jobs, null, 2), 'utf8', (writeErr) => {
              if (writeErr) {
                console.error('Failed to append job to joblist.json:', writeErr);
              } else {
                console.log('Job appended to joblist.json');
              }
            });
          });

          // 🔁 POST to all Python ML services
          axios.post('http://127.0.0.1:8000/add-job', finalResponse)
            .then(addJobRes => {
              console.log("Job added to ML:", addJobRes.data);

              // Trigger recommends
              return axios.post('http://127.0.0.1:8000/recommends');
            })
            .then(recommendRes => {
              console.log("General recommendations updated:", recommendRes.data);

              // Trigger text-based recommendations
              return axios.post('http://127.0.0.1:8000/recommend_by_text', {
                title: finalResponse.title || '',
                description: finalResponse.description || ''
              });
            })
            .then(textBasedRecRes => {
              console.log("Text-based recommendations:", textBasedRecRes.data);
            })
            .catch(mlErr => {
              console.error("ML service error:", mlErr.message || mlErr);
            });

          res.status(200).json(createdJob);
        })
        .catch(dbErr => {
          console.error("Error saving job to database:", dbErr);
          res.status(500).json({ message: "Error saving job to database." });
        });
    })
    .catch(error => {
      console.error("Error calling FastAPI service:", error.message || error);
      res.status(500).json({ message: "Error translating job data." });
    });
};
module.exports = postjobconn;

// 🟢 GET Jobs by Recruiter ID
const getjobs = async (req, res) => {
    try {
        const { id } = req.params;
        const jobs = await Job.find({ recruiterId: id });

        res.status(200).json({ jobs });
    } catch (error) {
        console.error("Error retrieving jobs:", error);
        res.status(500).json({ error: "Failed to get jobs", details: error.message });
    }
};

// 🟢 GET Users Who Applied to Recruiter's Jobs
const getusers = async (req, res) => {
    try {
        const { id } = req.params; // recruiterId
        console.log("Fetching applicants for recruiter:", id);

        // Step 1: Get applications for this recruiter
        const applications = await JobApplication.find({ providerId: id ,status:"accepted"});
        const recPostedJobs = await DailyWageJob.find({ recid: id });
        console.log("hello");
        
        console.log("Recruiter job IDs:", recPostedJobs);

        // console.log("Applications found:", applications.length);
        const recjobids= recPostedJobs.map(job => job._id);
        // console.log("Applications for this recruiter:", applications);
        const dailySeekerIds = await DailyWageApplication.find({ jobId: { $in: recjobids } ,status:"accepted"}).distinct("seekerId");
        console.log("Daily wage seeker IDs:", dailySeekerIds);
        // Step 2: Extract seeker IDs
        const seekerIds = applications.map(app => app.seekerId);
        const allSeekerIds = [...new Set([...seekerIds, ...dailySeekerIds])];
        // Step 3: Get full user data for seekers
        const seekers = await jobSeekers.find({ seekerId: { $in: allSeekerIds } });
        console.log("Seekers found:", seekers);
        res.status(200).json({ applicants: seekers });
    } catch (error) {
        console.error("Error retrieving applicants:", error);
        res.status(500).json({ error: "Failed to get applicants", details: error.message });
    }
};
// 🟢 GET All Jobs

const getAllJobs = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            location, 
            type, 
            category,
            minSalary,
            maxSalary,
            language = 'en'
        } = req.query;
        console.log("Fetching all jobs with params:", {
            page, limit, search, location, type, category, minSalary, maxSalary, language
        });
        const jobs = await Job.find({}, {}); // empty projection

        // console.log("All jobs fetched:", jobs[0]);
        
        // Transform jobs based on language
        const localizedJobs = jobs.map(job => {
            const jobObj = job.toObject();
            
            // Helper function to get value based on language
            const getLocalizedValue = (field) => {
                if (field && typeof field === 'object' && field[language]) {
                    return field[language];
                }
                return field && field.en ? field.en : field;
            };

            return {
                ...jobObj,
                jobId: getLocalizedValue(jobObj.jobId),
                title: getLocalizedValue(jobObj.title),
                description: getLocalizedValue(jobObj.description),
                requirements: getLocalizedValue(jobObj.requirements),
                type: getLocalizedValue(jobObj.type),
                category: getLocalizedValue(jobObj.category),
                salary: jobObj.salary ? {
                    amount: getLocalizedValue(jobObj.salary.amount),
                    currency: getLocalizedValue(jobObj.salary.currency),
                    frequency: getLocalizedValue(jobObj.salary.frequency)
                } : jobObj.salary,
                location: jobObj.location ? {
                    city: getLocalizedValue(jobObj.location.city),
                    area: getLocalizedValue(jobObj.location.area)
                } : jobObj.location,
                employer: jobObj.employer ? {
                    name: getLocalizedValue(jobObj.employer.name),
                    contact: getLocalizedValue(jobObj.employer.contact),
                    phone: getLocalizedValue(jobObj.employer.phone),
                    owner: getLocalizedValue(jobObj.employer.owner)
                } : jobObj.employer,
                slug: getLocalizedValue(jobObj.slug),
                isApplied: getLocalizedValue(jobObj.isApplied),
                tags: getLocalizedValue(jobObj.tags),
                duration: getLocalizedValue(jobObj.duration),
                skills: getLocalizedValue(jobObj.skills),
                vacancies: getLocalizedValue(jobObj.vacancies),
                recid: getLocalizedValue(jobObj.recid)
            };
        });
        
        return res.status(200).json({
            jobs: localizedJobs,
            total: localizedJobs.length,
            page: parseInt(page),
            limit: parseInt(limit),
            language: language
        });
    } catch (error) {
        console.error("Error getting all jobs:", error);
        res.status(500).json({ error: "Failed to get jobs", details: error.message });
    }
};

// async function getJobsbyids(jobIds){
    
//     try {
//         const { 
//             page = 1, 
//             limit = 10, 
//             search, 
//             location, 
//             type, 
//             category,
//             minSalary,
//             maxSalary,
//             language = 'en'
//         } = req.query;
//         console.log("Fetching all jobs with params:", {
//             page, limit, search, location, type, category, minSalary, maxSalary, language
//         });
//             const stringJobIds = jobIds.map(id => id.toString());

//     const jobs = await collection.find({ "jobId.en": { $in: stringJobIds } }).toArray();

//         console.log("All jobs fetched:", jobs[0]);
        
//         // Transform jobs based on language
//         const localizedJobs = jobs.map(job => {
//             const jobObj = job.toObject();
            
//             // Helper function to get value based on language
//             const getLocalizedValue = (field) => {
//                 if (field && typeof field === 'object' && field[language]) {
//                     return field[language];
//                 }
//                 return field && field.en ? field.en : field;
//             };

//             return {
//                 ...jobObj,
//                 jobId: getLocalizedValue(jobObj.jobId),
//                 title: getLocalizedValue(jobObj.title),
//                 description: getLocalizedValue(jobObj.description),
//                 requirements: getLocalizedValue(jobObj.requirements),
//                 type: getLocalizedValue(jobObj.type),
//                 category: getLocalizedValue(jobObj.category),
//                 salary: jobObj.salary ? {
//                     amount: getLocalizedValue(jobObj.salary.amount),
//                     currency: getLocalizedValue(jobObj.salary.currency),
//                     frequency: getLocalizedValue(jobObj.salary.frequency)
//                 } : jobObj.salary,
//                 location: jobObj.location ? {
//                     city: getLocalizedValue(jobObj.location.city),
//                     area: getLocalizedValue(jobObj.location.area)
//                 } : jobObj.location,
//                 employer: jobObj.employer ? {
//                     name: getLocalizedValue(jobObj.employer.name),
//                     contact: getLocalizedValue(jobObj.employer.contact),
//                     phone: getLocalizedValue(jobObj.employer.phone),
//                     owner: getLocalizedValue(jobObj.employer.owner)
//                 } : jobObj.employer,
//                 slug: getLocalizedValue(jobObj.slug),
//                 isApplied: getLocalizedValue(jobObj.isApplied),
//                 tags: getLocalizedValue(jobObj.tags),
//                 duration: getLocalizedValue(jobObj.duration),
//                 skills: getLocalizedValue(jobObj.skills),
//                 vacancies: getLocalizedValue(jobObj.vacancies),
//                 recid: getLocalizedValue(jobObj.recid)
//             };
//         });
        
//         return res.status(200).json({
//             jobs: localizedJobs,
//             total: localizedJobs.length,
//             page: parseInt(page),
//             limit: parseInt(limit),
//             language: language
//         });
//     } catch (error) {
//         console.error("Error getting all jobs:", error);
//         res.status(500).json({ error: "Failed to get jobs", details: error.message });
//     }

// }
// const getJobsByIds = async (req, res,jobIds = []) => {
// // async function getJobsByIds(jobIds = []) {
//   //const client = new MongoClient("mongodb://localhost:27017"); // Replace with your MongoDB URI
//   try {
//     // await client.connect();
//     // const db = client.db("yourDatabaseName"); // Replace with your DB name
//     // const collection = db.collection("jobs"); // Replace with your collection name

//     // const stringJobIds = jobIds.map(id => id.toString());
//     console.log(1);
//     console.log(jobss);
//     const jobss = await Job
//       .find({ jobId: { $in: jobIds } })
//       .toArray();

//     return jobss;
//   } catch (err) {
//     console.error("Error fetching jobs by IDs:", err);
//     throw err;
//   } finally {
//     await client.close();
//   }
// }

module.exports = { postjobconn, getjobs, getusers, getAllJobs };

