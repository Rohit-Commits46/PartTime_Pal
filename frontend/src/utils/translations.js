export const translations = {
  en: {
    // Navbar translations
    findJobs: "Find Jobs",
    postJob: "Post a Job",
    login: "Login",
    signup: "Sign Up",
    dashboard: "Dashboard",
    applications: "Applications",
    candidates: "Candidates",
    messages: "Messages",
    myProfile: "My Profile",
    logout: "Log out",
    jobSeeker: "Job Seeker",
    recruiter: "Recruiter",
    employed: "Employed",
    jobSeeking: "Job Seeking",
    resumeUploaded: "Resume uploaded",
    profileStatus: "Profile Status:",
    // Common UI elements
    search: "Search",
    filter: "Filter",
    apply: "Apply",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    back: "Back",
    next: "Next",
    previous: "Previous",
    loading: "Loading...",
    error: "Error",
    success: "Success"
  },
  hi: {
    // Navbar translations
    findJobs: "नौकरी खोजें",
    postJob: "नौकरी पोस्ट करें",
    login: "लॉगिन",
    signup: "साइन अप",
    dashboard: "डैशबोर्ड",
    applications: "आवेदन",
    candidates: "उम्मीदवार",
    messages: "संदेश",
    myProfile: "मेरी प्रोफ़ाइल",
    logout: "लॉग आउट",
    jobSeeker: "नौकरी चाहने वाला",
    recruiter: "भर्तीकर्ता",
    employed: "नियोजित",
    jobSeeking: "नौकरी की तलाश",
    resumeUploaded: "रिज्यूमे अपलोड किया गया",
    profileStatus: "प्रोफ़ाइल स्थिति:",
    // Common UI elements
    search: "खोजें",
    filter: "फिल्टर",
    apply: "आवेदन करें",
    save: "सेव करें",
    cancel: "रद्द करें",
    submit: "जमा करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    view: "देखें",
    back: "वापस",
    next: "अगला",
    previous: "पिछला",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता"
  }
};

export const getTranslation = (key, language = 'en') => {
  return translations[language]?.[key] || translations.en[key] || key;
};
