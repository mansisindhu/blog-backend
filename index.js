require('dotenv').config();

const express = require("express");
const app = express()
const cors = require('cors');

const connectDb = require("./config/db")

const userController = require("./controllers/user.controller")
const blogController = require("./controllers/blog.controller")

// Use CORS middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Connected")
})

app.use("/user", userController)
app.use("/blog", blogController)


const PORT = process.env.PORT
app.listen(process.env.PORT, async () => {
    await connectDb()
    console.log(`Listening to port: ${PORT}`)
})