import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const JobSeekerForm = () => {
  const navigate = useNavigate();

  // Generate a random seeker ID with format JOBSEEK followed by 3 digits
  const generateSeekerId = () => {
    const randomNum = Math.floor(100 + Math.random() * 900); // Random 3-digit number (100-999)
    return `JOBSEEK${randomNum}`;
  };

  const [formData, setFormData] = useState({
    seekerId: generateSeekerId(),
    name: "",
    email: "",
    phone: "",
    location: {
      city: "",
      area: ""
    },
    preferredJobTypes: ["Part-time"],
    skills: [],
    experience: "",
    availability: {
      start: "",
      end: "",
      days: []
    },
    resume: "",
    isEmployed: false
  });
  
  async function submitForm(){
    // e.preventDefault();
    try {
      console.log("Submitting form data:", formData);
      
      const res=await axios.post("http://localhost:5000/api/jobseekers", formData);
      console.log(res);
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Skills popup state
  const [showSkillsPopup, setShowSkillsPopup] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  
  // Common skills for quick selection
  const commonSkills = [
    "JavaScript", "React", "Node.js", "HTML", "CSS", 
    "Python", "Java", "C++", "Communication", "Leadership",
    "Project Management", "Customer Service", "Sales", "Marketing"
  ];

  const regenerateId = () => {
    setFormData({
      ...formData,
      seekerId: generateSeekerId()
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleDaysChange = (day) => {
    const currentDays = [...formData.availability.days];
    
    if (currentDays.includes(day)) {
      const updatedDays = currentDays.filter(d => d !== day);
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          days: updatedDays
        }
      });
    } else {
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          days: [...currentDays, day]
        }
      });
    }
  };

  const handleJobTypeChange = (jobType) => {
    const currentTypes = [...formData.preferredJobTypes];
    
    if (currentTypes.includes(jobType)) {
      const updatedTypes = currentTypes.filter(type => type !== jobType);
      setFormData({
        ...formData,
        preferredJobTypes: updatedTypes
      });
    } else {
      setFormData({
        ...formData,
        preferredJobTypes: [...currentTypes, jobType]
      });
    }
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend API
    console.log("Submitted Data:", formData);
    navigate("/"); // Redirect to the home page after submission
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-lg max-w-4xl w-full"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Job Seeker Profile
        </h2>

        {/* Personal Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Seeker ID</label>
              <div className="flex">
                <input
                  type="text"
                  name="seekerId"
                  value={formData.seekerId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-l"
                  readOnly
                />
                {/* <button
                  type="button"
                  onClick={regenerateId}
                  className="bg-gray-200 text-gray-700 px-2 rounded-r border-t border-r border-b hover:bg-gray-300"
                  title="Generate new ID"
                >
                  ↻
                </button> */}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">City</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Area</label>
              <input
                type="text"
                name="location.area"
                value={formData.location.area}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Professional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 3 years in marketing"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Resume URL</label>
              <input
                type="text"
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Preferred Job Types</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Full-time", "Part-time", "Contract", "Temporary", "Internship"].map(type => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`job-type-${type}`}
                      checked={formData.preferredJobTypes.includes(type)}
                      onChange={() => handleJobTypeChange(type)}
                      className="mr-1"
                    />
                    <label htmlFor={`job-type-${type}`} className="text-sm">{type}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="isEmployed"
                  name="isEmployed"
                  checked={formData.isEmployed}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="isEmployed" className="text-gray-700 text-sm">
                  Currently Employed
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Skills</h3>
          <div className="border rounded p-2 mb-2 min-h-24">
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map(skill => (
                <div key={skill} className="bg-blue-100 px-2 py-1 rounded flex items-center">
                  <span className="text-sm">{skill}</span>
                  <button 
                    type="button" 
                    className="ml-1 text-gray-500 hover:text-red-500"
                    onClick={() => removeSkill(skill)}
                  >
                    ×
                  </button>
                </div>
              ))}
              {formData.skills.length === 0 && (
                <span className="text-gray-400 text-sm">No skills selected</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowSkillsPopup(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add Skills
            </button>
          </div>
        </div>

        {/* Availability Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Start Time</label>
              <input
                type="time"
                name="availability.start"
                value={formData.availability.start}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">End Time</label>
              <input
                type="time"
                name="availability.end"
                value={formData.availability.end}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm mb-1">Available Days</label>
            <div className="flex flex-wrap gap-3">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                <div key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`day-${day}`}
                    checked={formData.availability.days.includes(day)}
                    onChange={() => handleDaysChange(day)}
                    className="mr-1"
                  />
                  <label htmlFor={`day-${day}`} className="text-sm">{day.substring(0, 3)}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            onClick={submitForm}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Skills Selection Popup */}
      {showSkillsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Skills</h3>
            
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillInputKeyDown}
                  placeholder="Type a skill and press Enter"
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Common skills:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className={`px-2 py-1 text-xs rounded ${
                        formData.skills.includes(skill) 
                          ? 'bg-blue-200 text-blue-800' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      disabled={formData.skills.includes(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Selected skills:</p>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <div key={skill} className="bg-blue-100 px-2 py-1 rounded flex items-center">
                    <span className="text-sm">{skill}</span>
                    <button 
                      type="button" 
                      className="ml-1 text-gray-500 hover:text-red-500"
                      onClick={() => removeSkill(skill)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {formData.skills.length === 0 && (
                  <span className="text-gray-400 text-sm">No skills selected</span>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowSkillsPopup(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowSkillsPopup(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSeekerForm;
