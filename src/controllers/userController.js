const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
// You should import your database pool here, e.g.:
// const pool = require('../config/db');

// Login controller
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }
        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign(
            { userId: user.id, role: user.role, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: "6h" }
        );
        res.json({ token, role: user.role, is_admin: user.is_admin });
    } catch (error) {
        console.error("❌ Error in login:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Register controller
const registerUser = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        const pendingUser = await pool.query("SELECT * FROM unapproved_users WHERE email = $1", [email]);
        if (pendingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already registered, awaiting KYC approval" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO unapproved_users (email, password, role) VALUES ($1, $2, $3)",
            [email, hashedPassword, role]
        );
        res.status(201).json({ message: "User registered. KYC pending approval." });
    } catch (error) {
        console.error("❌ Error in registration:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    loginUser,
    registerUser
};