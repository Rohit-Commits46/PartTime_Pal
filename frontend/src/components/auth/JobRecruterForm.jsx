import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Building, Globe, Save, Users, FileText } from 'lucide-react';

const JobRecruterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    companyWebsite: '',
    location: '',
    industry: '',
    companySize: '',
    bio: '',
    hiringPositions: ['', '', ''],
    profileImage: '/api/placeholder/200/200',
    companyLogo: '/api/placeholder/200/200'
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePositionChange = (index, value) => {
    const updatedPositions = [...formData.hiringPositions];
    updatedPositions[index] = value;
    setFormData(prev => ({
      ...prev,
      hiringPositions: updatedPositions
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      // In a real app, you would send the data to your backend here
      console.log('Submitted recruiter data:', formData);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Recruiter Profile</h1>
        
        {submitted ? (
          <div className="text-center py-6">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
              Your recruiter profile has been created successfully!
            </div>
            <button 
              onClick={() => setSubmitted(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap -mx-2">
              {/* Profile Images */}
              <div className="w-full md:w-1/4 px-2 flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <img 
                    src={formData.profileImage} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                    <User size={16} />
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src={formData.companyLogo} 
                    alt="Company Logo" 
                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-300"
                  />
                  <div className="absolute bottom-0 right-0 bg-gray-600 text-white p-1 rounded-full cursor-pointer">
                    <Building size={12} />
                  </div>
                  <span className="block text-xs text-gray-500 mt-1 text-center">Company Logo</span>
                </div>
              </div>
              
              {/* Form Fields in Horizontal Layout */}
              <div className="w-full md:w-3/4 px-2">
                <div className="flex flex-wrap -mx-2">
                  {/* Personal Information */}
                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg h-full">
                      <h2 className="text-lg font-semibold mb-3 text-gray-800">Personal Information</h2>
                      
                      <div className="space-y-3">
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <div className="flex items-center">
                            <Mail className="text-gray-400 absolute ml-3" size={18} />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="your.email@company.com"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <div className="flex items-center">
                            <Phone className="text-gray-400 absolute ml-3" size={18} />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </div>
                        
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <div className="flex items-center">
                            <MapPin className="text-gray-400 absolute ml-3" size={18} />
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="City, State"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Company Information */}
                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg h-full">
                      <h2 className="text-lg font-semibold mb-3 text-gray-800">Company Information</h2>
                      <div className="space-y-3">
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                          <div className="flex items-center">
                            <Building className="text-gray-400 absolute ml-3" size={18} />
                            <input
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Company Name"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                          <div className="flex items-center">
                            <Globe className="text-gray-400 absolute ml-3" size={18} />
                            <input
                              type="url"
                              name="companyWebsite"
                              value={formData.companyWebsite}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="https://company.com"
                            />
                          </div>
                        </div>
                        
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                          <div className="flex items-center">
                            <Briefcase className="text-gray-400 absolute ml-3" size={18} />
                            <input
                              type="text"
                              name="industry"
                              value={formData.industry}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g. Technology, Finance, Healthcare"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                          <div className="flex items-center">
                            <Users className="text-gray-400 absolute ml-3" size={18} />
                            <select
                              name="companySize"
                              value={formData.companySize}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="">Select company size</option>
                              <option value="1-10">1-10 employees</option>
                              <option value="11-50">11-50 employees</option>
                              <option value="51-200">51-200 employees</option>
                              <option value="201-500">201-500 employees</option>
                              <option value="501-1000">501-1000 employees</option>
                              <option value="1000+">1000+ employees</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hiring Information - Full Width */}
                <div className="w-full px-2 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">Hiring Information</h2>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Open Positions (up to 3)</label>
                      <div className="space-y-2">
                        {[0, 1, 2].map((index) => (
                          <div key={index} className="flex items-center">
                            <FileText className="text-gray-400 mr-2" size={18} />
                            <input
                              type="text"
                              value={formData.hiringPositions[index]}
                              onChange={(e) => handlePositionChange(index, e.target.value)}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={`Position ${index + 1} (e.g. Senior Developer, Marketing Manager)`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Tell job seekers about your company culture, what you look for in candidates, and your recruitment process..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-center mt-4">
              <button 
                type="submit" 
                className="flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" /> Create Recruiter Profile
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default JobRecruterForm;