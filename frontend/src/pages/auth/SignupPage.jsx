import SignupForm from "../../components/auth/SignupForm";
import { useLocation, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userType = location.state?.userType || "jobSeeker";

  return <SignupForm userType={userType} onBack={() => navigate(-1)} />;
};

export default SignupPage;
