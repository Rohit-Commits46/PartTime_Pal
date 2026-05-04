const {Job}=require("../model/job")

const getJobsByIds = async (jobIds = [], language = 'en', page = 1, limit = 100) => {
  try {
    console.log(jobIds);
    if (!Array.isArray(jobIds)) {
      jobIds = [jobIds];
    }
    

    const stringJobIds = jobIds.map(id => id.toString());
    const allJobs = await Job.find({ "jobId": { $in: stringJobIds } });

    const jobMap = new Map();
    allJobs.forEach(job => {
      const jobIdStr = typeof job.jobId === 'object' ? job.jobId.en?.toString() : job.jobId?.toString();
      if (jobIdStr) jobMap.set(jobIdStr, job);
    });

    const jobs = stringJobIds.map(id => jobMap.get(id)).filter(Boolean);
    // console.log(jobs);
    
    const localizedJobs = jobs.map(job => {
      const jobObj = job.toObject();
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
        salary: (jobObj.salary && typeof jobObj.salary === 'object') ? {
          amount: getLocalizedValue(jobObj.salary.amount),
          currency: getLocalizedValue(jobObj.salary.currency),
          frequency: getLocalizedValue(jobObj.salary.frequency)
        } : null,
        location: (jobObj.location && typeof jobObj.location === 'object') ? {
          city: getLocalizedValue(jobObj.location.city),
          area: getLocalizedValue(jobObj.location.area)
        } : null,
        employer: (jobObj.employer && typeof jobObj.employer === 'object') ? {
          name: getLocalizedValue(jobObj.employer.name),
          contact: getLocalizedValue(jobObj.employer.contact),
          phone: getLocalizedValue(jobObj.employer.phone),
          owner: getLocalizedValue(jobObj.employer.owner)
        } : null,
        slug: getLocalizedValue(jobObj.slug),
        isApplied: getLocalizedValue(jobObj.isApplied),
        tags: getLocalizedValue(jobObj.tags),
        duration: getLocalizedValue(jobObj.duration),
        skills: getLocalizedValue(jobObj.skills),
        vacancies: getLocalizedValue(jobObj.vacancies),
        recid: getLocalizedValue(jobObj.recid)
      };
    });

    return {
      jobs: localizedJobs,
      total: localizedJobs.length,
      page: parseInt(page),
      limit: parseInt(limit),
      language
    }

  } catch (err) {
    console.error("Error fetching jobs by IDs:", err);
    return { error: 'Internal Server Error' };
  }
};
module.exports = {
  getJobsByIds,
};
