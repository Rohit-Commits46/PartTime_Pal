// Central API URL configuration for the frontend
// VITE_API_URL is set as a Render environment variable in production
const API_URL = import.meta.env.VITE_API_URL || "__API_URL__";

export default API_URL;
