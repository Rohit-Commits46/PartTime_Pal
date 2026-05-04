import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostJobPage = () => {
  const navigate = useNavigate();
  // const {postjob}=useRecuiterstore();

  const [formData, setFormData] = useState({
    jobId: "",
    title: "",
    description: "",
    requirements: "",
    type: "Full-time",
    category: "Tech",
    slug: "",
    isApplied: false,
    tags: [],
    duration: "",
    skills: [],
    vacancies: 1,
    salary: {
      amount: "",
      currency: "USD",
      frequency: "yearly"
    },
    preferredTime: {
      start: "",
      end: ""
    },
    location: {
      city: "",
      area: ""
    },
    employer: {
      name: "",
      contact: "",
      phone: "",
      owner: ""
    },
    schedule: {
      shifts: "",
      days: []
    },
    recid: localStorage.getItem('recid') || "REC00002" // Get recid from localStorage
  });

  // Generate job ID when component mounts
  React.useEffect(() => {
    const generateJobId = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/postjob/all");
        const total = response.data.total || 0;
        const newJobId = total + 2;
        
        setFormData(prev => ({
          ...prev,
          jobId: newJobId.toString()
        }));
      } catch (error) {
        console.error("Error generating Job ID:", error);
        setFormData(prev => ({
          ...prev,
          jobId: "1"
        }));
      }
    };

    generateJobId();
  }, []);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Skills popup state
  const [showSkillsPopup, setShowSkillsPopup] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  
  // Tags popup state
  const [showTagsPopup, setShowTagsPopup] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Common skills for quick selection
  const commonSkills = [
    "JavaScript", "React", "Node.js", "Python", "SQL", 
    "Java", "Communication", "Project Management", "Marketing",
    "Sales", "Customer Service", "Data Analysis", "Design"
  ];

  // Common tags for quick selection
  const commonTags = [
    "Remote", "Flexible", "Entry-Level", "Senior", "Mid-Level", 
    "Urgent", "Healthcare", "Benefits", "Startup", "Enterprise"
  ];

  // Days of the week for schedule
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (child.includes(".")) {
        const [subParent, subChild] = child.split(".");
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [subParent]: {
              ...formData[parent][subParent],
              [subChild]: value
            }
          }
        });
      } else {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: value
          }
        });
      }
    } else {
      // Special case for job title to auto-generate slug
      if (name === "title") {
        setFormData({ 
          ...formData, 
          [name]: value,
          slug: generateSlug(value)
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleDayChange = (day) => {
    const currentDays = [...formData.schedule.days];
    
    if (currentDays.includes(day)) {
      const updatedDays = currentDays.filter(d => d !== day);
      setFormData({
        ...formData,
        schedule: {
          ...formData.schedule,
          days: updatedDays
        }
      });
    } else {
      setFormData({
        ...formData,
        schedule: {
          ...formData.schedule,
          days: [...currentDays, day]
        }
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

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  async function handlejobPost() {
    try {
      const res = await axios.post("http://localhost:5000/api/postjob", {
        ...formData,
      });
      console.log(res);
      // navigate("/jobs");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const handleJobPost = () => {
      // Get the recid from localStorage
      const recid = localStorage.getItem('recid');
      
      // Check if recid is available, and add it to the formData if present
      if (recid) {
        const updatedFormData = { ...formData, recid };
    
        // Log the updated formData with recid
        console.log('Posting Job:', updatedFormData);
        submitForm(updatedFormData)
        // Here you can call your API to save the job posting with the recid
        // Example: 
        // postJobToBackend(updatedFormData);
      } else {
        console.log('recid not found in localStorage');
      }
    // };
    
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-lg max-w-4xl w-full"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Create Job Posting
        </h2>

        {/* Basic Job Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Basic Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Job ID</label>
              <input
                type="text"
                name="jobId"
                value={formData.jobId}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm mb-1">Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="Tech">Tech</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm mb-1">Employment Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Number of Vacancies</label>
              <input
                type="number"
                name="vacancies"
                value={formData.vacancies}
                onChange={handleChange}
                min="1"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-gray-700 text-sm mb-1">Job Slug (URL-friendly name)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="auto-generated-from-title"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-gray-700 text-sm mb-1">Duration (for contract/temporary jobs)</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 3 months, 1 year"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Salary Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Compensation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Salary Amount</label>
              <input
                type="text"
                name="salary.amount"
                value={formData.salary.amount}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 50000, 60-80k, Competitive"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Currency</label>
              <select
                name="salary.currency"
                value={formData.salary.currency}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Payment Frequency</label>
              <select
                name="salary.frequency"
                value={formData.salary.frequency}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description and Requirements */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Job Description & Requirements</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="5"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Job Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="5"
              required
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Required Skills</h3>
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
                <span className="text-gray-400 text-sm">No skills added</span>
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

        {/* Tags Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Job Tags</h3>
          <div className="border rounded p-2 mb-2 min-h-24">
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <div key={tag} className="bg-green-100 px-2 py-1 rounded flex items-center">
                  <span className="text-sm">{tag}</span>
                  <button 
                    type="button" 
                    className="ml-1 text-gray-500 hover:text-red-500"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </div>
              ))}
              {formData.tags.length === 0 && (
                <span className="text-gray-400 text-sm">No tags added</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowTagsPopup(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add Tags
            </button>
          </div>
        </div>

        {/* Location Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Location Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-gray-700 text-sm mb-1">Area/District</label>
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

        {/* Work Schedule */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Work Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Working Days</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {daysOfWeek.map(day => (
                  <div key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      checked={formData.schedule.days.includes(day)}
                      onChange={() => handleDayChange(day)}
                      className="mr-1"
                    />
                    <label htmlFor={`day-${day}`} className="text-sm">{day}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Shift Type</label>
              <select
                name="schedule.shifts"
                value={formData.schedule.shifts}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Shift Type</option>
                <option value="Day Shift">Day Shift</option>
                <option value="Night Shift">Night Shift</option>
                <option value="Rotating Shift">Rotating Shift</option>
                <option value="Split Shift">Split Shift</option>
                <option value="On-Call">On-Call</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Preferred Start Time</label>
              <input
                type="time"
                name="preferredTime.start"
                value={formData.preferredTime.start}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Preferred End Time</label>
              <input
                type="time"
                name="preferredTime.end"
                value={formData.preferredTime.end}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Employer Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Employer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Company Name</label>
              <input
                type="text"
                name="employer.name"
                value={formData.employer.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Contact Email</label>
              <input
                type="email"
                name="employer.contact"
                value={formData.employer.contact}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Contact Phone</label>
              <input
                type="tel"
                name="employer.phone"
                value={formData.employer.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Hiring Manager</label>
              <input
                type="text"
                name="employer.owner"
                value={formData.employer.owner}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isApplied"
              name="isApplied"
              checked={formData.isApplied}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="isApplied" className="text-gray-700 text-sm">
              Allow applications for this job
            </label>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={handlejobPost}
          >
            Create Job Posting
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

      {/* Tags Selection Popup */}
      {showTagsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Tags</h3>
            
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Type a tag and press Enter"
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => addTag(tagInput)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Common tags:</p>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className={`px-2 py-1 text-xs rounded ${
                        formData.tags.includes(tag) 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      disabled={formData.tags.includes(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Selected tags:</p>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <div key={tag} className="bg-green-100 px-2 py-1 rounded flex items-center">
                    <span className="text-sm">{tag}</span>
                    <button 
                      type="button" 
                      className="ml-1 text-gray-500 hover:text-red-500"
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {formData.tags.length === 0 && (
                  <span className="text-gray-400 text-sm">No tags selected</span>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowTagsPopup(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowTagsPopup(false)}
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

export default PostJobPage;