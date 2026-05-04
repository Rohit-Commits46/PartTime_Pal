import React, { useState, useEffect } from 'react';
import { useAuthstore } from '../../store/useAuthstore';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, 
  X, 
  User, 
  Briefcase, 
  Clock, 
  MapPin,
  Eye,
  Calendar
} from 'lucide-react';

const DailyWageJobForm = () => {
  const { authuser } = useAuthstore();
  const [recentApplications, setRecentApplications] = useState([]);
  const [processing, setProcessing] = useState({});
  const [loadingApplications, setLoadingApplications] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    startDate: '',
    endDate: '',
    wage: '',
    workingHours: '',
    location: '',
    positions: 1,
    skills: '',
  });

  useEffect(() => {
    fetchRecentApplications();
  }, [authuser]);

  const fetchRecentApplications = async () => {
    if (!authuser?.recid) return;
    
    setLoadingApplications(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/rec/dailywage-applications/${authuser.recid}`);
      if (response.data && Array.isArray(response.data.applications)) {
        // Get only the 5 most recent applications
        const recent = response.data.applications.slice(0, 5);
        setRecentApplications(recent);
      }
    } catch (error) {
      console.error('Error fetching recent applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleApplicationAction = async (applicationId, action) => {
    setProcessing(prev => ({ ...prev, [applicationId]: true }));
    
    try {
      const response = await axios.put(`http://localhost:5000/api/rec/dailywage-application/${applicationId}`, {
        status: action,
        recruiterId: authuser.recid
      });

      if (response.data.success) {
        // Update the application status locally
        setRecentApplications(prev => 
          prev.map(app => 
            app._id === applicationId 
              ? { ...app, status: action }
              : app
          )
        );
        
        alert(`Application ${action} successfully!`);
      } else {
        alert(response.data.message || `Failed to ${action} application`);
      }
    } catch (err) {
      console.error(`Error ${action} application:`, err);
      alert(`Failed to ${action} application. Please try again.`);
    } finally {
      setProcessing(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diff = (end - start) / (1000 * 60 * 60 * 24);

    if (diff > 6 || diff < 0) {
      alert('Job duration must be between 1 and 7 days.');
      return;
    }

    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(skill => skill.trim()),
      };
      console.log(authuser)
      console.log(payload);
      const response = await axios.post(`http://localhost:5000/api/rec/dailywages/${authuser.recid}`, payload);
      console.log(response);
      if (response.data.success) {
        alert('Job posted successfully!');
        console.log(response.data);
        // Refresh applications after posting new job
        fetchRecentApplications();
      } else {
        alert(response.data.message || 'Failed to post job.');
      }

      setForm({
        title: '',
        category: '',
        description: '',
        startDate: '',
        endDate: '',
        wage: '',
        workingHours: '',
        location: '',
        positions: 1,
        skills: '',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to post job.');
    }
  };

  return (
    <div className="p-6 max-w-full mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-medium mb-6 text-center text-gray-800">Daily Wage Jobs Dashboard</h2>
      
      {/* Two Sections Side by Side */}
      <div className="flex gap-6">
        
        {/* Section 1: Job Posting Form - LEFT SIDE (60% width) */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-8" style={{width: '60%'}}>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full mb-6"></div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Post Daily Wage Job</h3>
            <p className="text-gray-600">Create a new daily wage job posting</p>
          </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.title}
              onChange={handleChange}
              required
            />

            <select
              name="category"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Delivery">Delivery</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Tutoring">Tutoring</option>
              <option value="Helper">Helper</option>
              <option value="Construction">Construction</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Security">Security</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <textarea
            name="description"
            placeholder="Job Description"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.description}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Wage (₹)</label>
              <input
                type="number"
                name="wage"
                min="1"
                placeholder="500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.wage}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
              <input
                type="text"
                name="workingHours"
                placeholder="8 hours"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.workingHours}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Positions</label>
              <input
                type="number"
                name="positions"
                min="1"
                placeholder="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.positions}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <input
            type="text"
            name="location"
            placeholder="Job Location"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.location}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="skills"
            placeholder="Required Skills (comma separated)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.skills}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Post Job
          </button>
        </form>
      </div>

      {/* Section 2: Recent Applications - RIGHT SIDE (40% width) */}
      <div className="bg-white rounded-2xl shadow-xl p-6" style={{width: '40%'}}>
        <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full mb-6"></div>
        <div className="mb-4">
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-1">Recent Applications</h4>
            <p className="text-gray-600 text-sm">Latest applications</p>
          </div>
        </div>

        {loadingApplications ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2 text-sm">Loading...</p>
          </div>
        ) : recentApplications.length === 0 ? (
          <div className="text-center py-6">
            <Briefcase size={32} className="mx-auto text-gray-300 mb-3" />
            <h5 className="text-sm font-medium text-gray-900 mb-2">No Applications</h5>
            <p className="text-gray-500 text-xs">Applications will appear here</p>
          </div>
        ) : (
          <div className="max-h-screen overflow-y-auto space-y-3">
            {recentApplications.map((application) => (
              <div key={application._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <User size={12} className="text-gray-500" />
                        <span className="font-medium text-gray-900 text-sm">
                          {application.seekerDetails?.name || 'Unknown'}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Briefcase size={10} />
                        <span className="truncate">{application.jobDetails?.title || 'Job Title'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={10} />
                        <span className="truncate">{application.jobDetails?.location || 'Location'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={10} />
                        <span>{formatDate(application.appliedAt)}</span>
                      </div>
                    </div>

                    {application.seekerDetails?.email && (
                      <div className="text-xs text-gray-600 truncate">
                        {application.seekerDetails.email}
                      </div>
                    )}
                  </div>

                  {/* Quick Accept/Reject Buttons */}
                  {application.status === 'pending' && (
                    <div className="flex flex-col gap-1 ml-2">
                      <button
                        onClick={() => handleApplicationAction(application._id, 'accepted')}
                        disabled={processing[application._id]}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center disabled:opacity-50"
                      >
                        {processing[application._id] ? (
                          <div className="animate-spin rounded-full h-2 w-2 border-b-1 border-white mr-1"></div>
                        ) : (
                          <CheckCircle size={10} className="mr-1" />
                        )}
                        Accept
                      </button>
                      
                      <button
                        onClick={() => handleApplicationAction(application._id, 'rejected')}
                        disabled={processing[application._id]}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center disabled:opacity-50"
                      >
                        {processing[application._id] ? (
                          <div className="animate-spin rounded-full h-2 w-2 border-b-1 border-white mr-1"></div>
                        ) : (
                          <X size={10} className="mr-1" />
                        )}
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      </div> {/* End of flex container */}
    </div>
  );
};

export default DailyWageJobForm;
