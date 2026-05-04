import React, { useEffect, useState } from "react";
import { User, Mail, Phone, BadgeCheck } from "lucide-react";

const RecruiterProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setProfile(user);
      } catch (err) {
        console.error("Failed to parse authUser:", err);
      }
    }
  }, []);

  if (!profile) {
    return <div className="p-6 text-gray-500">Loading recruiter profile...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <User className="text-blue-600" size={28} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {profile.first_name}
          </h2>
          <p className="text-gray-500 text-sm">Recruiter ID: {profile.recid}</p>
        </div>
      </div>

      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-blue-500" />
          <span>{profile.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-blue-500" />
          <span>{profile.contact}</span>
        </div>
        <div className="flex items-center gap-2">
          <BadgeCheck size={16} className="text-blue-500" />
          <span>Password: *******</span>
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default RecruiterProfile;
