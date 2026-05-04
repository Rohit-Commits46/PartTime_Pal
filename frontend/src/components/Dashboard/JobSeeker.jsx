import  { useState, useEffect } from 'react';
import { FileText, Star, Briefcase, CheckCircle, TrendingUp, Target, Award, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthstore } from "../../store/useAuthstore";
import axios from 'axios';
import { axiosinstance } from '../../lib/axios';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { authuser, loadAuthuser } = useAuthstore();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load authuser on component mount
  useEffect(() => {
    if (!authuser && localStorage.getItem("authuser_jobseeker")) {
      loadAuthuser('jobseeker');
    }
  }, [authuser, loadAuthuser]);
  console.log("Afdsad");
  
  // Debug authuser
  useEffect(() => {
    if (authuser) {
      console.log('Current authuser:', authuser);
      console.log('Authuser keys:', Object.keys(authuser));
      console.log('seekerId:', authuser.seekerId);
      console.log('_id:', authuser._id);
    }
  }, [authuser]);

  // Fetch user applications
  useEffect(() => {
    const fetchApplications = async () => {
      // Try multiple possible ID fields
      const userId = authuser?.seekerId || authuser?._id || authuser?.id;
      console.log("jnbnlk",userId);
      
      if (userId) {
        try {
          setLoading(true);
          console.log('Fetching applications for user ID:', userId);
                            var language=localStorage.getItem("language");
                  //   const params = new URLSearchParams();
                  //   params.append("language", language);
                    console.log(language)
                      const response = await axiosinstance.get(`/jobseekers/applications/${userId}/${language}`);
          console.log('Applications response:', response);
          const applicationsData = response.data.applications || [];
          setApplications(applicationsData); 
          
          // Debug: Log the application statuses
          console.log('Application statuses:', applicationsData.map(app => ({ 
            id: app.jobId, 
            status: app.status 
          })));
        } catch (error) {
          console.error('Error fetching applications:', error);
          console.error('Request URL was:', `http://localhost:5000/api/jobseekers/applications/${userId}`);
          setApplications([]);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No user ID found, cannot fetch applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, [authuser]);

  // Navigate to profile
  const goToProfile = () => {
    const userId = authuser?.seekerId || authuser?._id || authuser?.id;
    if (userId) {
      navigate(`/userprofile/${userId}`);
    } else {
      console.error('No user ID found for navigation');
    }
  };

  const goToNewPage = () => {
    navigate("/jobSeeker/profile");
  };

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    if (!authuser) return 0;
    
    let completedFields = 0;
    const totalFields = 8;
    
    if (authuser.name) completedFields++;
    if (authuser.email) completedFields++;
    if (authuser.phone) completedFields++;
    if (authuser.address) completedFields++;
    if (authuser.skills && authuser.skills.length > 0) completedFields++;
    if (authuser.experience) completedFields++;
    if (authuser.education) completedFields++;
    if (authuser.resume) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const recommendations = [
    // This can be populated with real job recommendations from your backend
    {
      id: 1,
      title: 'Looking for opportunities?',
      company: 'Start by completing your profile',
      location: 'All locations',
      salary: 'Various ranges',
      match: `${profileCompletion}%`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {authuser?.name || 'Job Seeker'}!
          </h1>
          <p className="text-gray-600 mt-1">
            {profileCompletion < 50 
              ? "Let's complete your profile to get started with better job matches."
              : profileCompletion < 80
              ? "You're making great progress! Complete your profile to unlock more opportunities."
              : "Your profile looks great! Here's what's happening with your job search today."
            }
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-gray-900">{loading ? '...' : applications.length}</div>
            <div className="text-sm text-gray-500">Total Applications</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-yellow-600">
              {loading ? '...' : applications.filter(app => app.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">Pending Applications</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-green-600">
              {loading ? '...' : applications.filter(app => app.status === 'accepted').length}
            </div>
            <div className="text-sm text-gray-500">Accepted Applications</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-red-600">
              {loading ? '...' : applications.filter(app => app.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-500">Rejected Applications</div>
          </div>
        </div>

        {/* Profile & Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{profileCompletion}%</div>
                <div className="text-sm text-gray-500">Profile Complete</div>
              </div>
              <div className="ml-4">
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="2"
                      strokeDasharray={`${profileCompletion}, 100`}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-gray-900">{JSON.parse(localStorage.getItem('savedJobs') || '[]').length}</div>
            <div className="text-sm text-gray-500">Saved Jobs</div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
                  <button 
                    onClick={() => navigate('/jobSeeker/applications')} 
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
                    <p className="text-gray-500 mt-2">Loading applications...</p>
                  </div>
                ) : applications.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.slice(0, 5).map((app, index) => (
                        <tr key={app._id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{app.jobDetails?.title || 'Job Title'}</div>
                            <div className="text-xs text-gray-500">{app.jobDetails?.location?.city || app.jobDetails?.city || 'Location not specified'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{app.jobDetails?.employer?.name || 'Company Name'}</div>
                            <div className="text-xs text-gray-500">{app.jobDetails?.type || 'Full-time'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              app.status === 'accepted' ? 'bg-green-500' :
                              app.status === 'rejected' ? 'bg-red-500' :
                              app.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                            } text-white`}>
                              {app.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            }) : 'Date not available'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-gray-500 mb-4">
                      Start applying to jobs to see your application status here.
                    </p>
                    <button
                      onClick={() => navigate('/jobSeeker/findjobs')}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Find Jobs
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Job Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Recommended For You</h2>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">View all</a>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recommendations.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
                        <div className="mt-1 text-xs text-gray-500">{job.company} • {job.location}</div>
                        <div className="mt-1 text-xs text-gray-500">{job.salary}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-green-600">{job.match} Complete</span>
                        <button 
                          onClick={() => navigate('/jobSeeker/findjobs')}
                          className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md hover:bg-indigo-200"
                        >
                          Explore Jobs
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {profileCompletion < 70 && (
                  <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Star className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Complete your profile to get personalized job recommendations based on your skills and preferences.
                        </p>
                        <div className="mt-2">
                          <button
                            onClick={goToProfile}
                            className="text-sm font-medium text-yellow-700 hover:text-yellow-600"
                          >
                            Update Profile →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Profile Completion Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Completion</h2>
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-20 h-20 mb-4">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={`${profileCompletion * 2.51} 251`}
                      className="text-indigo-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{profileCompletion}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {profileCompletion < 50 ? 'Complete your profile to increase visibility' :
                   profileCompletion < 80 ? 'Almost there! Add more details' :
                   'Great! Your profile looks complete'}
                </p>
              </div>
              
              {/* Profile completion checklist */}
              <div className="space-y-2">
                <div className={`flex items-center text-sm ${authuser?.name ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle size={16} className="mr-2" />
                  <span>Basic Information</span>
                </div>
                <div className={`flex items-center text-sm ${authuser?.resume ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle size={16} className="mr-2" />
                  <span>Resume Upload</span>
                </div>
                <div className={`flex items-center text-sm ${authuser?.skills?.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle size={16} className="mr-2" />
                  <span>Skills & Experience</span>
                </div>
                <div className={`flex items-center text-sm ${authuser?.education ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle size={16} className="mr-2" />
                  <span>Education Details</span>
                </div>
              </div>
              
              <button 
                onClick={goToProfile}
                className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Complete Profile
              </button>
            </div>



            {/* Career Tips */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Career Tips</h2>
              <div className="space-y-4">
                <div className="border border-gray-100 rounded-md p-4 bg-blue-50">
                  <div className="flex items-start">
                    <Star size={16} className="text-blue-600 mt-1 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Optimize Your Profile</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Complete profiles get 3x more views. Add skills, experience, and a professional photo.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-100 rounded-md p-4 bg-green-50">
                  <div className="flex items-start">
                    <FileText size={16} className="text-green-600 mt-1 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Tailor Your Applications</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Customize your applications to match job requirements for better success rates.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-100 rounded-md p-4 bg-purple-50">
                  <div className="flex items-start">
                    <Users size={16} className="text-purple-600 mt-1 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Network Actively</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Many jobs are filled through referrals. Connect with professionals in your field.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Search Insights */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Search Insights</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-700">Total applications</span>
                  </div>
                  <span className="text-sm font-medium">{applications.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye size={16} className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Profile views</span>
                  </div>
                  <span className="text-sm font-medium">
                    {profileCompletion > 80 ? 'High' : profileCompletion > 50 ? 'Medium' : 'Low'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target size={16} className="text-purple-500 mr-2" />
                    <span className="text-sm text-gray-700">Job matches</span>
                  </div>
                  <span className="text-sm font-medium">
                    {authuser?.skills?.length > 0 ? 'Active' : 'Add skills'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award size={16} className="text-orange-500 mr-2" />
                    <span className="text-sm text-gray-700">Profile strength</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    profileCompletion > 80 ? 'text-green-600' : 
                    profileCompletion > 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {profileCompletion > 80 ? 'Strong' : profileCompletion > 50 ? 'Good' : 'Needs work'}
                  </span>
                </div>
              </div>
              
              {profileCompletion < 80 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 Complete your profile to get better job matches and increase visibility to employers.
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

export default JobSeekerDashboard;