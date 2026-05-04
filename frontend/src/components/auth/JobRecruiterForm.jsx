import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecruiterForm = () => {
  const navigate = useNavigate();

  // Generate a random recruiter ID with format RECRUIT followed by 3 digits
  const generateRecruiterId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number (100-999)
    return `REC${randomNum}`;
  };

  const [formData, setFormData] = useState({
    recruiterId: generateRecruiterId(),
    name: "",
    email: "",
    phone: "",
    company: {
      name: "",
      website: "",
      location: {
        city: "",
        area: ""
      }
    },
    jobCategories: ["Tech"],
    hiringTypes: ["Full-time"],
    benefits: [],
    hiringProcess: {
      steps: "",
      averageTime: ""
    },
    companyLogo: "",
    isVerified: false
  });
  
  async function submitForm(){
    try {
      const res = await axios.post("http://localhost:5000/api/recruiters", formData);
      console.log(res);
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Benefits popup state
  const [showBenefitsPopup, setShowBenefitsPopup] = useState(false);
  const [benefitInput, setBenefitInput] = useState("");
  
  // Common benefits for quick selection
  const commonBenefits = [
    "Health Insurance", "Dental Coverage", "401(k)", "Remote Work", 
    "Flexible Hours", "Paid Time Off", "Professional Development",
    "Gym Membership", "Parental Leave", "Stock Options", "Performance Bonus"
  ];

  const regenerateId = () => {
    setFormData({
      ...formData,
      recruiterId: generateRecruiterId()
    });
  };

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
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleCategoryChange = (category) => {
    const currentCategories = [...formData.jobCategories];
    
    if (currentCategories.includes(category)) {
      const updatedCategories = currentCategories.filter(cat => cat !== category);
      setFormData({
        ...formData,
        jobCategories: updatedCategories
      });
    } else {
      setFormData({
        ...formData,
        jobCategories: [...currentCategories, category]
      });
    }
  };

  const handleHiringTypeChange = (hiringType) => {
    const currentTypes = [...formData.hiringTypes];
    
    if (currentTypes.includes(hiringType)) {
      const updatedTypes = currentTypes.filter(type => type !== hiringType);
      setFormData({
        ...formData,
        hiringTypes: updatedTypes
      });
    } else {
      setFormData({
        ...formData,
        hiringTypes: [...currentTypes, hiringType]
      });
    }
  };

  const addBenefit = (benefit) => {
    if (benefit && !formData.benefits.includes(benefit)) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, benefit]
      });
      setBenefitInput("");
    }
  };

  const removeBenefit = (benefit) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter(b => b !== benefit)
    });
  };

  const handleBenefitInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBenefit(benefitInput);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    submitForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-lg max-w-4xl w-full"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Recruiter Profile
        </h2>

        {/* Personal Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Contact Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Recruiter ID</label>
              <div className="flex">
                <input
                  type="text"
                  name="recruiterId"
                  value={formData.recruiterId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-l"
                  readOnly
                />
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
          </div>
        </div>

        {/* Company Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Company Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Company Name</label>
              <input
                type="text"
                name="company.name"
                value={formData.company.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Company Website</label>
              <input
                type="text"
                name="company.website"
                value={formData.company.website}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">City</label>
              <input
                type="text"
                name="company.location.city"
                value={formData.company.location.city}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Area</label>
              <input
                type="text"
                name="company.location.area"
                value={formData.company.location.area}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Company Logo URL</label>
              <input
                type="text"
                name="companyLogo"
                value={formData.companyLogo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Job Categories & Hiring Types */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Hiring Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Job Categories</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Tech", "Finance", "Healthcare", "Education", "Marketing", "Sales", "Customer Service", "Admin"].map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={formData.jobCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="mr-1"
                    />
                    <label htmlFor={`category-${category}`} className="text-sm">{category}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Hiring Types</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Full-time", "Part-time", "Contract", "Temporary", "Internship"].map(type => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`hiring-type-${type}`}
                      checked={formData.hiringTypes.includes(type)}
                      onChange={() => handleHiringTypeChange(type)}
                      className="mr-1"
                    />
                    <label htmlFor={`hiring-type-${type}`} className="text-sm">{type}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Benefits Offered</h3>
          <div className="border rounded p-2 mb-2 min-h-24">
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.benefits.map(benefit => (
                <div key={benefit} className="bg-blue-100 px-2 py-1 rounded flex items-center">
                  <span className="text-sm">{benefit}</span>
                  <button 
                    type="button" 
                    className="ml-1 text-gray-500 hover:text-red-500"
                    onClick={() => removeBenefit(benefit)}
                  >
                    ×
                  </button>
                </div>
              ))}
              {formData.benefits.length === 0 && (
                <span className="text-gray-400 text-sm">No benefits added</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowBenefitsPopup(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add Benefits
            </button>
          </div>
        </div>

        {/* Hiring Process Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Hiring Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Steps in Hiring Process</label>
              <textarea
                name="hiringProcess.steps"
                value={formData.hiringProcess.steps}
                onChange={handleChange}
                placeholder="e.g., Resume review, Phone screening, Technical interview, Final interview"
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Average Hiring Time (days)</label>
              <input
                type="text"
                name="hiringProcess.averageTime"
                value={formData.hiringProcess.averageTime}
                onChange={handleChange}
                placeholder="e.g., 14"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="isVerified"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="isVerified" className="text-gray-700 text-sm">
                I confirm all information provided is accurate
              </label>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Benefits Selection Popup */}
      {showBenefitsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Benefits</h3>
            
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyDown={handleBenefitInputKeyDown}
                  placeholder="Type a benefit and press Enter"
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => addBenefit(benefitInput)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Common benefits:</p>
                <div className="flex flex-wrap gap-2">
                  {commonBenefits.map(benefit => (
                    <button
                      key={benefit}
                      type="button"
                      onClick={() => addBenefit(benefit)}
                      className={`px-2 py-1 text-xs rounded ${
                        formData.benefits.includes(benefit) 
                          ? 'bg-blue-200 text-blue-800' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      disabled={formData.benefits.includes(benefit)}
                    >
                      {benefit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Selected benefits:</p>
              <div className="flex flex-wrap gap-2">
                {formData.benefits.map(benefit => (
                  <div key={benefit} className="bg-blue-100 px-2 py-1 rounded flex items-center">
                    <span className="text-sm">{benefit}</span>
                    <button 
                      type="button" 
                      className="ml-1 text-gray-500 hover:text-red-500"
                      onClick={() => removeBenefit(benefit)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {formData.benefits.length === 0 && (
                  <span className="text-gray-400 text-sm">No benefits selected</span>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowBenefitsPopup(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowBenefitsPopup(false)}
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

export default RecruiterForm;