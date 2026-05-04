const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: require("path").join(__dirname, "..", ".env") });

const url = process.env.MONGODBURL || "mongodb://localhost:27017/PathTimeJobFinder";

const Job = require("../database/postjob.model");

const sampleJobs = [
  {
    jobId: "job-001",
    recid: "rec-sample-001",
    title: "Part-Time Barista",
    description: "We are looking for a friendly and energetic barista to join our café team. You will prepare coffee beverages, handle the cash register, and maintain a clean workspace.",
    requirements: ["Customer service experience", "Ability to work weekends"],
    type: "Part-Time",
    category: "Food & Beverage",
    slug: "part-time-barista-bangalore",
    tags: ["barista", "coffee", "café", "food service"],
    duration: "6 months",
    skills: ["Communication", "Teamwork", "Multitasking"],
    vacancies: 3,
    salary: { amount: 12000, currency: "INR", frequency: "monthly" },
    preferredTime: { start: "08:00", end: "14:00" },
    location: { city: "Bangalore", area: "Koramangala" },
    employer: { name: "Brew Haven Café", contact: "brew@example.com", phone: "9876543210", owner: "Arjun Mehta" },
    schedule: { shifts: ["Morning"], days: ["Monday", "Tuesday", "Wednesday", "Saturday", "Sunday"] },
    latitude: 12.9352,
    longitude: 77.6245,
    createdAt: new Date(),
  },
  {
    jobId: "job-002",
    recid: "rec-sample-001",
    title: "Freelance Graphic Designer",
    description: "Design social media posts, banners, and marketing materials for a growing e-commerce brand. Work remotely on your own schedule.",
    requirements: ["Proficiency in Figma or Canva", "Portfolio required"],
    type: "Freelance",
    category: "Design",
    slug: "freelance-graphic-designer-mumbai",
    tags: ["design", "graphic design", "remote", "freelance"],
    duration: "3 months",
    skills: ["Figma", "Canva", "Adobe Photoshop", "Creativity"],
    vacancies: 2,
    salary: { amount: 20000, currency: "INR", frequency: "monthly" },
    preferredTime: { start: "10:00", end: "16:00" },
    location: { city: "Mumbai", area: "Andheri" },
    employer: { name: "ShopEasy India", contact: "hr@shopeasy.com", phone: "9123456789", owner: "Priya Sharma" },
    schedule: { shifts: ["Flexible"], days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    latitude: 19.1136,
    longitude: 72.8697,
  },
  {
    jobId: "job-003",
    recid: "rec-sample-002",
    title: "Weekend Delivery Driver",
    description: "Deliver packages within the city on weekends. Must have own two-wheeler and valid license.",
    requirements: ["Valid driving license", "Own two-wheeler", "Smartphone with GPS"],
    type: "Part-Time",
    category: "Delivery & Logistics",
    slug: "weekend-delivery-driver-hyderabad",
    tags: ["delivery", "driver", "weekend", "logistics"],
    duration: "Ongoing",
    skills: ["Navigation", "Time management", "Physical fitness"],
    vacancies: 5,
    salary: { amount: 8000, currency: "INR", frequency: "monthly" },
    preferredTime: { start: "09:00", end: "18:00" },
    location: { city: "Hyderabad", area: "Madhapur" },
    employer: { name: "QuickDrop Logistics", contact: "jobs@quickdrop.in", phone: "9988776655", owner: "Rajesh Kumar" },
    schedule: { shifts: ["Morning", "Afternoon"], days: ["Saturday", "Sunday"] },
    latitude: 17.4486,
    longitude: 78.3908,
  },
  {
    jobId: "job-004",
    recid: "rec-sample-002",
    title: "Data Entry Operator",
    description: "Enter and verify data from physical documents into our internal system. Flexible hours, can be done from home.",
    requirements: ["Fast typing speed (40+ WPM)", "Attention to detail"],
    type: "Part-Time",
    category: "Admin & Office",
    slug: "data-entry-operator-delhi",
    tags: ["data entry", "typing", "remote", "office"],
    duration: "2 months",
    skills: ["MS Excel", "Typing", "Data accuracy"],
    vacancies: 4,
    salary: { amount: 10000, currency: "INR", frequency: "monthly" },
    preferredTime: { start: "10:00", end: "15:00" },
    location: { city: "Delhi", area: "Connaught Place" },
    employer: { name: "DataWorks Solutions", contact: "hire@dataworks.in", phone: "9876501234", owner: "Sneha Gupta" },
    schedule: { shifts: ["Morning", "Afternoon"], days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    latitude: 28.6315,
    longitude: 77.2167,
  },
  {
    jobId: "job-005",
    recid: "rec-sample-003",
    title: "Part-Time Yoga Instructor",
    description: "Conduct morning yoga sessions at our wellness studio. Certified yoga trainers preferred.",
    requirements: ["Yoga certification", "Minimum 1 year teaching experience"],
    type: "Part-Time",
    category: "Health & Fitness",
    slug: "part-time-yoga-instructor-pune",
    tags: ["yoga", "fitness", "instructor", "wellness"],
    duration: "Ongoing",
    skills: ["Yoga", "Communication", "Patience"],
    vacancies: 2,
    salary: { amount: 15000, currency: "INR", frequency: "monthly" },
    preferredTime: { start: "06:00", end: "09:00" },
    location: { city: "Pune", area: "Koregaon Park" },
    employer: { name: "ZenFit Studio", contact: "info@zenfit.in", phone: "9012345678", owner: "Ananya Desai" },
    schedule: { shifts: ["Morning"], days: ["Monday", "Wednesday", "Friday", "Saturday"] },
    latitude: 18.5362,
    longitude: 73.8939,
  },
  {
    jobId: "job-006",
    recid: "rec-sample-003",
    title: "Content Writer - Part-Time",
    description: "Write engaging blog posts, articles, and web copy for our tech startup. SEO knowledge is a plus.",
    requirements: ["Excellent English writing skills", "SEO basics"],
    type: "Part-Time",
    category: "Writing & Content",
    slug: "content-writer-part-time-chennai",
    tags: ["writing", "content", "blog", "SEO", "remote"],
    duration: "4 months",
    skills: ["Creative writing", "SEO", "Research", "WordPress"],
    vacancies: 2,
    salary: { amount: 18000, currency: "INR", frequency: "monthly" },
    preferredTime: { start: "11:00", end: "17:00" },
    location: { city: "Chennai", area: "T. Nagar" },
    employer: { name: "TechBuzz Media", contact: "careers@techbuzz.in", phone: "9871234560", owner: "Karthik Rajan" },
    schedule: { shifts: ["Afternoon"], days: ["Monday", "Tuesday", "Thursday", "Friday"] },
    latitude: 13.0418,
    longitude: 80.2341,
  },
  {
    jobId: "job-007",
    recid: "rec-sample-004",
    title: "Retail Sales Associate",
    description: "Assist customers in our electronics store, manage inventory, and handle billing during evening shifts.",
    requirements: ["Good communication skills", "Basic knowledge of electronics"],
    type: "Part-Time",
    category: "Retail & Sales",
    slug: "retail-sales-associate-bangalore",
    tags: ["retail", "sales", "electronics", "evening"],
    duration: "Ongoing",
    skills: ["Sales", "Customer service", "Inventory management"],
    vacancies: 3,
    salary: { amount: 11000, currency: "INR", frequency: "monthly" },
    preferredTime: { start: "16:00", end: "21:00" },
    location: { city: "Bangalore", area: "MG Road" },
    employer: { name: "TechMart Electronics", contact: "jobs@techmart.in", phone: "9765432100", owner: "Vikram Shetty" },
    schedule: { shifts: ["Evening"], days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
    latitude: 12.9758,
    longitude: 77.6066,
  },
  {
    jobId: "job-008",
    recid: "rec-sample-004",
    title: "Online Tutor - Mathematics",
    description: "Teach mathematics online to students in classes 8-12. Flexible scheduling and work from home.",
    requirements: ["Degree in Mathematics or Engineering", "Teaching experience preferred"],
    type: "Part-Time",
    category: "Education & Tutoring",
    slug: "online-tutor-mathematics-remote",
    tags: ["tutor", "mathematics", "online", "education", "remote"],
    duration: "6 months",
    skills: ["Mathematics", "Teaching", "Patience", "Zoom/Google Meet"],
    vacancies: 4,
    salary: { amount: 16000, currency: "INR", frequency: "monthly" },
    preferredTime: { start: "17:00", end: "20:00" },
    location: { city: "Remote", area: "Work from Home" },
    employer: { name: "LearnSmart Academy", contact: "tutors@learnsmart.in", phone: "9654321098", owner: "Deepak Joshi" },
    schedule: { shifts: ["Evening"], days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    latitude: 28.7041,
    longitude: 77.1025,
  },
  {
    jobId: "job-009",
    recid: "rec-sample-005",
    title: "Event Photography Assistant",
    description: "Assist the lead photographer at weddings and corporate events. Great opportunity to build your portfolio.",
    requirements: ["Own DSLR camera", "Basic photography skills"],
    type: "Freelance",
    category: "Photography & Media",
    slug: "event-photography-assistant-mumbai",
    tags: ["photography", "events", "wedding", "freelance"],
    duration: "Ongoing",
    skills: ["Photography", "Lightroom", "Photo editing"],
    vacancies: 2,
    salary: { amount: 5000, currency: "INR", frequency: "daily" },
    preferredTime: { start: "10:00", end: "22:00" },
    location: { city: "Mumbai", area: "Bandra" },
    employer: { name: "ClickPerfect Studios", contact: "work@clickperfect.in", phone: "9543210987", owner: "Rahul Nair" },
    schedule: { shifts: ["Morning", "Afternoon", "Evening"], days: ["Saturday", "Sunday"] },
    latitude: 19.0596,
    longitude: 72.8295,
  },
  {
    jobId: "job-010",
    recid: "rec-sample-005",
    title: "Social Media Manager - Part-Time",
    description: "Manage Instagram and LinkedIn accounts for a fashion brand. Create posts, respond to comments, and grow the audience.",
    requirements: ["Social media marketing experience", "Knowledge of Instagram and LinkedIn"],
    type: "Part-Time",
    category: "Marketing",
    slug: "social-media-manager-part-time-delhi",
    tags: ["social media", "marketing", "instagram", "linkedin", "fashion"],
    duration: "3 months",
    skills: ["Social media management", "Content creation", "Analytics", "Copywriting"],
    vacancies: 1,
    salary: { amount: 22000, currency: "INR", frequency: "monthly" },
    preferredTime: { start: "10:00", end: "14:00" },
    location: { city: "Delhi", area: "Hauz Khas" },
    employer: { name: "StyleVogue Fashion", contact: "social@stylevogue.in", phone: "9432109876", owner: "Isha Malhotra" },
    schedule: { shifts: ["Morning"], days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    latitude: 28.5494,
    longitude: 77.2001,
  },
];

async function seedJobs() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing sample jobs (optional, avoids duplicates on re-run)
    const existingIds = sampleJobs.map((j) => j.jobId);
    await Job.deleteMany({ jobId: { $in: existingIds } });
    console.log("🗑️  Cleared previous sample jobs (if any)");

    // Add createdAt to all jobs (the model default is broken - has string instead of function)
    const jobsWithDates = sampleJobs.map((job) => ({ ...job, createdAt: new Date() }));

    // Insert sample jobs
    const result = await Job.insertMany(jobsWithDates);
    console.log(`🎉 Successfully inserted ${result.length} sample jobs!`);

    result.forEach((job) => {
      console.log(`   - ${job.title} (${job.location.city})`);
    });

    await mongoose.disconnect();
    console.log("\n✅ Done! You can now search for jobs in the app.");
  } catch (error) {
    console.error("❌ Error seeding jobs:", error.message);
    process.exit(1);
  }
}

seedJobs();
