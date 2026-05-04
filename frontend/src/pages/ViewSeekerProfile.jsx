import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, Clock, Download, ArrowLeft, Star, Calendar } from 'lucide-react';
import axios from 'axios';

const ViewSeekerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seekerProfile, setSeekerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeekerProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/jobseekers/profile/${id}`);
        
        if (response.data.success) {
          setSeekerProfile(response.data.user);
        } else {
          throw new Error(response.data.message || 'Failed to fetch seeker profile');
        }
      } catch (err) {
        console.error('Error fetching seeker profile:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch seeker profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSeekerProfile();
    }
  }, [id]);

  const handleDownloadResume = () => {
    if (seekerProfile?.resume) {
      window.open(seekerProfile.resume, '_blank');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seeker profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!seekerProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">The seeker profile you're looking for doesn't exist.</p>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Applications
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User size={32} className="text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {seekerProfile.name || 'Job Seeker'}
                  </h1>
                  <p className="text-gray-600">{seekerProfile.email}</p>
                  <div className="flex items-center mt-2 space-x-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      seekerProfile.isEmployed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {seekerProfile.isEmployed ? 'Currently Employed' : 'Job Seeking'}
                    </span>
                    {seekerProfile.createdAt && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        Member since {new Date(seekerProfile.createdAt).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Profile Views</p>
                  <p className="text-lg font-semibold text-gray-900">Read-Only</p>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
              <div className="flex items-center space-x-4">
                {seekerProfile.resume ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-green-600">
                      <Star size={16} className="mr-2" />
                      Resume available
                    </div>
                    <button
                      onClick={handleDownloadResume}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                    >
                      <Download size={16} className="mr-2" />
                      Download Resume
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded">
                    No resume uploaded
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="flex items-center text-gray-900">
                    <User size={16} className="mr-2 text-gray-400" />
                    {seekerProfile.name || 'Not specified'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center text-gray-900">
                    <Mail size={16} className="mr-2 text-gray-400" />
                    {seekerProfile.email || 'Not specified'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="flex items-center text-gray-900">
                    <Phone size={16} className="mr-2 text-gray-400" />
                    {seekerProfile.phone || 'Not specified'}
                  </div>
                </div>

                {seekerProfile.bio && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <div className="text-gray-900 text-sm bg-gray-50 p-3 rounded">
                      {seekerProfile.bio}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location & Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="flex items-center text-gray-900">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    {seekerProfile.location?.city && seekerProfile.location?.area 
                      ? `${seekerProfile.location.city}, ${seekerProfile.location.area}`
                      : seekerProfile.location?.city || seekerProfile.location?.area || 'Not specified'
                    }
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Job Types</label>
                  <div className="flex flex-wrap gap-2">
                    {seekerProfile.preferredJobTypes?.length > 0 ? (
                      seekerProfile.preferredJobTypes.map((type, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {type}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">Not specified</span>
                    )}
                  </div>
                </div>

                {seekerProfile.expectedSalary && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary</label>
                    <div className="text-gray-900 font-medium">
                      {seekerProfile.expectedSalary}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Experience</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {seekerProfile.skills?.length > 0 ? (
                      seekerProfile.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">Not specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <div className="flex items-start text-gray-900">
                    <Briefcase size={16} className="mr-2 text-gray-400 mt-1" />
                    <span>{seekerProfile.experience || 'Not specified'}</span>
                  </div>
                </div>

                {seekerProfile.education && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                    <div className="text-gray-900">
                      {seekerProfile.education}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              <div className="space-y-4">
                {(seekerProfile.availability?.start || seekerProfile.availability?.end) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <div className="flex items-center text-gray-900">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        {seekerProfile.availability?.start || 'Not specified'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <div className="flex items-center text-gray-900">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        {seekerProfile.availability?.end || 'Not specified'}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {seekerProfile.availability?.days?.length > 0 ? (
                      seekerProfile.availability.days.map((day, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {day}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">Not specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleGoBack}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Applications
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => {
                // You can implement messaging functionality here
                alert('Messaging feature coming soon!');
              }}
            >
              Send Message
            </button>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              onClick={() => {
                // You can implement interview scheduling here
                alert('Interview scheduling feature coming soon!');
              }}
            >
              Schedule Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSeekerProfile;
