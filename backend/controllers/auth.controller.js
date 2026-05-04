import User from "../database/user.model.js";

export const signup = async (req, res) => {
    console.log("Received request body:", req.body); // Debugging Line

    const { firstname, lastname, email, password } = req.body;

    try {
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const newUser = new User({
            firstname,
            lastname,
            email,
            password
        });

        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email
        });

    } catch (err) {
        console.error("Error in signup:", err);
        res.status(500).json({ message: err.message });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPassValid = password === user.password; // ✅ No hashing, direct comparison
        if (!isPassValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log("User found:", user);
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
