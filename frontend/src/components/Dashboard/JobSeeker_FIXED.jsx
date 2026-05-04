import React, { useState, useEffect } from 'react';
import { Bell, Bookmark, Calendar, ChevronDown, Clock, FileText, Home, Mail, MessageSquare, Search, Star, User, Timer, Briefcase, CheckCircle, TrendingUp, Eye, Send, MapPin, Building, DollarSign, Users, AlertCircle, Target, Activity, PieChart, BarChart3, Heart, UserCheck, Award, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthstore } from "../../store/useAuthstore";
import axios from 'axios';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { authuser, loadAuthuser } = useAuthstore();
  
  // Dashboard data states
  const [dashboardStats, setDashboardStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    thisMonthApplications: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load authuser on component mount
  useEffect(() => {
    if (!authuser && localStorage.getItem("authuser_jobseeker")) {
      loadAuthuser('jobseeker');
    }
  }, [authuser, loadAuthuser]);

  // Fetch dashboard data when authuser is available
  useEffect(() => {
    if (authuser?.seekerId) {
      fetchDashboardData();
    }
  }, [authuser]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
                            var language=localStorage.getItem("language");
                  //   const params = new URLSearchParams();
                  //   params.append("language", language);
                    console.log(language)
                      const response = await axios.get(`/jobseekers/applications/${authuser.seekerId}/${language}`);
      const { stats, recentApplications } = response.data;
      
      setDashboardStats(stats);
      setRecentApplications(recentApplications);
      
      // Calculate profile completion
      calculateProfileCompletion();
      
      // Load saved jobs and messages
      loadSavedJobs();
      loadRecentMessages();
      
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      
      // Use mock data if API fails
      setDashboardStats({
        totalApplications: 12,
        pendingApplications: 5,
        acceptedApplications: 2,
        rejectedApplications: 5,
        thisMonthApplications: 8
      });
      setRecentApplications([
        { 
          id: 1, 
          company: 'Tech Corp', 
          position: 'Software Developer', 
          status: 'pending',
          appliedDate: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    if (!authuser) return;
    
    let completion = 0;
    const fields = [
      authuser.name,
      authuser.email,
      authuser.skills,
      authuser.experience,
      authuser.education,
      authuser.resume
    ];
    
    fields.forEach(field => {
      if (field && field.length > 0) completion += 16.67;
    });
    
    setProfileCompletion(Math.round(completion));
  };

  const loadSavedJobs = () => {
    // Mock saved jobs - replace with actual API call
    setSavedJobs([
      {
        id: 1,
        title: 'Frontend Developer',
        company: 'StartupCo',
        location: 'Remote',
        salary: '$60k-80k',
        savedDate: new Date().toISOString()
      },
      {
        id: 2,
        title: 'UI/UX Designer',
        company: 'Design Studio',
        location: 'New York',
        salary: '$55k-70k',
        savedDate: new Date().toISOString()
      }
    ]);
  };

  const loadRecentMessages = () => {
    // Mock messages - replace with actual API call
    setRecentMessages([
      {
        id: 1,
        from: 'HR Manager - TechCorp',
        subject: 'Interview Invitation',
        time: '2 hours ago',
        unread: true
      },
      {
        id: 2,
        from: 'Recruiting Team',
        subject: 'Application Update',
        time: '1 day ago',
        unread: false
      }
    ]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      default: return 'Applied';
    }
  };

  // Navigate to profile
  const goToProfile = () => {
    if (authuser?.seekerId) {
      navigate(`/userprofile/${authuser.seekerId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardStats.totalApplications) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {authuser?.name || 'Job Seeker'}!
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your job search today.</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalApplications}</div>
                <div className="text-sm text-gray-500">Total Applications</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.pendingApplications}</div>
                <div className="text-sm text-gray-500">Pending Applications</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.acceptedApplications}</div>
                <div className="text-sm text-gray-500">Accepted</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp size={24} className="text-indigo-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-indigo-600">{dashboardStats.thisMonthApplications}</div>
                <div className="text-sm text-gray-500">This Month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Completion */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Profile Completion</h2>
                <button 
                  onClick={goToProfile}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Complete Profile
                </button>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Your profile is {profileCompletion}% complete</span>
                  <span className="text-gray-500">{profileCompletion}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Complete your profile to get better job recommendations and increase your visibility to employers.
              </p>
            </div>

            {/* Application Analytics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Application Analytics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round((dashboardStats.acceptedApplications / Math.max(dashboardStats.totalApplications, 1)) * 100)}%</div>
                  <div className="text-sm text-gray-500">Success Rate</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.round((dashboardStats.acceptedApplications / Math.max(dashboardStats.totalApplications, 1)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dashboardStats.thisMonthApplications}</div>
                  <div className="text-sm text-gray-500">This Month</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((dashboardStats.thisMonthApplications / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
                  <button 
                    onClick={() => navigate('/findJobs')}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View all
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentApplications.length > 0 ? (
                  recentApplications.slice(0, 5).map((app) => (
                    <div key={app.id} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{app.position}</h3>
                          <p className="text-sm text-gray-600 mt-1">{app.company}</p>
                          <p className="text-xs text-gray-500 mt-1">Applied {formatDate(app.appliedDate)}</p>
                        </div>
                        <div className="ml-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(app.status)}`}>
                            {getStatusText(app.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No applications yet</p>
                    <button 
                      onClick={() => navigate('/findJobs')}
                      className="mt-2 text-indigo-600 hover:text-indigo-500 text-sm"
                    >
                      Start applying to jobs
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Saved Jobs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Saved Jobs</h2>
                <Bookmark size={16} className="text-gray-400" />
              </div>
              <div className="space-y-3">
                {savedJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{job.company}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{job.location}</span>
                      <span className="text-xs font-medium text-green-600">{job.salary}</span>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => navigate('/findJobs')}
                  className="w-full text-sm text-indigo-600 hover:text-indigo-500 mt-3"
                >
                  View all saved jobs
                </button>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Recent Messages</h2>
                <MessageSquare size={16} className="text-gray-400" />
              </div>
              <div className="space-y-3">
                {recentMessages.slice(0, 3).map((message) => (
                  <div key={message.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{message.from}</h3>
                        <p className="text-xs text-gray-600 mt-1">{message.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                      </div>
                      {message.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
                <button className="w-full text-sm text-indigo-600 hover:text-indigo-500 mt-3">
                  View all messages
                </button>
              </div>
            </div>

            {/* Weekly Goals */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly Goals</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Submit 5 applications</span>
                  </div>
                  <span className="text-sm font-medium">{Math.min(dashboardStats.thisMonthApplications, 5)}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((dashboardStats.thisMonthApplications / 5) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <BookOpen size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-700">Skill Development</span>
                  </div>
                  <span className="text-sm font-medium">{profileCompletion >= 80 ? '✓' : 'In Progress'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${profileCompletion >= 80 ? 100 : profileCompletion}%` }}
                  ></div>
                </div>
                
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-800 font-medium">
                    {dashboardStats.thisMonthApplications >= 5 ? 'Goals Achieved!' : 'Keep Going!'}
                  </p>
                  <p className="text-xs text-indigo-600 mt-1">
                    {dashboardStats.thisMonthApplications >= 5 
                      ? 'You\'re crushing your weekly goals!'
                      : `${5 - dashboardStats.thisMonthApplications} more applications to reach your goal.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobSeekerDashboard;
