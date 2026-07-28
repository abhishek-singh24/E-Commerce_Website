const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ---------------- Register (With Auto-Login) ----------------
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the plaintext password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message || "Database error" });
            }

            // ✅ AUTOMATIC LOGIN ENGINE: Build user profile data using the new row's ID
            // Defaulting role to 'user' for new signups
            const newUser = {
                id: result.insertId,
                name: name,
                email: email,
                role: "user" 
            };

            try {
                // Generate a fresh authentication token instantly
                const token = jwt.sign(
                    { id: newUser.id, role: newUser.role },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );

                // Send everything back to the frontend to trigger immediate login state
                return res.status(201).json({
                    message: "User Registered and Logged In Successfully",
                    token: token,
                    user: newUser
                });
            } catch (tokenError) {
                // Fallback: If token signing fails, the account is still created
                return res.status(201).json({
                    message: "User Registered Successfully, but auto-login failed. Please log in manually.",
                    user: newUser
                });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error during registration" });
    }
});

// ---------------- Login ----------------
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Search exclusively by email
    const sql = "SELECT * FROM users WHERE email = ?"; 
    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message || "Database error" });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const user = result[0];

        // Compare the submitted password against the hashed string
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        try {
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                message: "Login Successful",
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            return res.status(500).json({
                message: "Failed to generate JWT token",
                error: error.message
            });
        }
    });
});

module.exports = router;