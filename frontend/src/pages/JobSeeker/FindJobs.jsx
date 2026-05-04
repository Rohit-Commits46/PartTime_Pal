import React, { useState, useEffect } from 'react';
import { Search, MapPin, Bookmark, ChevronDown, ChevronLeft, ChevronRight, Briefcase, Clock, DollarSign, Calendar, Tag, Filter, Building, Zap, FileText, CheckCircle } from 'lucide-react';
import { useAuthstore } from '../../store/useAuthstore';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
// import { Query } from 'mongoose';

const FindJobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [id, setId] = useState('');
  const [jobType, setJobType] = useState('All Types');
  const [datePosted, setDatePosted] = useState('Any Time');
  const [salaryRange, setSalaryRange] = useState('Any Salary');
  const [category, setCategory] = useState('All Categories');
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [jobsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [textosend, setTextosend] = useState('');
  const [isAiSearchLoading, setIsAiSearchLoading] = useState(false);

  // Language selection variable
  const { language } = useLanguage();
  const [selang, setSelang] = useState(language);
  
  const loc = useLocation();

  const jobTypes = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Freelance'];
  const dateFilters = ['Any Time', 'Past 24 hours', 'Past Week', 'Past Month', 'Past 3 Months'];
  const salaryRanges = ['Any Salary', '$0-$20k', '$20k-$40k', '$40k-$60k', '$60k-$80k', '$80k+'];
  const categories = ['All Categories', 'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Hospitality', 'Marketing', 'Sales', 'Customer Service', 'Administrative'];
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date Posted' },
    { value: 'salary', label: 'Salary' },
    { value: 'title', label: 'Job Title' }
  ];

  const { authuser, setAuthuser, loadAuthuser } = useAuthstore();
  
  // Helper function to handle translation objects
  const getTranslatedText = (text) => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    if (typeof text === 'object' && text[selang]) return text[selang];
    if (typeof text === 'object' && text.en) return text.en;
    return text;
  };
  
  // Load authuser on component mount if not already loaded
  useEffect(() => {
    if (!authuser && localStorage.getItem("authuser_jobseeker")) {
      loadAuthuser('jobseeker');
    }
  }, [authuser, loadAuthuser]);
  
  useEffect(() => {
    if (loc.state?.recommendations) {
      setJobs(loc.state.recommendations);
    }
  }, [loc]);

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  // Update selang when global language changes
  useEffect(() => {
    setSelang(selang);
    setJobs(jobs);
    fetchRecommendations(1);
  }, [selang]);

  // Save job functionality
  const toggleSaveJob = (job) => {
    const isAlreadySaved = savedJobs.some(savedJob => savedJob.jobId === job.jobId);
    let updatedSavedJobs;
    
    if (isAlreadySaved) {
      updatedSavedJobs = savedJobs.filter(savedJob => savedJob.jobId !== job.jobId);
    } else {
      updatedSavedJobs = [...savedJobs, job];
    }
    
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(savedJob => savedJob.jobId === jobId);
  };

  async function handleApply() {
    const jobid = selectedJob.jobId;
    const providerId = selectedJob.recid;
    const seekerId = authuser.seekerId;
    const status = 'pending';

    try {
      const res = await axios.post('http://localhost:5000/api/jobseekers/apply', {
        jobid,
        providerId,
        seekerId,
        status
      });
      
      if (res.status === 200) {
        alert('Application submitted!');
        
        // Update the authuser with new applied job
        const updatedUser = {
          ...authuser,
          appliedJobs: [...(authuser.appliedJobs || []), String(jobid)]
        };
        
        // Update both localStorage and store
        localStorage.setItem("authuser_jobseeker", JSON.stringify(updatedUser));
        setAuthuser(updatedUser, 'jobseeker');
        
        // Update the jobs list to reflect applied status
        const updatedJobs = jobs.map(job =>
          job.jobId === selectedJob.jobId ? { ...job, applied: true } : job
        );
        
        setJobs(updatedJobs);
        setSelectedJob(prev => ({ ...prev, applied: true }));
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Error applying for job.');
    }
  }

  async function fetchRecommendations(page = 1) {
    try {
      console.log('Fetching jobs with search criteria:', { searchTerm, location, page });
      
      if (searchTerm || location) {
        // Use ML recommendation service for intelligent search
        console.log('Using ML search with:', { title: searchTerm, city: location });
        try {
          const res = await axios.post('http://localhost:5000/', {
            title: searchTerm || "job",
            city: location || "Mumbai",
            salary: 0,
            job: "0",
            lang: selang
          });
     
          console.log('ML search response:', res.data.jobs);
          
          // Check if ML service returned valid data
          if (res.data.jobs && Array.isArray(res.data.jobs) && res.data.jobs.length > 0) {
            setJobs(res.data.jobs);
            setTotalPages(Math.ceil(res.data.jobs.length / jobsPerPage));
            setCurrentPage(1); // Reset to first page for search results
            return;
          } else if (res.data && res.data.message) {
            console.log('ML service message:', res.data.message);
          }
        } catch (mlError) {
          console.warn('ML service not available, falling back to regular search:', mlError.message);
        }
        
        // Fallback to regular search if ML service fails
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (location) params.append('location', location);
        params.append('page', page.toString());
        params.append('limit', jobsPerPage.toString());
        
        const res = await axios.get(`http://localhost:5000/api/jobs/all?${params.toString()}`);
        setJobs(res.data.jobs || []);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(parseInt(res.data.currentPage) || page);
      } else {
        // Fetch ALL jobs from database with proper server-side pagination
        console.log(`Fetching all jobs from database - page ${page}...`);
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', jobsPerPage.toString());
        params.append('language', selang);
        
        const res = await axios.get(`http://localhost:5000/api/jobs/all?${params.toString()}`);
        console.log('All jobs response:', res.data);
        
        const allJobs = res.data.jobs || [];
        const totalPages = res.data.totalPages || 1;
        const currentPage = parseInt(res.data.currentPage) || page;
        
        console.log(`Fetched ${allJobs.length} jobs for page ${currentPage} of ${totalPages}`);
        
        setJobs(allJobs);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Fallback: try to get all jobs
      try {
        console.log('Trying fallback to get all jobs...');
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', jobsPerPage.toString());
        params.append('language', selang);
        const res = await axios.get(`http://localhost:5000/api/jobs/all?${params.toString()}`);
        console.log('Fallback response:', res.data);
        setJobs(res.data.jobs || []);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(1);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        alert('Failed to fetch jobs. Please try again later.');
      }
    }
  }

  // Advanced search with filters
  async function searchWithFilters(page = 1) {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (location) params.append('location', location);
      if (jobType && jobType !== 'All Types') params.append('type', jobType);
      if (category && category !== 'All Categories') params.append('category', category);
      params.append('page', page.toString());
      params.append('limit', jobsPerPage.toString());
      
      const res = await axios.get(`http://localhost:5000/api/jobs/all?${params.toString()}`);
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(parseInt(res.data.currentPage) || page);
    } catch (error) {
      console.error('Error searching jobs:', error);
      alert('Failed to search jobs. Please try again later.');
    }
  }

  // Handle page change for server-side pagination
  const handlePageChange = (newPage) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) return;
    
    // Determine if we have active filters/search
    const hasActiveFilters = searchTerm || location || 
      (jobType && jobType !== 'All Types') || 
      (category && category !== 'All Categories');
    
    if (hasActiveFilters) {
      searchWithFilters(newPage);
    } else {
      fetchRecommendations(newPage);
    }
  };

  const getjobbytext = async (page = 1) => {
    try {
      console.log('Getting jobs by text with:', { textosend, language: selang });
      
      // Set loading state to true
      setIsAiSearchLoading(true);
      
      const res = await axios.post(`http://localhost:5000/api/jobseekers/recommendation_by_text`, {
        textosend,
        language: selang,
        limit: jobsPerPage.toString(),
        page: page.toString()
      });
      
      console.log('Job recommendations by text response:', res.data);
      
      // Handle the response based on the API structure
      if (res.data && res.data.jobs && Array.isArray(res.data.jobs)) {
        setJobs(res.data.jobs);
        setTotalPages(res.data.totalPages || Math.ceil(res.data.jobs.length / jobsPerPage));
        setCurrentPage(parseInt(res.data.currentPage) || page);
        
        // Show success message
        console.log(`Found ${res.data.jobs.length} AI-recommended jobs based on your description`);
      } else if (res.data && res.data.message) {
        console.log('AI recommendation message:', res.data.message);
        alert('AI Response: ' + res.data.message);
      } else {
        console.log('No jobs found for your description');
        setJobs([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error getting AI job recommendations:', error);
      alert('Failed to get AI recommendations. Please try again or use regular search.');
    } finally {
      // Set loading state to false regardless of success or failure
      setIsAiSearchLoading(false);
    }
  };

  // Load jobs on component mount
  useEffect(() => {
    fetchRecommendations(1);

  }, []);

  // Filter and sort jobs
  const filteredJobs = jobs.filter(job => {
    if (jobType !== 'All Types' && getTranslatedText(job.type) !== jobType) return false;
    if (category !== 'All Categories' && getTranslatedText(job.category) !== category) return false;
    // Add more filtering logic as needed
    return true;
  });

  // For server-side pagination, we display jobs directly without client-side slicing
  const currentJobs = filteredJobs;

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    if (typeof salary === 'object' && salary.amount) {
      const amount = parseInt(salary.amount) || 0;
      const currency = salary.currency || 'USD';
      const frequency = salary.frequency || 'monthly';
      return `${currency} ${amount.toLocaleString()}/${frequency}`;
    }
    if (typeof salary === 'string' || typeof salary === 'number') {
      return `₹ ${parseInt(salary).toLocaleString()}/month`;
    }
    return 'Salary not specified';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isApplied = selectedJob && authuser?.appliedJobs?.includes(String(selectedJob.jobId));

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Job</h1>
              <p className="text-gray-600 mt-2">Discover opportunities that match your skills and preferences</p>
            </div>
            {authuser && (
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Welcome back, <span className="font-medium">{authuser.name || 'Job Seeker'}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    authuser.isEmployed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {authuser.isEmployed ? 'Employed' : 'Job Seeking'}
                  </span>
                  {authuser.resume && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      <CheckCircle size={12} className="mr-1" />
                      Resume Ready
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Search fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      placeholder="Job title, keywords, or company" 
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Where</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)} 
                      placeholder="City, state, or remote" 
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={()=>fetchRecommendations(1)} 
                  className="bg-indigo-600 text-white px-8 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <Search size={16} className="mr-2 inline" />
                  Search Jobs
                </button>
              </div>
            </div>

            {/* Right side - Help field (highlighted key feature) */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Zap size={18} className="text-indigo-600 mr-2" />
                <label className="block text-sm font-medium text-indigo-800">🚀 AI-Powered Job Discovery</label>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  NEW
                </span>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Zap size={18} className="text-indigo-500" />
                  </div>
                  <input 
                    type="text" 
                    value={textosend} 
                    onChange={e => setTextosend(e.target.value)} 
                    placeholder="Confused??? ... tell us what you're looking for" 
                    className="block w-full pl-10 pr-3 py-3 border-2 border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white placeholder-indigo-400 text-gray-900" 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && textosend.trim() && !isAiSearchLoading) {
                        getjobbytext(1);
                      }
                    }}
                  />
                </div>
                <div className="flex justify-center">
                  <button 
                    onClick={() => textosend.trim() && getjobbytext(1)} 
                    disabled={!textosend.trim() || isAiSearchLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isAiSearchLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Wait...getting response
                      </>
                    ) : (
                      <>
                        <Zap size={16} className="mr-2" />
                        Send AI Request
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-indigo-600 mt-2">Describe your ideal job in natural language - our AI will find matching opportunities!</p>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <Filter size={16} className="mr-1" />
                {showFilters ? 'Hide' : 'Show'} Advanced Filters
              </button>
              {(searchTerm || location || jobType !== 'All Types' || category !== 'All Categories') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setLocation('');
                    setJobType('All Types');
                    setCategory('All Categories');
                    setDatePosted('Any Time');
                    setId('');
                    fetchRecommendations(1);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <div className="relative">
                  <select 
                    value={jobType} 
                    onChange={e => setJobType(e.target.value)} 
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Posted</label>
                <select 
                  value={datePosted} 
                  onChange={e => setDatePosted(e.target.value)} 
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {dateFilters.map(filter => (
                    <option key={filter} value={filter}>{filter}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="block">
          {/* Job Grid */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium text-gray-900">
                    {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
                    {!searchTerm && !location && jobType === 'All Types' && category === 'All Categories' && (
                      <span className="text-sm text-gray-500 ml-2">(Showing all jobs)</span>
                    )}
                  </h2>
                  <div className="flex items-center space-x-4">
                    {/* Sort Dropdown */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Sort by:</span>
                      <select 
                        value={sortBy} 
                        onChange={e => setSortBy(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid View */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {jobs.map((job, index) => (
                    <div 
                      key={job.jobId || index} 
                      className={`bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${selectedJob?.jobId === job.jobId ? 'ring-2 ring-indigo-500 shadow-md' : 'hover:border-indigo-300'}`}
                      onClick={() => setSelectedJob(job)}
                    >
                      {/* Company Logo Placeholder */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Building size={20} className="text-indigo-600" />
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job);
                          }}
                          className={`p-1 rounded hover:bg-gray-200 ${isJobSaved(job.jobId) ? 'text-indigo-600' : 'text-gray-400'}`}
                        >
                          <Bookmark size={16} fill={isJobSaved(job.jobId) ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      {/* Job Info */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{getTranslatedText(job.title)}</h3>
                        <p className="text-xs text-gray-600 mb-2">
                          {getTranslatedText(job.employer?.name) || 'Company Name'}
                        </p>
                        
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <MapPin size={12} className="mr-1" />
                          <span className="line-clamp-1">
                            {getTranslatedText(job.location?.city) || getTranslatedText(job.city) || 'Location not specified'}
                            {job.location?.area && `, ${getTranslatedText(job.location.area)}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <DollarSign size={12} className="mr-1" />
                          <span className="line-clamp-1">{formatSalary(job.salary)}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {getTranslatedText(job.type) || 'Full-time'}
                        </span>
                        {job.category && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {getTranslatedText(job.category)}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Posted {formatDate(job.createdAt)}</span>
                        {job.vacancies && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {job.vacancies} openings
                          </span>
                        )}
                      </div>

                      {/* Apply Status */}
                      {(authuser?.appliedJobs?.includes(String(job.jobId)) || job.applied) && (
                        <div className="mt-2 text-center">
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            <CheckCircle size={12} className="mr-1" />
                            Applied
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* No Jobs Message */}
                {jobs.length === 0 && (
                  <div className="text-center py-12">
                    <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || location || jobType !== 'All Types' || category !== 'All Categories' 
                        ? 'Try adjusting your search filters to find more opportunities.'
                        : 'No jobs are currently available. Check back later for new opportunities.'
                      }
                    </p>
                    {(searchTerm || location || jobType !== 'All Types' || category !== 'All Categories') && (
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setLocation('');
                          setJobType('All Types');
                          setCategory('All Categories');
                          setDatePosted('Any Time');
                          setId('');
                          fetchRecommendations(1);
                        }}
                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 text-sm rounded ${
                            currentPage === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Job Details Modal */}
          {selectedJob && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Job Header */}
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{getTranslatedText(selectedJob.title)}</h1>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Building size={16} className="mr-1" />
                        {getTranslatedText(selectedJob.employer?.name) || 'Company Name'}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        {getTranslatedText(selectedJob.location?.city) || getTranslatedText(selectedJob.city) || 'Location not specified'}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        Posted {formatDate(selectedJob.createdAt)}
                      </div>
                    </div>

                    {/* Job Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                        {getTranslatedText(selectedJob.type) || 'Full-time'}
                      </span>
                      {selectedJob.category && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                          {getTranslatedText(selectedJob.category)}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
                        {formatSalary(selectedJob.salary)}
                      </span>
                      {selectedJob.vacancies && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium">
                          {selectedJob.vacancies} opening{selectedJob.vacancies !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    {/* Apply Button */}
                    <div>
                      {authuser?.appliedJobs?.includes(String(selectedJob.jobId)) || selectedJob.applied ? (
                        <div className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed flex items-center">
                          <CheckCircle size={18} className="mr-2" />
                          Applied Successfully
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Resume Status */}
                          {authuser && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <FileText size={16} className="mr-2 text-gray-600" />
                                <span className="text-sm text-gray-700">Resume Status:</span>
                              </div>
                              {authuser.resume ? (
                                <div className="flex items-center text-sm text-green-600">
                                  <CheckCircle size={14} className="mr-1" />
                                  Resume uploaded
                                </div>
                              ) : (
                                <div className="text-sm text-amber-600">
                                  No resume uploaded
                                </div>
                              )}
                            </div>
                          )}
                          
                          <button
                            onClick={handleApply}
                            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors flex items-center justify-center font-medium"
                          >
                            <Briefcase size={18} className="mr-2" />
                            Apply for this Job
                          </button>
                          
                          {!authuser?.resume && (
                            <p className="text-xs text-gray-500 text-center">
                              Tip: Upload your resume in your profile to increase your chances!
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Job Content */}
                  <div className="space-y-6">
                    {/* Job Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Job Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium">{getTranslatedText(selectedJob.type) || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium">{getTranslatedText(selectedJob.category) || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Salary:</span>
                            <span className="font-medium">{formatSalary(selectedJob.salary)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vacancies:</span>
                            <span className="font-medium">{selectedJob.vacancies || 'Not specified'}</span>
                          </div>
                          
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Schedule & Contact</h3>
                        <div className="space-y-2 text-sm">
                          {selectedJob.preferredTime && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Work Hours:</span>
                              <span className="font-medium">
                                {selectedJob.preferredTime.start} - {selectedJob.preferredTime.end}
                              </span>
                            </div>
                          )}
                          {selectedJob.schedule?.days && Array.isArray(selectedJob.schedule.days) && selectedJob.schedule.days.length > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Work Days:</span>
                              <span className="font-medium">{selectedJob.schedule.days.join(', ')}</span>
                            </div>
                          )}
                          {selectedJob.employer?.contact && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Contact:</span>
                              <a href={`mailto:${selectedJob.employer.contact}`} className="text-indigo-600 hover:text-indigo-500 font-medium">
                                {selectedJob.employer.contact}
                              </a>
                            </div>
                          )}
                          {selectedJob.applicationDeadline && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Deadline:</span>
                              <span className="font-medium">{formatDate(selectedJob.applicationDeadline)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Job Description */}
                    {selectedJob.description && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                        <div className="text-gray-700 text-sm leading-relaxed">
                          <div dangerouslySetInnerHTML={{
                            __html: getTranslatedText(selectedJob.description).replace(/\n/g, '<br>')
                          }} />
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    {selectedJob.requirements && Array.isArray(selectedJob.requirements) && selectedJob.requirements.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                        <ul className="space-y-1 text-sm">
                          {selectedJob.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-indigo-500 mr-2">•</span>
                              <span className="text-gray-700">{getTranslatedText(req)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Skills */}
                    {selectedJob.skills && Array.isArray(selectedJob.skills) && selectedJob.skills.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full border border-indigo-200">
                              {getTranslatedText(skill)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FindJobsPage;