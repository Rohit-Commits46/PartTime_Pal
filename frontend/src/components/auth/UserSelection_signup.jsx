// import React from "react";
// import { Briefcase, UserCheck } from "lucide-react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// // Remove the unused import
// // import UserSelectionPage from "../../pages/auth/UserSelectionPage";

// // Rename this to match your export
// const UserSelection_signup = ({ onSelectUserType }) => {
//   const navigate = useNavigate();
  
//   const handleUserTypeSelect = (userType) => {
//     // Call the onSelectUserType prop function if provided
//     if (onSelectUserType) {
//       onSelectUserType(userType);
//     }
    
//     // Navigate to the signup page
//     navigate("/auth/signup");
//   };
  
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-md w-full space-y-8 text-center">
//         <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//           Choose Your Account Type
//         </h2>
//         <p className="text-sm text-gray-600">
//           Select how you'll be using PartTime Pal
//         </p>
//         <div className="flex space-x-4">
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="flex-1 cursor-pointer"
//             onClick={() => handleUserTypeSelect("jobSeeker")}
//           >
//             <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-all">
//               <UserCheck size={48} className="mx-auto text-blue-500 mb-4" />
//               <h3 className="text-xl font-semibold mb-2">Job Seeker</h3>
//               <p className="text-gray-600">
//                 Looking for part-time opportunities
//               </p>
//             </div>
//           </motion.div>
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="flex-1 cursor-pointer"
//             onClick={() => handleUserTypeSelect("employer")}
//           >
//             <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-all">
//               <Briefcase size={48} className="mx-auto text-green-500 mb-4" />
//               <h3 className="text-xl font-semibold mb-2">Employer</h3>
//               <p className="text-gray-600">Posting part-time jobs</p>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserSelection_signup;

import { useNavigate } from "react-router-dom";
import UserTypeSelection from "../../components/auth/UserTypeSelection";

const UserSelectionPage = () => {
  const navigate = useNavigate();

  const handleUserTypeSelect = (userType) => {
    navigate("/auth/signup", { state: { userType } });
  };

  return <UserTypeSelection onSelectUserType={handleUserTypeSelect} />;
};

export default UserSelectionPage;
