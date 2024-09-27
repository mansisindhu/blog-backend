const express = require('express');
const Blog = require('../models/blog.model');
const router = express.Router();
const auth = require("../middlewares/auth")
const checkAccess = require("../middlewares/checkAccess");
const ROLES = require('../constants/roles');

// 1. Get all blogs (everyone) -> no need of authentication/login
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().populate("author", "username")
        res.json(blogs)
    } catch (err) {
        res.status(500).send(err)
    }
})

// 2. Create a new blog (author) -> yes authentication is required, role = author
router.post("/create", auth, checkAccess(ROLES.author), async (req, res) => {
    const { title, content } = req.body;
    try {
        const blog = new Blog({ title, content, author: req.user._id });
        const savedBlog = await blog.save();
        res.json(savedBlog)
    } catch (err) {
        res.status(400).send(err)
    }
})

// 3. Edit a blog (author their own blog)
router.patch("/update/:id", auth, checkAccess(ROLES.author), async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);

        // When blog id is not valid!
        if (!blog) {
            return res.status(404).json({ message: "Not found" })
        }

        // When user is trying to update someone else's blog
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access Denied! Not your blog!" })
        }

        const updatedBlog = await Blog.findByIdAndUpdate(blogId, req.body, { new: true })
        res.json(updatedBlog)
    } catch (err) {
        res.status(400).send(err)
    }
})

// 4. Delete a blog (author their own blog/admin)
router.delete("/delete/:id", auth, checkAccess(ROLES.author), async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);

        // When blog id is not valid!
        if (!blog) {
            return res.status(404).json({ message: "Not found" })
        }

        // When user is trying to delete someone else's blog
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access Denied!" })
        }

        await Blog.findByIdAndDelete(blogId)
        res.json({ message: "Deleted successfully!" })
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router