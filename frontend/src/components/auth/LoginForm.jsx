import React, { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { googleAuth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import  googleIcon  from "../../assets/google-Icon (2).svg"; // Adjust the path as necessary
import axios from "axios";
import { useAuthstore } from "../../store/useAuthstore";

const LoginForm = ({ userType, onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const navigate = useNavigate();
  const { login,loginrec,authuser ,setAuthuser} = useAuthstore();       

  
  async function handleLogin(e) {
    // const handleLogin = (e) => {
      e.preventDefault();
      var sucess="";
      if(userType==="jobSeeker"){
        console.log(`Logging in ${userType}:`, { email, password });
        sucess=login({ email, password });  
        if(sucess){
          console.log("->>>")
          console.log(authuser);
            navigate("/jobSeekerDashboard");
        }
      }else{
        console.log(`Logging in ${userType}:`, { email, password });
        sucess=loginrec({ email, password });  
        if(sucess){
          console.log("->>>")
          console.log(authuser);
          localStorage.setItem("recid", authuser.recid);
            navigate(`/RDashboard/${authuser.recid}`);
        }
      }
      
      
    };
  // }

  async function handleGoogleAuth() {
    const google = await googleAuth();
    const name=google.displayName;
    const email2=google.email;
    const pic=google.photoURL;
  
    const time=new Date().getTime();
    const res= await axios.post('http://localhost:5000/auth/login', {
      name,
      email2,
      // userType,
      time
    });  

    const data=res;
    console.log(res);
    const password=data.data?.data?.password;
    const email=data.data?.data?.email;
    console.log("email",email);
    
    const sucess=login({ email , password });
    

    if(sucess){
      // console.log("Login successful:", res.data);
      // console.log(res.data);
      console.log("->>>")
      console.log(authuser);
      if (userType === "jobSeeker") {
        navigate("/jobSeekerDashboard");
      } else if (userType === "employer") {
        navigate("/employerDashboard");
      }
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {userType === "jobSeeker" ? "Job Seeker" : "Employer"} Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your PartTime Pal account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign in
          </button>
        </form>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} alt="Google" className="w-6 h-6" />
          </button>
        </div>
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

export default LoginForm;
