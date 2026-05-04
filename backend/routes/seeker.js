const express=require('express');
const multer = require('multer');
const path = require('path');
const route=express.Router()
const {dailywagesJobs,createjobSeeker,getUserById,signinJobSeeker,userLogin,updateUserByID, handleapply, handlesearch, getSeekerApplications, updateProfile, uploadResume, applyToDailyWageJob, getSeekerDailyWageApplications}=require('../controllers/freelancerController')

const {getJobsByText}=require('../controllers/ml.js');

// Configure multer for resume uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

route.post('/',createjobSeeker);
route.get('/profile/:id', getUserById);
route.post('/profile/:id', updateUserByID);
route.put('/profile/:id', updateProfile); // New profile update route
route.post('/upload-resume/:id', upload.single('resume'), uploadResume); // New resume upload route
route.post('/login', userLogin);
route.post('/signin', signinJobSeeker);
route.post('/apply', handleapply);
route.post('/findjobs', handlesearch);
route.get('/applications/:id/:language', getSeekerApplications);
route.post('/recommendation_by_text', getJobsByText);
route.get("/dailywagesJobs",dailywagesJobs);
route.post('/apply-dailywage', applyToDailyWageJob);
route.get('/dailywage-applications/:seekerId', getSeekerDailyWageApplications);
module.exports=route;
 