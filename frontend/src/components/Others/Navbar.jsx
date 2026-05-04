import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  User,
  Menu,
  X,
  Briefcase,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { useAuthstore } from "../../store/useAuthstore";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../utils/translations";
import LanguageToggle from "./LanguageToggle";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authuser, logout, loadAuthuser } = useAuthstore();
  const { language } = useLanguage();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const t = (key) => getTranslation(key, language);

  useEffect(() => {
    if (!authuser) {
      if (localStorage.getItem("authuser_jobseeker")) {
        loadAuthuser("jobseeker");
      } else if (localStorage.getItem("authuser_recruiter")) {
        loadAuthuser("recruiter");
      }
    }
  }, [authuser, loadAuthuser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest(".profile-menu")) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  const goToProfile = () => {
    if (authuser?.seekerId) {
      navigate(`/userprofile/${authuser.seekerId}`);
    } else if (authuser?.recid) {
      navigate(`/employerProfile/${authuser.recid}`);
    }
    setShowProfileMenu(false);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300">
            PartTimePal
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />

            {!authuser ? (
              <>
                <Link
                  to="/findJobs"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === "/findJobs"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {t("findJobs")}
                </Link>
                <Link
                  to="/dailywages"
                  className="px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-600 text-black shadow-lg shadow-orange-500/30 transform scale-105 tracking-wider hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
                >
                  <span className="uppercase text-xs font-black">DAILYWAGES</span>
                </Link>
                <Link
                  to="/postjob"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === "/postjob"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {t("postJob")}
                </Link>
                <Link
                  to="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t("login")}
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  {t("signup")}
                </Link>
              </>
            ) : (
              <>
                {authuser.seekerId && (
                  <>
                    <Link
                      to="/jobSeekerDashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === "/jobSeekerDashboard"
                          ? "bg-indigo-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {t("dashboard")}
                    </Link>
                    <Link
                      to="/findJobs"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === "/findJobs"
                          ? "bg-indigo-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {t("findJobs")}
                    </Link>
                    
                    <Link
                      to="/application"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === "/application"
                          ? "bg-indigo-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {t("applications")}
                    </Link>
                    <Link
                  to="/dailywagesJobs"
                  className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-600 text-black shadow-lg shadow-orange-500/30 transform scale-105 font-bold tracking-wider hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
                >
                  <span className="uppercase text-xs font-black">DAILYWAGES</span>
                </Link>
                  </>
                )}

                {authuser.recid && (
                  <>
                    <Link
                      to={`/RDashboard/${authuser.recid}`}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname.includes("/RDashboard")
                          ? "bg-indigo-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {t("dashboard")}
                    </Link>
                    <Link
                      to="/postjob"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === "/postjob"
                          ? "bg-indigo-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {t("postJob")}
                    </Link>
                    <Link
                  to="/dailywages"
                  className="px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-600 text-black shadow-lg shadow-orange-500/30 transform scale-105 tracking-wider hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
                >
                  <span className="uppercase text-xs font-black">DAILYWAGES</span>
                </Link>
                    <Link
                      to={`/candidate/${authuser.recid}`}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname.includes("/candidate")
                          ? "bg-indigo-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {t("candidates")}
                    </Link>
                  </>
                )}

                <Link
                  to="/message"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === "/message"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {t("messages")}
                </Link>
              </>
            )}

            {authuser && (
              <>
                <button className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                  <Bell size={20} />
                </button>
                <div className="relative profile-menu">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-3 p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">
                        {authuser.name || "User"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {authuser.seekerId ? t("jobSeeker") : t("recruiter")}
                      </div>
                    </div>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User size={20} className="text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {authuser.name || "User"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {authuser.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {authuser.seekerId || authuser.recid}
                            </div>
                          </div>
                        </div>
                        {authuser.seekerId && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">{t("profileStatus")}</span>
                              <span className={`px-2 py-1 rounded-full ${
                                authuser.isEmployed
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {authuser.isEmployed ? t("employed") : t("jobSeeking")}
                              </span>
                            </div>
                            {authuser.resume && (
                              <div className="flex items-center mt-1 text-xs text-green-600">
                                <CheckCircle size={12} className="mr-1" />
                                {t("resumeUploaded")}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={goToProfile}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User size={16} className="mr-2" />
                          {t("myProfile")}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={16} className="mr-2" />
                          {t("logout")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu placeholder (can be added similarly) */}
        {/* Your mobile menu is already defined further down, add /dailywages if needed */}
      </div>
    </nav>
  );
};

export default Navbar;
