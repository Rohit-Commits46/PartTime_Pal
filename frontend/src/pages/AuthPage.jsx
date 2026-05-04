import React, { useState } from 'react';
import UserTypeSelection from '../components/auth/UserTypeSelection';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const AuthPage = () => {
  const [stage, setStage] = useState('userType');
  const [selectedUserType, setSelectedUserType] = useState(null);

  const handleUserTypeSelect = (userType) => {
    setSelectedUserType(userType);
    setStage('selection');
  };

  return (
    <div>
      {stage === 'userType' && <UserTypeSelection onSelectUserType={handleUserTypeSelect} />}
      {stage === 'login' && <LoginForm userType={selectedUserType} onBack={() => setStage('userType')} />}
      {stage === 'signup' && <SignupForm userType={selectedUserType} onBack={() => setStage('userType')} />}
    </div>
  );
};

export default AuthPage;
