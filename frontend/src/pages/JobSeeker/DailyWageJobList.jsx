import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Briefcase, Calendar, Clock, DollarSign, Users, Tag, Search, Filter, CheckCircle, X } from 'lucide-react';
import { useAuthstore } from '../../store/useAuthstore';

const DailyWageJobList = () => {
  const [jobs, setJobs] = useState([]); // Ensure it's always initialized as an array
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedJobsDetails, setAppliedJobsDetails] = useState([]);
  const [applying, setApplying] = useState({});
  
  const { authuser } = useAuthstore();

  const categories = ['All', 'Delivery', 'Cleaning', 'Tutoring', 'Helper'];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('Fetching daily wage jobs from: http://localhost:5000/api/jobseekers/dailywagesJobs');
        
        const response = await axios.get('http://localhost:5000/api/jobseekers/dailywagesJobs');
        console.log('Daily wage jobs response:', response.data);
        
        // Handle different response structures
        let jobsData = [];
        if (Array.isArray(response.data)) {
          jobsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          jobsData = response.data.data;
        } else if (response.data && Array.isArray(response.data.jobs)) {
          jobsData = response.data.jobs;
        }
        
        console.log('Processed jobs data:', jobsData);
        
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching daily wage jobs:', err);
        setError('Failed to fetch daily wage jobs');
        setJobs([]);
        setFilteredJobs([]);
        setLoading(false);
      }
    };

    const fetchAppliedJobs = async () => {
      if (authuser && authuser.seekerId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/jobseekers/dailywage-applications/${authuser.seekerId}`);
          if (response.data && Array.isArray(response.data.applications)) {
            const appliedJobIds = response.data.applications.map(app => app.jobDetails._id);
            setAppliedJobs(appliedJobIds);
            setAppliedJobsDetails(response.data.applications);
          }
        } catch (err) {
          console.error('Error fetching applied jobs:', err);
        }
      }
    };

    fetchJobs();
    fetchAppliedJobs();
  }, [authuser]);

  // Filter jobs based on search criteria
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter && categoryFilter !== 'All') {
      filtered = filtered.filter(job => job.category === categoryFilter);
    }

    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, categoryFilter, locationFilter]);

  // Apply for a job
  const handleApply = async (jobId) => {
    if (!authuser || !authuser.seekerId) {
      alert('Please login to apply for jobs');
      return;
    }

    setApplying(prev => ({ ...prev, [jobId]: true }));
    
    try {
      const response = await axios.post('http://localhost:5000/api/jobseekers/apply-dailywage', {
        jobId: jobId,
        seekerId: authuser.seekerId,
        status: 'pending'
      });

      if (response.data.success) {
        setAppliedJobs(prev => [...prev, jobId]);
        alert('Application submitted successfully!');
      } else {
        alert(response.data.message || 'Failed to apply for job');
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      alert('Failed to apply for job. Please try again.');
    } finally {
      setApplying(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Check if job is already applied
  const isJobApplied = (jobId) => {
    return appliedJobs.includes(jobId);
  };

  if (loading) return <div className="text-center mt-10">Loading jobs...</div>;
  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!jobs || !Array.isArray(jobs)) {
    return <div className="text-gray-500 text-center mt-10">No daily wage jobs found.</div>;
  }

  return (
    <div className="p-6 max-w-full mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-medium mb-6 text-center text-gray-800">Daily Wage Jobs Dashboard</h2>
      
      {/* Two Sections Side by Side */}
      <div className="flex gap-6">
        
        {/* Section 1: Available Daily Wage Jobs - LEFT SIDE (60% width) */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-6" style={{width: '60%'}}>
          <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full mb-6"></div>
        
          {/* Search and Filter Section */}
          <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
              <Search size={18} className="mr-2 text-orange-500" />
              Search & Filter Jobs
            </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-xs text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        </div>

        {/* Available Jobs Grid */}
        <div className="max-h-screen overflow-y-auto">
          {filteredJobs.length === 0 ? (
            <div className="text-gray-500 text-center mt-6">
              <Briefcase size={40} className="mx-auto mb-3 text-gray-300" />
              <h3 className="text-md font-medium mb-2">No jobs found</h3>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {filteredJobs.map((job) => (
                <div key={job._id} className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                  {/* Job Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                      <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                        {job.category}
                      </span>
                    </div>
                    {isJobApplied(job._id) && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Applied
                      </span>
                    )}
                  </div>

                  {/* Job Description */}
                  <p className="text-gray-600 mb-3 text-sm line-clamp-2">{job.description}</p>

                  {/* Job Details */}
                  <div className="space-y-2 mb-4 text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-red-600" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={12} className="text-yellow-600" />
                      <span className="font-semibold">₹{job.wage} / day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={12} className="text-purple-600" />
                      <span>{job.positions} position(s)</span>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      ID: {job._id?.slice(-6) || 'N/A'}
                    </div>
                    {isJobApplied(job._id) ? (
                      <button 
                        className="bg-gray-400 text-white px-4 py-1 rounded-md cursor-not-allowed flex items-center text-xs"
                        disabled
                      >
                        <CheckCircle size={12} className="mr-1" />
                        Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(job._id)}
                        disabled={applying[job._id]}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1 rounded-md transition-colors duration-200 flex items-center disabled:opacity-50 text-xs"
                      >
                        {applying[job._id] ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            Applying...
                          </>
                        ) : (
                          <>
                            <Briefcase size={12} className="mr-1" />
                            Apply Now
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: My Applied Jobs Status - RIGHT SIDE (40% width) */}
      <div className="bg-white rounded-2xl shadow-xl p-4" style={{width: '40%'}}>
        <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full mb-4"></div>
        
        {appliedJobsDetails.length === 0 ? (
          <div className="text-gray-500 text-center mt-4 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-300">
            <CheckCircle size={32} className="mx-auto mb-3 text-gray-300" />
            <h3 className="text-sm font-medium mb-2 text-gray-600">No Applications</h3>
            <p className="text-gray-500 text-xs max-w-sm mx-auto">
              Start applying to see your status here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3 p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {appliedJobsDetails.length}
                </div>
                <span className="text-blue-800 font-medium text-xs">Total</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {appliedJobsDetails.filter(app => app.status === 'accepted').length}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  {appliedJobsDetails.filter(app => app.status === 'pending').length}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {appliedJobsDetails.filter(app => app.status === 'rejected').length}
                </span>
              </div>
            </div>
            
            <div className="max-h-screen overflow-y-auto space-y-2">
              {appliedJobsDetails.map((application) => (
                <div key={application._id} className="bg-gradient-to-r from-white to-gray-50 p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                        {application.jobDetails?.title || 'Job Title Unavailable'}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin size={10} className="text-red-500" />
                          <span className="truncate max-w-16">{application.jobDetails?.location || 'N/A'}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'accepted' 
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <DollarSign size={10} className="text-green-500" />
                      <span>₹{application.jobDetails?.wage || 'N/A'}</span>
                    </div>
                    {application.status === 'accepted' && (
                      <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                        <CheckCircle size={10} />
                        Hired!
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      </div> {/* End of flex container */}
    </div>
  );
};

export default DailyWageJobList;
