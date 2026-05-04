const mongoose = require("mongoose");
const Job = require("../database/postjob.model");

async function deleteSampleJobs() {
  await mongoose.connect("mongodb://localhost:27017/PathTimeJobFinder");
  const ids = ["job-001","job-002","job-003","job-004","job-005","job-006","job-007","job-008","job-009","job-010"];
  const result = await Job.deleteMany({ jobId: { $in: ids } });
  console.log("Deleted " + result.deletedCount + " sample jobs");
  await mongoose.disconnect();
  process.exit(0);
}

deleteSampleJobs();
