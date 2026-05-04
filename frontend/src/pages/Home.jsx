import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [currentTagline, setCurrentTagline] = useState(0);
  const navigate = useNavigate();

  // Array of rotating taglines
  const taglines = [
    "Find Your Perfect Part-Time Job",
    "Flexible Work, Flexible Life",
    "Turn Your Skills into Opportunities",
    "Work on Your Terms",
    "Earn More, Work Smarter"
  ];

  useEffect(() => {
    // Rotate taglines every 3 seconds
    const taglineTimer = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);

    return () => clearInterval(taglineTimer);
  }, []); 

  async function fetchRecommendations() {
    //these are the jobs that are being fetched from the backend
    const res=await axios.post('http://localhost:5000/',{
      title: searchTerm,
      city: location,
      salary: 0,
      job: 0
    })

    console.log(res.data);
    navigate('/findJobs', { state: { recommendations: res.data } });
    

  }

  const handleSearch = () => {
    console.log('Searching for:', searchTerm, 'in', location);
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <div className="flex-grow bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-2xl p-6">
          {/* Animated Tagline */}
          <AnimatePresence mode="wait">
            <motion.h1 
              key={currentTagline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-6 text-gray-800"
            >
              {taglines[currentTagline]}
            </motion.h1>
          </AnimatePresence>
          <p className="text-xl text-gray-600 mb-8">
            Connect with flexible opportunities that fit your schedule
          </p>

          {/* Search Container */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex space-x-4 mb-4">
              <div className="relative flex-grow">
                <input 
                  type="text"
                  placeholder="Job title or keywords"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Briefcase className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="relative flex-grow">
                <input 
                  type="text"
                  placeholder="City or region"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MapPin className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button 
                onClick={fetchRecommendations} 
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <Search className="mr-2" /> Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Features Section */}
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Choose PartTime Pal?</h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <Briefcase size={48} className="text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Diverse Opportunities</h3>
            <p className="text-gray-600">Explore jobs across multiple industries</p>
          </div>
          <div className="flex flex-col items-center">
            <Clock size={48} className="text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Flexible Schedules</h3>
            <p className="text-gray-600">Find jobs that work around your life</p>
          </div>
          <div className="flex flex-col items-center">
            <MapPin size={48} className="text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Local Connections</h3>
            <p className="text-gray-600">Discover opportunities near you</p>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default HomePage;