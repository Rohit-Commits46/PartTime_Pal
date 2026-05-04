import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import UserSelectionPage from "./pages/auth/UserSelectionPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./utils/store.js";
import DailyWageJobList from "./pages/JobSeeker/DailyWageJobList.jsx"
import Findjobs from "./pages/JobRecruter/Findjobs.jsx";
import PostJobPage from "./pages/JobRecruter/PostJobPage.jsx";
import Register_form from "./pages/auth/Register_form.jsx";
import SelectionPage from "./pages/auth/SelectionPage.jsx";
import JobSeekerForm from "./components/auth/JobSeekerForm.jsx";
import UserProfile from "./components/Profile/UserProfile.jsx";
import ChatBox from "./pages/JobRecruter/ChatBox.jsx";
import JobSeekerDashboard from "./components/Dashboard/JobSeeker.jsx";
import FindJobsPage from "./pages/JobSeeker/FindJobs.jsx";
import ApplicationsPage from "./pages/JobSeeker/Applications.jsx";
import MessagesRoute from "./pages/JobRecruter/Message.jsx";
import { persistor } from "./utils/store.js";
import { PersistGate } from "redux-persist/integration/react";
import Application from "./pages/JobSeeker/Application.jsx";
import DailyWageJobForm from "./pages/JobRecruter/DailyWageJobForm.jsx"
// import DailyWageApplications from "./pages/JobRecruter/DailyWageApplications.jsx"
// import DailyWageDashboard from "./pages/DailyWageDashboard.jsx"
import RecruiterForm from "./components/auth/JobRecruiterForm.jsx";
import UserSelection_signup from "./components/auth/UserSelection_signup.jsx";
import RecruiterDashboard from "./components/Dashboard/Employer.jsx";
import JobApplicationsPage from "./pages/JobRecruter/JobApplicationPage.jsx";
import RecruiterProfile from "./pages/JobRecruter/RecruiterProfile.jsx";
import ViewSeekerProfile from "./pages/ViewSeekerProfile.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      // Auth Routes
      { path: "login", element: <UserSelectionPage /> },
      { path: "auth/selection", element: <SelectionPage /> },
      { path: "auth/login", element: <LoginPage /> },
      { path: "auth/signup", element: <SignupPage /> },
      { path: "auth/signup/jobSeeker/info", element: <JobSeekerForm /> },
      { path: "signup", element: <UserSelection_signup/> },
      // Job Seeker Profile/Dashboard
      { path: "jobSeeker/profile", element: <UserProfile /> },
      { path: "jobSeeker/dashboard", element: <JobSeekerDashboard /> },
      { path: "jobSeeker/findjobs", element: <FindJobsPage /> },
      { path: "jobSeeker/applications", element: <ApplicationsPage /> },
      { path: "jobSeeker/messages", element: <MessagesRoute /> },
      { path: "userprofile/:id", element: <UserProfile /> },
      { path: "view-seeker/:id", element: <ViewSeekerProfile /> },
      { path: "jobSeekerDashboard", element: <JobSeekerDashboard /> },
      { path: "RDashboard/:id", element: <RecruiterDashboard /> },
      { path: "findJobs", element: <FindJobsPage /> },
      { path: "postjob", element: <PostJobPage /> },
      { path: "/candidate/:id", element: <JobApplicationsPage /> },

      { path: "/re", element: <RecruiterForm/> },

      // Chat & Messaging
      { path: "chatbox", element: <ChatBox /> },
      { path: "chat", element: <ChatBox /> }, // ✅ This was missing!
      { path: "message", element: <MessagesRoute /> },
      { path: "application", element: <Application /> },
      { path: "dailywages", element: < DailyWageJobForm/> },
      { path: "dailywagesjobs", element: <DailyWageJobList/> },
      { path: "recprofile", element: <RecruiterProfile/> },
      // { path: "dailywage-applications", element: <DailyWageApplications/> },
      // { path: "dailywage-dashboard", element: <DailyWageDashboard/> }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
);
