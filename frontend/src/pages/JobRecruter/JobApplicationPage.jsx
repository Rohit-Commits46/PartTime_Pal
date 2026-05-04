import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, User, Mail, Phone, MapPin, Calendar, FileText, Star, Download, Eye } from 'lucide-react';
// import { axiosinstance } from '../../lib/axios';
import axios from 'axios';

const JobApplicantionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const recruiterId=id;
  // Fetch jobs from your backend API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // console.log(recruiterId);
        
        // Using axios instance with base URL already configured
        const response = await axios.get(
        `http://localhost:5000/api/rec/jobs/${recruiterId}`);
        console.log(response);
        
        const data = response.data;
        
        if (data.success) {
          setJobs(data.data.jobs);
          setSummary(data.data.summary);
        } else {
          throw new Error(data.message || 'Failed to fetch jobs');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch jobs');
        // Fallback to empty data
        setJobs([]);
        setSummary({});
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [recruiterId]);

  // Handle navigate to seeker profile
  const handleViewSeekerProfile = (seekerId) => {
    console.log('Navigating to seeker profile:', seekerId);
    navigate(`/view-seeker/${seekerId}`);
  };

  // Handle accept application
  const handleAccept = async (jobId, applicantId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/accept/accept', {
        jobId: jobId,
        applicantId: applicantId,
        status: 'accepted'
      });
      
      if (response.data.message === "Status updated successfully") {
        // Update the local state to reflect the change
        setJobs(prevJobs => 
          prevJobs.map(job => ({
            ...job,
            applicants: job.applicants.map(applicant => 
              applicant.seekerInfo._id === applicantId 
                ? { ...applicant, applicationDetails: { ...applicant.applicationDetails, status: 'accepted' }}
                : applicant
            )
          }))
        );
        alert('Application accepted successfully!');
      }
    } catch (error) {
      console.error('Error accepting application:', error);
      alert('Failed to accept application. Please try again.');
    }
  };

  // Handle reject application
  const handleReject = async (jobId, applicantId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/accept/accept', {
        jobId: jobId,
        applicantId: applicantId,
        status: 'rejected'
      });
      
      if (response.data.message === "Status updated successfully") {
        // Update the local state to reflect the change
        setJobs(prevJobs => 
          prevJobs.map(job => ({
            ...job,
            applicants: job.applicants.map(applicant => 
              applicant.seekerInfo._id === applicantId 
                ? { ...applicant, applicationDetails: { ...applicant.applicationDetails, status: 'rejected' }}
                : applicant
            )
          }))
        );
        alert('Application rejected successfully!');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application. Please try again.');
    }
  };

  // Get status color for status badges
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredJobs = jobs.map(job => ({
    ...job,
    applicants: job.applicants.filter(applicant => 
      filterStatus === 'all' || applicant.applicationDetails.status === filterStatus
    )
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job applicants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Applicants Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Total Jobs</h3>
              <p className="text-2xl font-bold text-blue-600">{jobs.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Total Applicants</h3>
              <p className="text-2xl font-bold text-green-600">
                {jobs.reduce((sum, job) => sum + job.totalApplicants, 0)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Active Applications</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {jobs.reduce((sum, job) => sum + job.activeApplicants, 0)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Accepted</h3>
              <p className="text-2xl font-bold text-emerald-600">
                {jobs.reduce((sum, job) => sum + job.acceptedApplicants, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <div key={job.jobInfo._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Job Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{job.jobInfo.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.jobInfo.location.city}, {job.jobInfo.location.area}
                      </span>
                      <span>{job.jobInfo.category}</span>
                      <span>{job.jobInfo.salary?.amount && job.jobInfo.salary?.currency ? 
                        `${job.jobInfo.salary.amount} ${job.jobInfo.salary.currency}${job.jobInfo.salary.frequency ? `/${job.jobInfo.salary.frequency}` : ''}` : 
                        'Salary not specified'}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Posted: {formatDate(job.jobInfo.postedDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Applicants</p>
                      <p className="text-2xl font-bold text-blue-600">{job.applicants.length}</p>
                    </div>
                    <button
                      onClick={() => setExpandedJob(expandedJob === job.jobInfo._id ? null : job.jobInfo._id)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {expandedJob === job.jobInfo._id ? 
                        <ChevronUp className="w-5 h-5" /> : 
                        <ChevronDown className="w-5 h-5" />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Applicants List */}
              {expandedJob === job.jobInfo._id && (
                <div className="p-6">
                  {job.applicants.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No applicants found for this filter.</p>
                  ) : (
                    <div className="grid gap-4">
                      {job.applicants.map((applicant) => (
                        <div key={applicant.applicationId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{applicant.seekerInfo.name}</h3>
                                  <p className="text-sm text-gray-500">{applicant.seekerInfo.experience} experience</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.applicationDetails.status)}`}>
                                  {applicant.applicationDetails.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <Mail className="w-4 h-4" />
                                    {applicant.seekerInfo.email}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <Phone className="w-4 h-4" />
                                    {applicant.seekerInfo.phone}
                                  </div>
                                  {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    {applicant.seekerInfo.location}
                                  </div> */}
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">
                                    <strong>Skills:</strong> {applicant.seekerInfo.skills.join(', ')}
                                  </p>
                                  <p className="text-sm text-gray-600 mb-1">
                                    <strong>Education:</strong> {applicant.seekerInfo.education}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <strong>Expected Salary:</strong> {applicant.seekerInfo.expectedSalary}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-sm text-gray-700 mb-2">
                                  <strong>Bio:</strong> {applicant.seekerInfo.bio}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Applied on: {formatDate(applicant.applicationDetails.appliedAt)}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <button 
                                onClick={() => handleViewSeekerProfile(applicant.seekerInfo.seekerId)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                View Profile
                              </button>
                              <button 
                                onClick={() => handleAccept(job.jobInfo.jobId, applicant.seekerInfo.seekerId)}
                                className={`px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors ${
                                  applicant.applicationDetails.status === 'accepted' ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={applicant.applicationDetails.status === 'accepted'}
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => handleReject(job.jobInfo._id, applicant.seekerInfo._id)}
                                className={`px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors ${
                                  applicant.applicationDetails.status === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={applicant.applicationDetails.status === 'rejected'}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Applicant Details Modal */}
        {selectedApplicant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Applicant Details</h2>
                  <button 
                    onClick={() => {
                      setSelectedApplicant(null);
                      setSelectedJobId(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedApplicant.seekerInfo.name}</h3>
                      <p className="text-gray-600">{selectedApplicant.seekerInfo.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Contact Information</h4>
                      <p className="text-sm text-gray-600">Phone: {selectedApplicant.seekerInfo.phone}</p>
                      <p className="text-sm text-gray-600">Location: {selectedApplicant.seekerInfo.location}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Professional Details</h4>
                      <p className="text-sm text-gray-600">Experience: {selectedApplicant.seekerInfo.experience}</p>
                      <p className="text-sm text-gray-600">Education: {selectedApplicant.seekerInfo.education}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.seekerInfo.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Bio</h4>
                    <p className="text-sm text-gray-700">{selectedApplicant.seekerInfo.bio}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Cover Letter</h4>
                    <p className="text-sm text-gray-700">{selectedApplicant.applicationDetails.coverLetter}</p>
                  </div>

                  {selectedApplicant.applicationDetails.additionalNotes && (
                    <div>
                      <h4 className="font-semibold mb-2">Additional Notes</h4>
                      <p className="text-sm text-gray-700">{selectedApplicant.applicationDetails.additionalNotes}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => {
                        handleAccept(selectedJobId, selectedApplicant.seekerInfo._id);
                        setSelectedApplicant(null);
                        setSelectedJobId(null);
                      }}
                      className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ${
                        selectedApplicant.applicationDetails.status === 'accepted' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={selectedApplicant.applicationDetails.status === 'accepted'}
                    >
                      Accept Application
                    </button>
                    <button 
                      onClick={() => {
                        handleReject(selectedJobId, selectedApplicant.seekerInfo._id);
                        setSelectedApplicant(null);
                        setSelectedJobId(null);
                      }}
                      className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors ${
                        selectedApplicant.applicationDetails.status === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={selectedApplicant.applicationDetails.status === 'rejected'}
                    >
                      Reject Application
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                      Schedule Interview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicantionsPage;