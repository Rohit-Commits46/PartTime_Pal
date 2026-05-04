const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const postjobroutes =require( "./routes/postjobroutes.js")

const route = require('./routes/route');
// const authroutes = require('./routes/authroutes');
const {connectDB}=require('./connection/db')    
connectDB(); 
const seekerRoute=require('./routes/seeker')
const recRoute=require('./routes/rec')
const acceptroute=require("./routes/acceptroutes.js")
const messageroutes = require('./routes/messageroutes');
// const postjobroutes = require('./routes/postjobroutes');
const { app, server } = require('./lib/socketio'); // Assuming socketio.js uses CommonJS too
// const seekerRoute =require("./routes/seeker")
// ✅ Fix: Proper CORS Configuration
app.use(cors({ 
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true, // Allow cookies/sessions
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// ✅ Fix: Explicitly Handle Preflight Requests
app.options("*", cors());

// Routes
app.use('/', route);
// app.use("/api/auth", authroutes);
app.use("/api/message", messageroutes);
// app.use("/api/postjob", postjobroutes);
app.use('/api/jobseekers',seekerRoute);
app.use('/api/rec',recRoute);
app.use("/api/postjob", postjobroutes);
app.use("/api/jobs", postjobroutes); // Add jobs route for finding jobs
app.use("/api/accept", acceptroute);


const PORT = 5000;

// ✅ Ensure DB Connection Before Starting Server
    server.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
