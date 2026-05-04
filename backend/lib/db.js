const mongoose = require("mongoose");


export const connectdb = async () => {
    try {
        const con = await mongoose.connect("mongodb://localhost:27017/ptf", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB locally");
    } catch (err) {
        console.error("Error in MongoDB connection:", err);
    }
};
