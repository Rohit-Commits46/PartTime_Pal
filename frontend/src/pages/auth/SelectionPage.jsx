import { useNavigate, useLocation } from "react-router-dom";

const SelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.userType || "jobSeeker";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          {userType === "jobSeeker" ? "Job Seeker" : "Employer"} Account
        </h2>
        <p className="text-sm text-gray-600">Choose your next action</p>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/auth/login", { state: { userType } })}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/auth/signup", { state: { userType } })}
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← Back to User Type
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionPage;
