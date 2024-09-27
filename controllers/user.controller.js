const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const auth = require("../middlewares/auth")
const checkAccess = require("../middlewares/checkAccess")

const User = require("../models/user.model");
const ROLES = require("../constants/roles");

// Only admin (get all the users)
router.get("/", auth, checkAccess(ROLES.admin), async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Register 
router.post("/register", async (req, res) => {
    try {
        const { username, password, role } = req.body;
        let newUser = await User.findOne({ username })

        if (newUser) {
            return res.status(400).json({ err: "User already exists!" });
        }

        const hashpassword = await bcrypt.hash(password, 10);
        newUser = new User({ username, password: hashpassword, role });
        const savedUser = await newUser.save();
        res.status(201).json({ message: "Registered successfully", savedUser })
    } catch (err) {
        return res.status(400).json({ err: err.message });
    }
})

// Login route
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ err: "User not found!" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ err: "Password is wrong!" })
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" })
        res.json({ token, message: "Logged in successfully!", userId: user._id })
    } catch (err) {
        return res.status(400).send(err);
    }
})



module.exports = router