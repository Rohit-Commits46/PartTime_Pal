const { RecruiterUser } = require('../model/rec.js');
const { JobApplication } = require('../database/application.js');
const { jobSeekers } = require('../model/freelancer.js'); // Import the jobSeekers model
const DailyWageJob=require("../model/dailywages")
const DailyWageApplication = require('../model/dailywageApplication');
// const Job = require("../database/postjob.model.js"); // Keep this import
const {Job}=require('../model/job.js')

async function userLogin(req, res) {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        const user = await RecruiterUser.findOne({ email: email.trim(), password: password.trim() });
        // console.log(RecruiterUser.find({}));
        RecruiterUser.find({}).then(users => {
  console.log(users);
});

        if (user) {
            console.log(1);
            res.status(200).json({ userdata: user });
        } else {
            res.status(200).json({ data: null });
        }

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

function getEnglishField(field) {
    return field?.en || '';
}

function getEnglishArray(field) {
    return field?.en || [];
}

// Converts a multilingual job to a clean English-only object
function formatJobToEnglish(jobii) {
    return {
        _id: jobii._id,
        jobId: jobii.jobId,
        title: getEnglishField(jobii.title),
        description: getEnglishField(jobii.description),
        requirements: getEnglishField(jobii.requirements),
        salary: {
            amount: getEnglishField(jobii.salary?.amount),
            currency: getEnglishField(jobii.salary?.currency),
            frequency: getEnglishField(jobii.salary?.frequency)
        },
        type: getEnglishField(jobii.type),
        category: getEnglishField(jobii.category),
        preferredTime: {
            start: getEnglishField(jobii.preferredTime?.start),
            end: getEnglishField(jobii.preferredTime?.end)
        },
        location: {
            city: getEnglishField(jobii.location?.city),
            area: getEnglishField(jobii.location?.area)
        },
        employer: {
            name: getEnglishField(jobii.employer?.name),
            contact: getEnglishField(jobii.employer?.contact),
            phone: getEnglishField(jobii.employer?.phone),
            owner: getEnglishField(jobii.employer?.owner)
        },
        slug: getEnglishField(jobii.slug),
        isApplied: getEnglishField(jobii.isApplied),
        tags: getEnglishArray(jobii.tags),
        duration: getEnglishField(jobii.duration),
        skills: getEnglishArray(jobii.skills),
        vacancies: getEnglishField(jobii.vacancies),
        schedule: {
            shifts: getEnglishField(jobii.schedule?.shifts),
            days: getEnglishArray(jobii.schedule?.days)
        },
        latitude: getEnglishField(jobii.latitude),
        longitude: getEnglishField(jobii.longitude),
        recid: jobii.recid,
        createdAt: jobii.createdAt,
        updatedAt: jobii.updatedAt,
        isActive: jobii.isActive,
        status: jobii.status,
        views: jobii.views,
        postedDate: jobii.postedDate,
        lastModified: jobii.lastModified,
        totalApplications: jobii.totalApplications
    };
}

async function getJobs(req, res) {
    try {
        const { id } = req.params;
        console.log('Fetching jobs for recruiter ID:', id);

        const jobs = await Job.find({ recid: id });
        console.log('Found jobs:', jobs.length);

        const jobsWithApplicants = await Promise.all(
            jobs.map(async (jobii) => {
                const applications = await JobApplication.find({ jobId: jobii.jobId }).lean();
                const applicants = await Promise.all(
                    applications.map(async (app) => {
                        try {
                            const seeker = await jobSeekers.findOne({ seekerId: app.seekerId }).lean();
                            if (!seeker) {
                                return {
                                    applicationId: app._id,
                                    seekerId: app.seekerId,
                                    applicationDetails: {
                                        status: app.status,
                                        appliedAt: app.appliedAt,
                                        coverLetter: app.coverLetter,
                                        additionalNotes: app.additionalNotes
                                    },
                                    seekerInfo: null,
                                    error: 'Seeker profile not found'
                                };
                            }

                            return {
                                applicationId: app._id,
                                seekerInfo: {
                                    _id: seeker._id,
                                    seekerId: seeker.seekerId,
                                    name: seeker.name,
                                    email: seeker.email,
                                    phone: seeker.phone,
                                    location: seeker.location,
                                    preferredJobTypes: seeker.preferredJobTypes,
                                    skills: seeker.skills,
                                    experience: seeker.experience,
                                    availability: seeker.availability,
                                    resume: seeker.resume,
                                    profilePicture: seeker.profilePicture,
                                    bio: seeker.bio,
                                    education: seeker.education,
                                    certifications: seeker.certifications,
                                    languages: seeker.languages,
                                    portfolio: seeker.portfolio,
                                    dateOfBirth: seeker.dateOfBirth,
                                    gender: seeker.gender,
                                    nationality: seeker.nationality,
                                    address: seeker.address,
                                    socialLinks: seeker.socialLinks,
                                    workHistory: seeker.workHistory,
                                    references: seeker.references,
                                    expectedSalary: seeker.expectedSalary,
                                    currentSalary: seeker.currentSalary,
                                    noticePeriod: seeker.noticePeriod,
                                    isActive: seeker.isActive,
                                    createdAt: seeker.createdAt,
                                    updatedAt: seeker.updatedAt
                                },
                                applicationDetails: {
                                    status: app.status,
                                    appliedAt: app.appliedAt,
                                    coverLetter: app.coverLetter,
                                    additionalNotes: app.additionalNotes,
                                    applicationId: app._id,
                                    jobId: app.jobId,
                                    createdAt: app.createdAt,
                                    updatedAt: app.updatedAt
                                }
                            };
                        } catch (err) {
                            return {
                                applicationId: app._id,
                                seekerId: app.seekerId,
                                applicationDetails: {
                                    status: app.status,
                                    appliedAt: app.appliedAt,
                                    coverLetter: app.coverLetter,
                                    additionalNotes: app.additionalNotes
                                },
                                seekerInfo: null,
                                error: 'Error fetching seeker details'
                            };
                        }
                    })
                );

                return {
                    jobInfo: formatJobToEnglish(jobii),
                    applicants: applicants,
                    totalApplicants: applicants.length,
                    activeApplicants: applicants.filter(app => ['pending', 'reviewing'].includes(app.applicationDetails?.status)).length,
                    acceptedApplicants: applicants.filter(app => app.applicationDetails?.status === 'accepted').length,
                    rejectedApplicants: applicants.filter(app => app.applicationDetails?.status === 'rejected').length
                };
            })
        );

        const totalJobs = jobsWithApplicants.length;
        const totalApplicants = jobsWithApplicants.reduce((sum, job) => sum + job.totalApplicants, 0);
        const activeJobs = jobsWithApplicants.filter(job => job.jobInfo?.isActive).length;

        return res.status(200).json({
            success: true,
            message: 'Jobs with applicants fetched successfully (English only)',
            data: {
                jobs: jobsWithApplicants,
                summary: {
                    recruiterId: id,
                    totalJobs,
                    activeJobs,
                    inactiveJobs: totalJobs - activeJobs,
                    totalApplicants
                }
            }
        });

    } catch (error) {
        console.error('Error fetching jobs with applicants:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching jobs',
            error: error.message
        });
    }
}


async function dailywages(req, res) {
    try {
        const jobData = req.body;
        const { id } = req.params;
        console.log("Received job data:", jobData);
        jobData.recid = id; // Assign recruiter ID

        console.log("Received jobData:", jobData); // ✅ Log the data before create

        const createdJob = await DailyWageJob.create(jobData);

        console.log('New daily wage job created');
        res.status(201).json({ 
            success: true,
            message: 'Daily wage job created successfully', 
            data: createdJob 
        });

    } catch (error) {
        console.error('Error creating daily wage job:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to create daily wage job', 
            error: error.message 
        });
    }
}

// Get daily wage applications for a recruiter
async function getDailyWageApplications(req, res) {
    try {
        const { recid } = req.params;
        
        // Find all daily wage jobs by this recruiter
        const recruiterJobs = await DailyWageJob.find({ recid }).select('_id');
        const jobIds = recruiterJobs.map(job => job._id);
        
        // Find all applications for these jobs
        const applications = await DailyWageApplication.find({ jobId: { $in: jobIds } })
            .populate('jobId', 'title startDate endDate workingHours location wage')
            .sort({ createdAt: -1 });
        
        // Manually get seeker details for each application
        const formattedApplications = [];
        for (const app of applications) {
            const seekerDetails = await jobSeekers.findOne({ seekerId: app.seekerId });
            formattedApplications.push({
                _id: app._id,
                status: app.status,
                appliedAt: app.createdAt,
                jobDetails: app.jobId,
                seekerDetails: seekerDetails ? {
                    _id: seekerDetails._id,
                    name: seekerDetails.name,
                    email: seekerDetails.email,
                    phone: seekerDetails.phone,
                    location: seekerDetails.location,
                    resume: seekerDetails.resume,
                    skills: seekerDetails.skills
                } : null
            });
        }
        
        res.status(200).json({
            success: true,
            applications: formattedApplications
        });
        
    } catch (error) {
        console.error('Error fetching daily wage applications:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch applications', 
            error: error.message 
        });
    }
}

// Update daily wage application status
async function updateDailyWageApplication(req, res) {
    try {
        const { applicationId } = req.params;
        const { status, jobId, seekerId, recruiterId } = req.body;
        
        const updatedApplication = await DailyWageApplication.findByIdAndUpdate(
            applicationId,
            { status, updatedAt: new Date() },
            { new: true }
        );
        
        if (!updatedApplication) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            data: updatedApplication
        });
        
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update application', 
            error: error.message 
        });
    }
}

    //   jj
module.exports = {
    userLogin,
    getJobs,
    dailywages,
    getDailyWageApplications,
    updateDailyWageApplication
};