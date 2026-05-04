const express = require('express');
const route = express.Router();

// Import the functions from recController
const { userLogin, getJobs, dailywages, getDailyWageApplications, updateDailyWageApplication } = require('../controllers/recController');

// Define the routes and assign the corresponding functions
route.post('/login', userLogin);
route.get('/jobs/:id', getJobs);
route.post('/dailywages/:id', dailywages);
route.get('/dailywage-applications/:recid', getDailyWageApplications);
route.put('/dailywage-application/:applicationId', updateDailyWageApplication);

// Export the router
module.exports = route;
