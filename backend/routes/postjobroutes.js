const express = require("express");
const { postjobconn, getjobs, getusers, getAllJobs } = require("../controllers/postjobconn.controller.js");

const router = express.Router();

// ✅ Add :recid here to match frontend call
router.post('/', postjobconn);
router.get('/all', getAllJobs); // Route to get all jobs
router.get('/:id', getusers);

module.exports = router;
