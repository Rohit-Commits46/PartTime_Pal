const {jobSeekers}=require('../model/freelancer')
const {Job}=require('../model/job');
const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Types;
const {JobApplication}=require('../database/application');
// const {jobSeekers}=require('../model/freelancer');
const DailyWageJob=require("../model/dailywages")
const DailyWageApplication = require('../model/dailywageApplication');

async function createjobSeeker(req, res) {
    try {
        console.log(req.body);
        const { email } = req.body;
        let user = await jobSeekers.findOne({ email });

        if (user) {
            const updateFields = {
                seekerId: req.body.seekerId || "DEFAULT_SEEKER_ID",
                name: req.body.name || "Unknown",
                phone: req.body.phone || "0000000000",
                location: req.body.location || { city: "Unknown", state: "Unknown" },
                preferredJobTypes: req.body.preferredJobTypes || [],
                skills: req.body.skills || [],
                experience: req.body.experience || "No experience",
                availability: req.body.availability || { days: [], timeSlots: [] },
                appliedJobs: req.body.appliedJobs || [],
                resume: req.body.resume || "No resume uploaded",
                isEmployed: req.body.isEmployed !== undefined ? req.body.isEmployed : false,
            };

            user = await jobSeekers.findOneAndUpdate(
                { email },
                { $set: updateFields },
                { new: true }
            );

            console.log("User updated successfully", user);
            return res.status(200).json({ message: "User updated successfully", data: user, success: true });
        } else {
            return res.status(404).json({ message: "User does not exist, please register", success: false });
        }

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function googleLoginJobSeeker(req,res) {
    try {
        const {email2}=req.body;
        console.log(email2);
        
        const user=await jobSeekers.findOne({email:email2});
        if(user){
            res.status(200).json({message:"User already exists",data:user});
        }else{
            res.status(200).json({message:"User does not exist please register",data:null});
        }

    } catch (error) {
        res.status(500).json({error:"Internal Server Error"});
    }
}

async function signinJobSeeker(req,res) {
    try {
        const {name,email,password}=req.body;   
        console.log(req.body);

        // const user=await jobSeekers.create({name,email,password});
        const user=await jobSeekers.create({name,email,password});
        console.log(user);
        if(user){
            console.log("User created successfully");
            res.status(200).json({message:"User created successfully",data:user});
        }else{
            console.log("User already exists");
            res.status(200).json({message:"User already exists",data:user});
        }

    } catch (error) {
        console.log(error);
        
    }
}

async function userLogin(req,res) {
    try {
        const {email,password}=req.body;
        console.log(email,password);
        
        const user=await jobSeekers.findOne({email,password});
        console.log("bhj",user);
        if(user){ 
            console.log(1);
            res.status(200).json({userdata:user});
        }else{
            res.status(200).json({data:null});
        }

    } catch (error) {
        res.status(500).json({error:"Internal Server Error"});
    }
}

async function getUserById(req, res) {
    const { id } = req.params;
    console.log(id);
    try {
        const user = await jobSeekers.findOne({
            seekerId:id
        });
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        return res.status(200).json({ user, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

async function updateUserByID(req,res){
    try {
        const { id } = req.params;
        const { name, email, phone, location, preferredJobTypes, skills, experience, availability, appliedJobs, resume } = req.body;
        console.log(id);
        console.log(req.body);
        const user = await jobSeekers.findOneAndUpdate({seekerId:id}, {
            name,
            email,
            phone,
            location,
            preferredJobTypes,
            skills,
            experience,
            availability,
            appliedJobs,
            resume
        }, { new: true });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        
    } catch (error) {
        console.log(error);
        
    }
}

async function handleapply(req,res){

    try {
        const { jobid, providerId ,status,seekerId } = req.body;
        console.log(jobid, providerId, status,seekerId);
        const application= await JobApplication.create({
            jobId: String(jobid),
            seekerId: seekerId,
            providerId: providerId,
            status: status
        })
        console.log("huurr");
        console.log(application);
        
        if(application){
            const updated=await jobSeekers.findOneAndUpdate({seekerId:seekerId},{$push:{appliedJobs:jobid}});
            console.log(updated);
            return res.status(200).json({  success: true });
        }


    } catch (error) {
        console.log(error);
    }
}

async function handlesearch(req,res){
    try {
        const { id } = req.body;
        console.log(id);
        
        const job=await Job.findOne({ jobId: id });
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }else{
            return res.status(200).json({ message: "Job found", data: job, success: true });
        }
        
    }
    catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getSeekerApplications(req, res) {
    try {
        const { id, language } = req.params; // seekerId
        console.log("Fetching applications for seeker:", id);
        console.log(language);
        
        // Get all applications for this seeker
        const applications = await JobApplication.find({ seekerId: id }).lean();
        
        if (!applications || applications.length === 0) {
            return res.status(200).json({ message: "No applications found", applications: [] });
        }

        // Get job details for each application
        const applicationsWithJobDetails = await Promise.all(
            applications.map(async (app) => {
                const job = await Job.findOne({ jobId: app.jobId }).lean();
                
                console.log(`Application ${app._id}: jobId=${app.jobId}, providerId=${app.providerId}, status=${app.status}`);
                if (job) {
                    console.log(`Job found: ${job.title?.[language]} by ${job.employer?.name?.[language]}`);
                } else {
                    console.log(`Job not found for jobId: ${app.jobId}`);
                }
                
                return {
                    applicationId: app._id,
                    jobId: app.jobId,
                    providerId: app.providerId,
                    status: app.status,
                    appliedAt: app.appliedAt,
                    jobDetails: job ? {
                        title: job.title?.[language],
                        company: job.category?.[language] || 'Unknown Company',
                        location: job.location.city?.[language],
                        salary: job.salary?.amount?.[language] || 'Not specified',
                        type: job.type?.[language],
                        description: job.description?.[language]
                    } : null
                };
            })
        );

        res.status(200).json({ 
            message: "Applications fetched successfully", 
            applications: applicationsWithJobDetails 
        });

    } catch (error) {
        console.error("Error fetching seeker applications:", error);
        res.status(500).json({ error: "Failed to get applications", details: error.message });
    }
}

async function updateProfile(req, res) {
    try {
        const { id } = req.params; // seekerId
        const updateData = req.body;
        
        console.log("Updating profile for seeker:", id);
        console.log("Update data:", updateData);

        const updatedUser = await jobSeekers.findOneAndUpdate(
            { seekerId: id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }
}

async function uploadResume(req, res) {
    try {
        const { id } = req.params; // seekerId
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: "No file uploaded" 
            });
        }

        // In a real application, you would upload to cloud storage like AWS S3, Cloudinary, etc.
        // For now, we'll just store the file path
        const resumeUrl = `/uploads/resumes/${req.file.filename}`;

        const updatedUser = await jobSeekers.findOneAndUpdate(
            { seekerId: id },
            { resume: resumeUrl },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resumeUrl: resumeUrl,
            user: updatedUser
        });

    } catch (error) {
        console.error("Error uploading resume:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }
}
async function dailywagesJobs(req, res) {
  try {
    const data = await DailyWageJob.find(); // Await the async operation
    console.log(data);
    return res.status(200).json({ message: 'Jobs fetched successfully', data });
  } catch (error) {
    console.error('Error fetching daily wage jobs:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Apply to a daily wage job
async function applyToDailyWageJob(req, res) {
    try {
        const { jobId, seekerId } = req.body;
        
        // Check if the job exists
        const job = await DailyWageJob.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        
        // Check if the seeker exists
        const seeker = await jobSeekers.findOne({ seekerId: seekerId });
        if (!seeker) {
            return res.status(404).json({
                success: false,
                message: 'Job seeker not found'
            });
        }
        
        // Check if already applied
        const existingApplication = await DailyWageApplication.findOne({ jobId, seekerId });
        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this job'
            });
        }
        
        // Create new application
        const newApplication = new DailyWageApplication({
            jobId,
            seekerId,
            status: 'pending'
        });
        
        const savedApplication = await newApplication.save();
        
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: savedApplication
        });
        
    } catch (error) {
        console.error('Error applying to daily wage job:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application',
            error: error.message
        });
    }
}

// Get seeker's daily wage applications
async function getSeekerDailyWageApplications(req, res) {
    try {
        const { seekerId } = req.params;
        
        const applications = await DailyWageApplication.find({ seekerId })
            .populate('jobId', 'title startDate endDate workingHours location wage')
            .sort({ createdAt: -1 });
        
        // Format the response
        const formattedApplications = applications.map(app => ({
            _id: app._id,
            status: app.status,
            appliedAt: app.createdAt,
            jobDetails: app.jobId
        }));
        
        res.status(200).json({
            success: true,
            applications: formattedApplications
        });
        
    } catch (error) {
        console.error('Error fetching seeker applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: error.message
        });
    }
}
module.exports={
    createjobSeeker,
    googleLoginJobSeeker,
    signinJobSeeker,
    userLogin,
    getUserById,
    updateUserByID,
    handleapply,
    handlesearch,
    getSeekerApplications,
    updateProfile,
    uploadResume,
    dailywagesJobs,
    applyToDailyWageJob,
    getSeekerDailyWageApplications
}