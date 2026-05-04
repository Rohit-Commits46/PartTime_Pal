import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Clock, Upload, Download, Edit, Save, X, CheckCircle } from 'lucide-react';
import { useAuthstore } from '../../store/useAuthstore';
import axios from 'axios';

const UserProfile = () => {
  const { authuser, setAuthuser } = useAuthstore();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Initialize edited profile with current user data
  useEffect(() => {
    if (authuser) {
      setEditedProfile({
        name: authuser.name || '',
        email: authuser.email || '',
        phone: authuser.phone || '',
        location: {
          city: authuser.location?.city || '',
          area: authuser.location?.area || ''
        },
        preferredJobTypes: authuser.preferredJobTypes || [],
        skills: authuser.skills || [],
        experience: authuser.experience || '',
        availability: {
          start: authuser.availability?.start || '',
          end: authuser.availability?.end || '',
          days: authuser.availability?.days || []
        },
        isEmployed: authuser.isEmployed || false
      });
    }
  }, [authuser]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditedProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditedProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setEditedProfile(prev => ({
      ...prev,
      [field]: arrayValue
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/jobseekers/profile/${authuser.seekerId}`, editedProfile);
      
      if (response.status === 200) {
        const updatedUser = { ...authuser, ...editedProfile };
        setAuthuser(updatedUser, 'jobseeker');
        setIsEditing(false);
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => setProfileSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size should be less than 5MB.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/jobseekers/upload-resume/${authuser.seekerId}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        const updatedUser = { ...authuser, resume: response.data.resumeUrl };
        setAuthuser(updatedUser, 'jobseeker');
        setProfileSuccess('Resume uploaded successfully!');
        setTimeout(() => setProfileSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadResume = () => {
    if (authuser.resume) {
      window.open(authuser.resume, '_blank');
    }
  };

  if (!authuser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {profileSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
            <CheckCircle size={20} className="mr-2" />
            {profileSuccess}
          </div>
        )}

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
                    {authuser.name || 'Job Seeker'}
                  </h1>
                  <p className="text-gray-600">{authuser.email}</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      authuser.isEmployed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {authuser.isEmployed ? 'Employed' : 'Job Seeking'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center px-4 py-2 rounded-md font-medium ${
                  isEditing 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isEditing ? (
                  <>
                    <X size={16} className="mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {/* Resume Section */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
              <div className="flex items-center space-x-4">
                {authuser.resume ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      Resume uploaded
                    </div>
                    <button
                      onClick={handleDownloadResume}
                      className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
                    >
                      <Download size={16} className="mr-2" />
                      View Resume
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No resume uploaded</div>
                )}
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <button
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isUploading 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    }`}
                    disabled={isUploading}
                  >
                    <Upload size={16} className="mr-2" />
                    {isUploading ? 'Uploading...' : authuser.resume ? 'Update Resume' : 'Upload Resume'}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Only PDF files up to 5MB are allowed
              </p>
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
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <User size={16} className="mr-2 text-gray-400" />
                      {authuser.name || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Mail size={16} className="mr-2 text-gray-400" />
                      {authuser.email || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Phone size={16} className="mr-2 text-gray-400" />
                      {authuser.phone || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location & Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.location.city}
                      onChange={(e) => handleInputChange('location.city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      {authuser.location?.city || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.location.area}
                      onChange={(e) => handleInputChange('location.area', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <div className="text-gray-900">
                      {authuser.location?.area || 'Not specified'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Types</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.preferredJobTypes.join(', ')}
                      onChange={(e) => handleArrayChange('preferredJobTypes', e.target.value)}
                      placeholder="e.g., Full-time, Part-time, Remote"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {authuser.preferredJobTypes?.length > 0 ? (
                        authuser.preferredJobTypes.map((type, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                  )}
                </div>
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
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.skills.join(', ')}
                      onChange={(e) => handleArrayChange('skills', e.target.value)}
                      placeholder="e.g., JavaScript, React, Node.js"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {authuser.skills?.length > 0 ? (
                        authuser.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe your work experience..."
                    />
                  ) : (
                    <div className="flex items-start text-gray-900">
                      <Briefcase size={16} className="mr-2 text-gray-400 mt-1" />
                      <span>{authuser.experience || 'Not specified'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    {isEditing ? (
                      <input
                        type="time"
                        value={editedProfile.availability.start}
                        onChange={(e) => handleInputChange('availability.start', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        {authuser.availability?.start || 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    {isEditing ? (
                      <input
                        type="time"
                        value={editedProfile.availability.end}
                        onChange={(e) => handleInputChange('availability.end', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        {authuser.availability?.end || 'Not specified'}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Days</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.availability.days.join(', ')}
                      onChange={(e) => handleArrayChange('availability.days', e.target.value)}
                      placeholder="e.g., Monday, Tuesday, Wednesday"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {authuser.availability?.days?.length > 0 ? (
                        authuser.availability.days.map((day, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {day}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isEmployed"
                      checked={editedProfile.isEmployed}
                      onChange={(e) => handleInputChange('isEmployed', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isEmployed" className="ml-2 block text-sm text-gray-700">
                      Currently employed
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveProfile}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
