import { create } from "zustand";
import { axiosinstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import io from "socket.io-client";

const BASE_URL = "http://localhost:5000";

export const useAuthstore = create((set, get) => ({
  authuser: null,
  userType: null,
  isSigningup: false,
  islogin: false,
  isupdateprofile: false,
  ischeckingauth: true,
  OnlineUsers: [],
  socket: null,

  // ✅ Utility to set user manually
  setAuthuser: (user, userType = 'jobseeker') => {
    const storageKey = userType === 'recruiter' ? 'authuser_recruiter' : 'authuser_jobseeker';
    localStorage.setItem(storageKey, JSON.stringify(user));
    set({ authuser: user, userType });
    // get().connectSocket();
  },

  loadAuthuser: () => {
  const recruiterUser = localStorage.getItem('authuser_recruiter');
  const jobseekerUser = localStorage.getItem('authuser_jobseeker');

  let storedUser = recruiterUser || jobseekerUser;

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      set({ authuser: parsedUser });
      get().connectSocket();
    } catch (err) {
      console.error('Invalid JSON in authuser:', err);
    }
  }
}
,
  clearAuthuser: () => {
    // Clear both storage keys
    localStorage.removeItem('authuser_jobseeker');
    localStorage.removeItem('authuser_recruiter');
    localStorage.removeItem('authuser'); // Legacy key
    set({ authuser: null, userType: null });
  },

  logout: () => {
    const { userType } = get();
    const storageKey = userType === 'recruiter' ? 'authuser_recruiter' : 'authuser_jobseeker';
    localStorage.removeItem(storageKey);
    localStorage.removeItem('authuser_recruiter'); // Legacy key
    localStorage.removeItem('authuser_jobseeker'); // Legacy key
    set({ authuser: null, userType: null });
    get().disconnectSocket();
  },
  // ✅ SIGN UP
  signup: async (data) => {
    set({ isSigningup: true });
    try {
      const resp = await axiosinstance.post("/auth/signup", data, {
        headers: { "Content-Type": "application/json" },
      });

      set({ authuser: resp.data });
      toast.success("Account created successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningup: false });
    }
  },

  // ✅ LOGIN
  login: async (data) => {
    set({ islogin: true });
    try {
      console.log(data);
      
      const resp = await axiosinstance.post("/jobseekers/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Login response:", resp.data);
      localStorage.setItem("authuser_jobseeker", JSON.stringify(resp.data.userdata)); // ✅ Separate key for jobseekers
      
      set({ authuser: resp.data.userdata, userType: 'jobseeker' });
      console.log("✅ Stored authuser in Zustand:", get().authuser);

      get().connectSocket();
      toast.success("Logged in successfully");
    } catch (error) {
      console.log("❌ Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ islogin: false });
    }
  },
  loginrec: async (data) => {
    set({ islogin: true });
    try {
      console.log(data);
      
      const resp = await axiosinstance.post("/rec/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Login response:", resp.data);
      const userData = resp.data.userdata;

      localStorage.setItem("authuser_recruiter", JSON.stringify(userData)); // ✅ Separate key for recruiters
      set({ authuser: userData, userType: 'recruiter' });
      
      console.log("✅ Stored authuser in Zustand:", get().authuser);

      get().connectSocket();
      toast.success("Logged in successfully");
    } catch (error) {
      console.log("❌ Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ islogin: false });
    }
  },

  // ✅ SOCKET CONNECTION
  connectSocket: () => {
    const { authuser, socket } = get();
    if (!authuser || socket?.connected) return;
    console.log("1");
      // git  
    const newSocket = io(BASE_URL, {
   
      query: {
        userId: authuser._id,
      },
    });

    newSocket.connect();

    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ OnlineUsers: userIds });
      console.log(OnlineUsers);
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) socket.disconnect();
  },
}));
