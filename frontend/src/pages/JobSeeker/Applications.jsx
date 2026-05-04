import  { useState, useEffect } from 'react';
import { ArrowLeft, Briefcase, Calendar, MapPin, Building, CheckCircle, Clock, XCircle, DollarSign, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthstore } from '../../store/useAuthstore';
import axios from 'axios';

const ApplicationsPage = () => {
  const navigate = useNavigate();
  const { authuser } = useAuthstore();
  const [applications, setApplications] = useState([]);
  const [dailyWageApplications, setDailyWageApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  console.log(authuser);
  
  // Fetch user applications
  useEffect(() => {
    const fetchApplications = async () => {
       
        try {
          setLoading(true);
          var language=localStorage.getItem("language");
          // const params = new URLSearchParams();
          // params.append("language", language);
          console.log(language)
          
          // Fetch regular job applications
          const response = await axios.get(`http://localhost:5000/api/jobseekers/applications/${authuser.seekerId}`);
          console.log('Applications response:', response.data);
          setApplications(response.data.applications || []);
          
          // Fetch daily wage applications
          const dailyWageResponse = await axios.get(`http://localhost:5000/api/jobseekers/dailywage-applications/${authuser.seekerId}`);
          console.log('Daily wage applications response:', dailyWageResponse.data);
          setDailyWageApplications(dailyWageResponse.data.applications || []);
          
        } catch (error) {
          console.error('Error fetching applications:', error);
          setApplications([]);
          setDailyWageApplications([]);
        } finally {
          setLoading(false);
        }
      
    };

    fetchApplications();
  }, [authuser?.seekerId]);

  // Filter applications based on status
  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const filteredDailyWageApplications = dailyWageApplications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  // Calculate total stats including both regular and daily wage applications
  const totalApplications = applications.length + dailyWageApplications.length;
  const totalPending = applications.filter(app => app.status === 'pending').length + 
                      dailyWageApplications.filter(app => app.status === 'pending').length;
  const totalAccepted = applications.filter(app => app.status === 'accepted').length + 
                       dailyWageApplications.filter(app => app.status === 'accepted').length;
  const totalRejected = applications.filter(app => app.status === 'rejected').length + 
                       dailyWageApplications.filter(app => app.status === 'rejected').length;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-600" />;
      case 'pending':
      default:
        return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
      default:
        return 'bg-yellow-500';
    }
  };

  const renderDailyWageJobCard = (app, index) => (
    <div key={app._id || index} className="border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-blue-50 relative">
      <div className="absolute top-4 right-4">
        <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
          Daily Wage
        </span>
      </div>
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-16">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {app.jobDetails?.title || 'Daily Wage Job'}
            </h3>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)} text-white`}>
              {app.status || 'Pending'}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <DollarSign size={16} className="mr-2 text-blue-600" />
              <span className="font-medium text-blue-600">₹{app.jobDetails?.wage || 'N/A'}/day</span>
            </div>
            
            <div className="flex items-center">
              <MapPin size={16} className="mr-2" />
              <span>{app.jobDetails?.location || 'Location not specified'}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Date not available'}</span>
            </div>

            {app.jobDetails?.startDate && app.jobDetails?.endDate && (
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>
                  Work Period: {new Date(app.jobDetails.startDate).toLocaleDateString()} - {new Date(app.jobDetails.endDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {app.jobDetails?.workingHours && (
              <div className="flex items-center">
                <Users size={16} className="mr-2" />
                <span>Working Hours: {app.jobDetails.workingHours} hours/day</span>
              </div>
            )}
          </div>
          
          {app.status === 'accepted' && (
            <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 font-medium text-sm">
                🎉 Congratulations! Your application has been accepted. The recruiter will contact you soon.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center ml-4">
          {getStatusIcon(app.status)}
        </div>
      </div>
    </div>
  );

  const renderRegularJobCard = (app, index) => (
    <div key={app._id || index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow relative">
      <div className="absolute top-4 right-4">
        <span className="px-2 py-1 bg-gray-600 text-white text-xs font-semibold rounded-full">
          Regular Job
        </span>
      </div>
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-16">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {app.jobDetails?.title || 'Job Title'}
            </h3>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)} text-white`}>
              {app.status || 'Pending'}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Building size={16} className="mr-2" />
              <span>{app.jobDetails?.employer?.name || 'Company Name'}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin size={16} className="mr-2" />
              <span>{app.jobDetails?.location?.city || app.jobDetails?.city || 'Location not specified'}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>Applied on {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Date not available'}</span>
            </div>
          </div>
          
          {app.jobDetails?.description && (
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
              {app.jobDetails.description}
            </p>
          )}

          {app.status === 'accepted' && (
            <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 font-medium text-sm">
                🎉 Congratulations! Your application has been accepted. The employer will contact you soon.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center ml-4">
          {getStatusIcon(app.status)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/jobSeeker/dashboard')}
              className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600 mt-2">Track the status of your job applications</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{totalApplications}</div>
            <div className="text-sm text-gray-500">Total Applications</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-yellow-600">{totalPending}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{totalAccepted}</div>
            <div className="text-sm text-gray-500">Accepted</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
            <div className="text-sm text-gray-500">Rejected</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6 py-4">
              {[
                { key: 'all', label: 'All Applications', count: totalApplications },
                { key: 'pending', label: 'Pending', count: totalPending },
                { key: 'accepted', label: 'Accepted', count: totalAccepted },
                { key: 'rejected', label: 'Rejected', count: totalRejected }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Applications List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading applications...</p>
              </div>
            ) : (filteredDailyWageApplications.length > 0 || filteredApplications.length > 0) ? (
              <div className="space-y-8">
                {/* Daily Wage Applications Section */}
                {filteredDailyWageApplications.length > 0 && (
                  <div>
                    <div className="flex items-center mb-4">
                      <DollarSign className="text-blue-600 mr-2" size={20} />
                      <h2 className="text-lg font-semibold text-gray-900">Daily Wage Jobs</h2>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {filteredDailyWageApplications.length}
                      </span>
                    </div>
                    <div className="space-y-4 mb-8">
                      {filteredDailyWageApplications.map((app, index) => renderDailyWageJobCard(app, index))}
                    </div>
                  </div>
                )}

                {/* Regular Applications Section */}
                {filteredApplications.length > 0 && (
                  <div>
                    <div className="flex items-center mb-4">
                      <Briefcase className="text-gray-600 mr-2" size={20} />
                      <h2 className="text-lg font-semibold text-gray-900">Regular Jobs</h2>
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                        {filteredApplications.length}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {filteredApplications.map((app, index) => renderRegularJobCard(app, index))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'all' ? 'No Applications Yet' : `No ${filter} Applications`}
                </h3>
                <p className="text-gray-500 mb-4">
                  {filter === 'all' 
                    ? 'Start applying to jobs to see your applications here.'
                    : `You don't have any ${filter} applications yet.`
                  }
                </p>
                {filter === 'all' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/jobSeeker/findjobs')}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors mr-4"
                    >
                      Find Regular Jobs
                    </button>
                    <button
                      onClick={() => navigate('/dailywages')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Find Daily Wage Jobs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationsPage;