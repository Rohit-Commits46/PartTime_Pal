import axios from "axios";

export const axiosinstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});