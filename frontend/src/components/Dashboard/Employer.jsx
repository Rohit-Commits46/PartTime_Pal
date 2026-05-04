import React, { useState, useEffect } from 'react';
import { Clock, FileText, MessageSquare, User, Briefcase, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthstore } from '../../store/useAuthstore';
import axios from 'axios';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { authuser, setAuthuser, connectSocket, loadAuthuser } = useAuthstore();
  
  // State for real-time data
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    positionsFilled: 0
  });
  
  // Load authuser on component mount
  useEffect(() => {
    if (!authuser && localStorage.getItem("authuser_recruiter")) {
      loadAuthuser('recruiter');
    }
  }, [authuser, loadAuthuser]);

  // Debug authuser for recruiter
  useEffect(() => {
    if (authuser) {
      console.log('Current recruiter authuser:', authuser);
      console.log('Recruiter authuser keys:', Object.keys(authuser));
      console.log('recId:', authuser.recId);
      console.log('_id:', authuser._id);
    }
  }, [authuser]);
  
  // Fetch recruiter's jobs and applications
  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      // Try multiple possible ID fields for recruiter - recid is the primary field
      const recruiterId = authuser?.recid || authuser?.recId || authuser?._id || authuser?.id;
      
      if (recruiterId) {
        try {
          setLoading(true);
          console.log('Fetching jobs for recruiter ID:', recruiterId);
          console.log('Full authuser object:', authuser);
          const response = await axios.get(`http://localhost:5000/api/rec/jobs/${recruiterId}`);
          console.log('Jobs response:', response.data);
          console.log('Response data structure:', JSON.stringify(response.data, null, 2));
          
          // The backend returns data.jobs array, each containing jobInfo and applicants
          const jobsData = response.data.data?.jobs || [];
          console.log('Jobs data:', jobsData);
          console.log('Jobs data length:', jobsData.length);
          
          // Log each job's applicants
          jobsData.forEach((job, index) => {
            console.log(`Job ${index + 1}:`, job.jobInfo?.title);
            console.log(`  - Applicants:`, job.applicants);
            console.log(`  - Applicant count:`, job.applicants?.length || 0);
          });
          
          // Transform the data to match the expected format
          const transformedJobs = jobsData.map(job => ({
            ...job.jobInfo,
            applicants: job.applicants || []
          }));
          
          console.log('Transformed jobs:', transformedJobs);
          setJobs(transformedJobs);
          
          // Calculate stats from transformed data
          const activeJobs = transformedJobs.length;
          const totalApplicants = transformedJobs.reduce((sum, job) => {
            const applicantCount = job.applicants?.length || 0;
            console.log(`Job ${job.jobId} (${job.title}) has ${applicantCount} applicants:`, job.applicants);
            return sum + applicantCount;
          }, 0);
          const positionsFilled = transformedJobs.reduce((sum, job) => {
            const acceptedCount = job.applicants?.filter(app => 
              app.applicationDetails?.status === 'accepted' || app.status === 'accepted'
            ).length || 0;
            console.log(`Job ${job.jobId} (${job.title}) has ${acceptedCount} accepted applicants`);
            return sum + acceptedCount;
          }, 0);
          
          console.log('Calculated stats:', { activeJobs, totalApplicants, positionsFilled });
          
          setStats({
            activeJobs,
            totalApplicants,
            positionsFilled
          });
          
        } catch (error) {
          console.error('Error fetching jobs:', error);
          console.error('Request URL was:', `http://localhost:5000/api/rec/jobs/${recruiterId}`);
          setJobs([]);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No recruiter ID found, cannot fetch jobs');
        console.log('Available authuser fields:', authuser ? Object.keys(authuser) : 'No authuser');
        setLoading(false);
      }
    };

    fetchJobsAndApplications();
  }, [authuser]);

  const gotToNewPage = () => {
    navigate("/recruiter/profile");
  };

  const goToPostJob = () => {
    navigate("/recruiter/postjob");
  };

  const goToApplications = () => {
    navigate("/recruiter/applications");
  };

  useEffect(() => {
    const user = localStorage.getItem("authuser_recruiter");
    if (user) {
      setAuthuser(JSON.parse(user), 'recruiter');
      connectSocket();
    }
  }, []);

  // Get top candidates from all jobs
  const getTopCandidates = () => {
    const allApplicants = jobs.flatMap(job => 
      (job.applicants || []).map(applicant => ({
        ...applicant.seekerInfo,
        ...applicant.applicationDetails,
        position: job.title,
        jobLocation: job.location?.city || job.city || 'Location not specified',
        name: applicant.seekerInfo?.name || 'Name not available',
        email: applicant.seekerInfo?.email || '',
        experience: applicant.seekerInfo?.experience || 'Experience not specified',
        status: applicant.applicationDetails?.status || 'pending'
      }))
    );
    
    // Sort by status priority and take top 5
    const statusPriority = { 'accepted': 3, 'pending': 2, 'rejected': 1 };
    return allApplicants
      .sort((a, b) => (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0))
      .slice(0, 5);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {authuser?.first_name || authuser?.name || 'Recruiter'}!
          </h1>
          <p className="text-gray-600 mt-1">
            {stats.activeJobs > 0 
              ? `You have ${stats.activeJobs} active job posting${stats.activeJobs !== 1 ? 's' : ''} with ${stats.totalApplicants} applicant${stats.totalApplicants !== 1 ? 's' : ''} to review.`
              : "Ready to start posting jobs and finding great candidates."
            }
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.activeJobs}</div>
            <div className="text-sm text-gray-500">Active Job Postings</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.totalApplicants}</div>
            <div className="text-sm text-gray-500">Total Applications</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-green-600">{loading ? '...' : stats.positionsFilled}</div>
            <div className="text-sm text-gray-500">Applications Accepted</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-red-600">
              {loading ? '...' : jobs.reduce((sum, job) => sum + (job.applicants?.filter(app => 
                app.applicationDetails?.status === 'rejected' || app.status === 'rejected'
              ).length || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Applications Rejected</div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Job Listings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Active Job Listings</h2>
                  <button 
                    onClick={() => navigate('/jobSeeker/findjobs')}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View all
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading jobs...</p>
                  </div>
                ) : jobs.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jobs.slice(0, 5).map((job, index) => (
                        <tr key={job.jobId || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                            <div className="text-xs text-gray-500">{job.location?.city || job.city || 'Location not specified'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{job.category || 'General'}</div>
                            <div className="text-xs text-gray-500">{job.type || 'Full-time'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {job.applicants?.length || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(job.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Jobs</h3>
                    <p className="text-gray-500 mb-4">Start by posting your first job to attract candidates.</p>
                    <button 
                      onClick={goToPostJob}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Post a Job
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Top Candidates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Recent Applicants</h2>
                  <button 
                    onClick={() => navigate('/recruiter/applications')}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View all
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading candidates...</p>
                  </div>
                ) : getTopCandidates().length > 0 ? (
                  getTopCandidates().map((candidate, index) => (
                    <div key={candidate.seekerId || index} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{candidate.name}</h3>
                          <div className="mt-1 text-xs text-gray-500">{candidate.position} • {candidate.jobLocation}</div>
                          <div className="mt-1 text-xs text-gray-500">
                            {candidate.experience || 'Experience not specified'} • 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              candidate.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {candidate.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex space-x-2">
                            {candidate.email && (
                              <a 
                                href={`mailto:${candidate.email}`}
                                className="text-xs text-indigo-600 hover:text-indigo-500"
                              >
                                Email
                              </a>
                            )}
                            <button className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md hover:bg-indigo-200">
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Applicants Yet</h3>
                    <p className="text-gray-500">Candidates will appear here once they start applying to your jobs.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Application Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Application Management</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock size={16} className="text-yellow-600 mr-2" />
                    <span className="text-sm text-gray-700">Pending Applications</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-700">
                    {jobs.reduce((sum, job) => sum + (job.applicants?.filter(app => 
                      app.applicationDetails?.status === 'pending' || app.status === 'pending'
                    ).length || 0), 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle size={16} className="text-green-600 mr-2" />
                    <span className="text-sm text-gray-700">Accepted Applications</span>
                  </div>
                  <span className="text-sm font-medium text-green-700">
                    {stats.positionsFilled}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <User size={16} className="text-red-600 mr-2" />
                    <span className="text-sm text-gray-700">Rejected Applications</span>
                  </div>
                  <span className="text-sm font-medium text-red-700">
                    {jobs.reduce((sum, job) => sum + (job.applicants?.filter(app => 
                      app.applicationDetails?.status === 'rejected' || app.status === 'rejected'
                    ).length || 0), 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={goToPostJob}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FileText size={20} className="text-indigo-600" />
                  <span className="mt-2 text-xs text-gray-600">Post New Job</span>
                </button>
                <button 
                  onClick={goToApplications}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Users size={20} className="text-indigo-600" />
                  <span className="mt-2 text-xs text-gray-600">View Applications</span>
                </button>
                <button 
                  onClick={() => navigate('/recruiter/jobs')}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Briefcase size={20} className="text-indigo-600" />
                  <span className="mt-2 text-xs text-gray-600">Manage Jobs</span>
                </button>
                <button 
                  onClick={() => navigate('/recruiter/messages')}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare size={20} className="text-indigo-600" />
                  <span className="mt-2 text-xs text-gray-600">Messages</span>
                </button>
              </div>
            </div>

            {/* Recent Job Postings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Job Postings</h2>
              <div className="space-y-4">
                {jobs.slice(0, 3).length > 0 ? (
                  jobs.slice(0, 3).map((job, index) => (
                    <div key={job.jobId || index} className="border border-gray-100 rounded-md p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">{job.location?.city || 'Location not specified'}</p>
                          <p className="text-xs text-gray-500">{job.applicants?.length || 0} applicant{(job.applicants?.length || 0) !== 1 ? 's' : ''}</p>
                          <p className="text-xs text-gray-400 mt-1">Posted {formatDate(job.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            (job.applicants?.length || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {(job.applicants?.length || 0) > 0 ? 'Has Applications' : 'No Applications'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Briefcase size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">No job postings yet</p>
                    <p className="text-xs text-gray-400 mt-1">Start by posting your first job</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recruitment Goals */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Current Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <TrendingUp size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-700">Active Job Postings</span>
                  </div>
                  <span className="text-sm font-medium">{stats.activeJobs}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users size={16} className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Total Applicants</span>
                  </div>
                  <span className="text-sm font-medium">{stats.totalApplicants}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Positions Filled</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">{stats.positionsFilled}</span>
                </div>
              </div>
              
              {stats.activeJobs > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💼 You have {stats.activeJobs} active job{stats.activeJobs !== 1 ? 's' : ''} with {stats.totalApplicants} total applicant{stats.totalApplicants !== 1 ? 's' : ''} to review.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;