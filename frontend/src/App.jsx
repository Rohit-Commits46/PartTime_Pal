import { useState,useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import React, {  useEffect } from 'react';

import { Outlet } from "react-router-dom";
import Footer from "./components/Others/Footer";
import Navbar from "./components/Others/Navbar";
// import moduleName from 'useAuth'
import { useAuthstore } from './store/useAuthstore';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [count, setCount] = useState(0);
  const { authuser, loadAuthuser} = useAuthstore();
  
  useEffect(() => {
    // Always try to load authuser on app initialization
    if (!authuser) {
      console.log("authuser name:", authuser);
      // Check for job seeker first
      if (localStorage.getItem("authuser_jobseeker")) {
        loadAuthuser('jobseeker');
      }
      // Then check for recruiter
      else if (localStorage.getItem("authuser_recruiter")) {
        loadAuthuser('recruiter');
      }
      // Fallback to old key for backward compatibility
      else if (localStorage.getItem("authuser")) {
        // Try to determine user type from old data
        const oldUser = JSON.parse(localStorage.getItem("authuser"));
        if (oldUser.seekerId) {
          localStorage.setItem("authuser_jobseeker", JSON.stringify(oldUser));
          loadAuthuser('jobseeker');
        } else if (oldUser.recid) {
          localStorage.setItem("authuser_recruiter", JSON.stringify(oldUser));
          loadAuthuser('recruiter');
        }
        // Clean up old key
        localStorage.removeItem("authuser");
      }
    }
  }, [authuser, loadAuthuser]);

  return (
    <LanguageProvider>
      <Navbar />
      <Outlet />
      <Footer />
    </LanguageProvider>
  );
}

export default App;
