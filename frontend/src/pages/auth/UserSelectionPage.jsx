import { useNavigate } from "react-router-dom";
import UserTypeSelection from "../../components/auth/UserTypeSelection";

const UserSelectionPage = () => {
  const navigate = useNavigate();

  const handleUserTypeSelect = (userType) => {
    navigate("/auth/login", { state: { userType } });
  };

  return <UserTypeSelection onSelectUserType={handleUserTypeSelect} />;
};

export default UserSelectionPage;
