const { JobApplication } = require('../database/application');

const accept = async (req, res) => {
  const { jobId, applicantId, status } = req.body;
  const seekerId=applicantId;
  console.log("Received request body:", { jobId, applicantId, status });

  try {
    // Debug: find matching applications first
    const matchedApps = await JobApplication.find({ jobId, seekerId });
    console.log("Matching applications before update:", matchedApps);

    // Update one or all if needed
    const result = await JobApplication.updateOne(
      { jobId, seekerId },
      { $set: { status } }
    );

    console.log("Update result:", result);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No matching application found" });
    }

    res.status(200).json({ message: "Status updated successfully" });

  } catch (err) {
    console.error("Error in accept:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { accept };
