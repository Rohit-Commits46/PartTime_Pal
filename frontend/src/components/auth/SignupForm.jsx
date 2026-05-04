import React, { useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import { axiosinstance } from "../../lib/axios";
import axios from "axios";

const SignupForm = ({ userType, onBack }) => {
  // const { signup, isSigningup } = useAuthstore();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };

  async function handleSignupp(event) {
    event.preventDefault(); // Prevent default form submission
  //  console.log("run");
   
    try {
      // Verify passwords match
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match");
        return;
      }

      // Determine the endpoint based on user type - fixed to use signup endpoints
      const endpoint = userType === "jobSeeker" ? "/jobseekers/signin" : "/recruiters/signin";
      console.log("Signing up user:", formData, "User Type:", userType);

      const res = await axios.post(`http://localhost:5000/api${endpoint}`, {
        name: formData.firstname + " " + formData.lastname,
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 200 || res.status === 201) {
        console.log("Signup successful:", res.data);
        // Navigate based on userType
        if (userType === "jobSeeker") {
          //localStorage.setItem("userType", userType);
          navigate("/auth/signup/jobSeeker/info");
        } else if (userType === "employer") {
          navigate("/employerDashboard");
        }
      } else {
        console.log("Error in signup");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed: " + (error.response?.data?.message || error.message));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {userType === "jobSeeker" ? "Job Seeker" : "Recruiter"} Sign Up
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your PartTime Pal account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignupp}>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input
                id="firstname"
                name="firstname"
                type="text"
                required
                value={formData.firstname}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="First Name"
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input
                id="lastname"
                name="lastname"
                type="text"
                required
                value={formData.lastname}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center">
          <button
            onClick={onBack}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← Back to User Type Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;