import React, { useState, useEffect } from 'react'
import { useChatstore } from "../../store/useChatstore";
import { useAuthstore } from "../../store/useAuthstore";
import { axiosinstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";

function Application() {
    const { authuser, loadAuthuser } = useAuthstore();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!authuser && localStorage.getItem("authuser")) {
            loadAuthuser();
        }
    }, [authuser]);

    useEffect(() => {
        if (authuser?.seekerId) {
            fetchApplications();
        }
    }, [authuser]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
                  var language=localStorage.getItem("language");
        //   const params = new URLSearchParams();
        //   params.append("language", language);
          console.log(language)
            const response = await axiosinstance.get(`/jobseekers/applications/${authuser.seekerId}/${language}`);
            console.log(response);
                
            // Sort applications by appliedAt date (most recent first)
            const sortedApplications = (response.data.applications || []).sort((a, b) => {
                return new Date(b.appliedAt) - new Date(a.appliedAt);
            });
            
            setApplications(sortedApplications);
        } catch (error) {
            console.error("Error fetching applications:", error);
            setError("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRelativeTime = (dateString) => {
        const now = new Date();
        const appliedDate = new Date(dateString);
        const diffTime = Math.abs(now - appliedDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffDays > 7) {
            return formatDate(dateString);
        } else if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    };

    const handleContactEmployer = (providerId) => {
        // Show toast notification
        setToast({ type: 'success', message: 'Opening chat with employer...' });
        
        // Navigate to chat/message route with the employer's ID
        console.log('Navigating to chat with employer providerId:', providerId);
        console.log('Full URL will be:', `/message?contact=${providerId}`);
        navigate(`/message?contact=${providerId}`);
        
        // Clear toast after navigation
        setTimeout(() => setToast(null), 3000);
    };

    const handleViewJobDetails = (jobId) => {
        // You can navigate to job details page or show a modal
        console.log('Viewing job details for:', jobId);
        // navigate(`/job/${jobId}`); // Uncomment if you have a job details page
    };

    const handleWithdrawApplication = async (applicationId, jobId) => {
        if (window.confirm('Are you sure you want to withdraw this application?')) {
            try {
                // You can implement the withdraw API call here
                console.log('Withdrawing application:', applicationId, jobId);
                // await axiosinstance.delete(`/jobseekers/applications/${applicationId}`);
                // fetchApplications(); // Refresh the list
                alert('Application withdrawal feature will be implemented soon.');
            } catch (error) {
                console.error('Error withdrawing application:', error);
                alert('Failed to withdraw application');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your applications...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-red-600 text-lg">{error}</p>
                    <button 
                        onClick={fetchApplications}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
                    toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    <div className="flex items-center">
                        {toast.type === 'success' && (
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                        {toast.message}
                    </div>
                </div>
            )}
            
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Job Applications</h1>
                    <p className="text-gray-600 mt-2">
                        Track the status of your job applications and manage your career journey
                    </p>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Sorted by most recently applied
                    </div>
                </div>

                {/* Applications Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="text-2xl font-bold text-indigo-600">
                            {applications.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Applications</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="text-2xl font-bold text-yellow-600">
                            {applications.filter(app => app.status === 'pending').length}
                        </div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="text-2xl font-bold text-green-600">
                            {applications.filter(app => app.status === 'accepted').length}
                        </div>
                        <div className="text-sm text-gray-600">Accepted</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="text-2xl font-bold text-red-600">
                            {applications.filter(app => app.status === 'rejected').length}
                        </div>
                        <div className="text-sm text-gray-600">Rejected</div>
                    </div>
                </div>

                {/* Applications List */}
                {applications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                        <div className="text-gray-400 text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-600">
                            You haven't applied to any jobs yet. Start exploring opportunities!
                        </p>
                        <button 
                            onClick={() => navigate('/findJobs')}
                            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Browse Jobs
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {applications.map((application) => (
                            <div key={application.applicationId} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {application.jobDetails?.title || 'Job Title Not Available'}
                                                    </h3>
                                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Applied {getRelativeTime(application.appliedAt)}
                                                    </div>
                                                </div>
                                                <span className={`ml-4 px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(application.status)}`}>
                                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                </span>
                                            </div>
                                            
                                            <div className="text-gray-600 mb-2">
                                                <span className="font-medium">{application.jobDetails?.company}</span>
                                                {application.jobDetails?.location && (
                                                    <span className="ml-2">
                                                        • {application.jobDetails.location.city}, {application.jobDetails.location.area}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                                <div className="flex items-center">
                                                    <span className="font-medium">Job ID:</span>
                                                    <span className="ml-1 font-mono bg-gray-100 px-2 py-1 rounded">{application.jobId}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-medium">Applied on:</span>
                                                    <span className="ml-1">{formatDate(application.appliedAt)}</span>
                                                </div>
                                                {application.jobDetails?.type && (
                                                    <div className="flex items-center">
                                                        <span className="font-medium">Type:</span>
                                                        <span className="ml-1">{application.jobDetails.type}</span>
                                                    </div>
                                                )}
                                                {application.jobDetails?.salary && (
                                                    <div className="flex items-center">
                                                        <span className="font-medium">Salary:</span>
                                                        <span className="ml-1">
                                                            ₹{application.jobDetails.salary} 
                                                            {application.jobDetails.salary.frequency && ` / ${application.jobDetails.salary.frequency}`}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>                            {application.jobDetails?.description && (
                                <div className="mt-3">
                                    <p className="text-gray-600 text-sm">
                                        {application.jobDetails.description.length > 200 
                                            ? application.jobDetails.description.substring(0, 200) + '...'
                                            : application.jobDetails.description
                                        }
                                    </p>
                                </div>
                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                                        
                                        {application.status === 'accepted' && (
                                            <button 
                                                onClick={() => handleContactEmployer(application.providerId)}
                                                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                Contact Employer
                                            </button>
                                        )}
                                        {application.status === 'pending' && (
                                            <button 
                                                onClick={() => handleWithdrawApplication(application.applicationId, application.jobId)}
                                                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                            >
                                                Withdraw Application
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Application