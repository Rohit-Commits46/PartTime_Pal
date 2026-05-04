import LoginForm from "../../components/auth/LoginForm";
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userType = location.state?.userType || "jobSeeker";

  return <LoginForm userType={userType} onBack={() => navigate(-1)} />;
};

export default LoginPage;
