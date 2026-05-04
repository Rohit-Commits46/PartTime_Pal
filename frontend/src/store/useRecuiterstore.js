import { create } from "zustand";  // Importing create from zustand
import toast from "react-hot-toast";
import { axiosinstance } from "../lib/axios";
import { useAuthstore } from "./useAuthstore.js";

export const useRecuiterstore = create((set, get) => ({
    jobsss:null,
    setJobs: (job) => set({ jobsss: job }),
    postjob: async (data) => {
        const authuser = useAuthstore.getState().authuser;
        
        if (!authuser || !authuser._id) {
            toast.error("User not authenticated!");
            console.error("Error: authuser is undefined or missing _id");
            return;
        }

        console.log("rec:");
        console.log(data);

        // Extracting values from the 'data' object
        const {
            title,
            tags,
            role,
            minSalary,
            maxSalary,
            vacancies,
            jobLevel,
            country,
            city,
            description
        } = data;

        console.log("Job Data to be posted:", data);

        try {
            const res = await axiosinstance.post(`/postjob/`, {
                recruiterId: authuser._id,  // Send recruiterId from the authuser
                title,
                tags,
                role,
                minSalary,
                maxSalary,
                vacancies,
                jobLevel,
                country,
                city,
                description
            });

            toast.success("Job posted successfully!");
        } catch (err) {
            console.error("Failed to post job:", err);
            toast.error("Failed to post job");
        }
    },
    getjobs: async (data) => {
        const authuser = useAuthstore.getState().authuser;
    
        if (!authuser || !authuser._id) {
            toast.error("User not authenticated!");
            console.error("Error: authuser is undefined or missing _id");
            return;
        }
    
        try {
            const response = await axios.get(`/postjob/${authuser.recruiterId}`);
            
            if (response.status === 200) {
                const jobs = response.data;
                // You can now use `jobs` or update a state/store with it
                console.log("Fetched jobs:", jobs);
                setJobs(jobs) ;
            } else {
                toast.error("Failed to fetch jobs!");
                console.error("Unexpected response:", response);
            }
        } catch (error) {
            toast.error("Something went wrong while fetching jobs!");
            console.error("Error fetching jobs:", error);
        }
    }
    
}));
