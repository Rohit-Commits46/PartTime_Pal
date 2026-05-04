import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "__API_URL__";

export const axiosinstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});