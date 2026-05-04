import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Edit, User, Mail, Phone, MapPin, Briefcase, Clock } from 'lucide-react';
import { useAuthstore } from '../../store/useAuthstore';
import axios from 'axios';

const UserProfile = () => {
  const { authuser, loadAuthuser } = useAuthstore();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    jobPreferences: {
      industries: ['Design', 'Tech', 'Marketing'],
      schedule: 'Flexible afternoons and weekends',
      hourlyRate: '$25-35'
    },
    bio: 'Product designer with 5+ years of experience in creating user-centered digital experiences. Passionate about flexible work and innovative solutions.',
    profileImage: '/api/placeholder/200/200'
  });

  const { id } = useParams();
  
  // Load authuser on component mount if not already loaded
  useEffect(() => {
    if (!authuser && localStorage.getItem("authuser_jobseeker")) {
      loadAuthuser('jobseeker');
    }
  }, [authuser, loadAuthuser]);

  async function fetchUserData() {
    try {
     
    const user1=await axios.get(`http://localhost:5000/api/jobseekers/profile/${id}`); 
    console.log(user1.data);
    // setUser(user1.data);  
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUserData() {
    try {
      const response = await axios.post(`http://localhost:5000/api/jobseekers/profile/${id}`, user);
      console.log('User data updated:', response.data);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }
  useEffect(() => {
    if (isEditing) {
      updateUserData(); // Update user data when editing is saved
    }
  }, [isEditing, user]); // Add user to the dependency array


  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };
  
  useEffect(() => {
    fetchUserData(); // Fetch user data when the component mounts
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl bg-white shadow-lg rounded-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <button 
            onClick={handleEditToggle}
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
          >
            <Edit className="mr-2" /> {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Image and Basic Info */}
          <div className="md:col-span-1 flex flex-col items-center">
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 mb-4"
            />
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                className="text-xl font-semibold text-center w-full border-b-2 border-blue-500 focus:outline-none"
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            )}
            <p className="text-gray-600 mt-2">{user.jobPreferences.hourlyRate}/hr</p>
          </div>

          {/* Contact and Personal Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="text-blue-500 mr-4" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      className="flex-grow border-b-2 border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Phone className="text-green-500 mr-4" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={user.phone}
                      onChange={handleInputChange}
                      className="flex-grow border-b-2 border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <span>{user.phone}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <MapPin className="text-purple-500 mr-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={user.location}
                      onChange={handleInputChange}
                      className="flex-grow border-b-2 border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <span>{user.location}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Job Preferences</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Briefcase className="text-blue-500 mr-2" />
                    <strong>Industries:</strong>
                  </div>
                  <ul className="list-disc pl-6 text-gray-700">
                    {user.jobPreferences.industries.map((industry, index) => (
                      <li key={index}>{industry}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Clock className="text-green-500 mr-2" />
                    <strong>Schedule:</strong>
                  </div>
                  <p className="text-gray-700">{user.jobPreferences.schedule}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">About Me</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleInputChange}
                  className="w-full border-2 border-blue-500 rounded p-2 focus:outline-none"
                  rows="4"
                />
              ) : (
                <p className="text-gray-700">{user.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;