const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const auth = async (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send("Access denied. No token provided!")
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await UserModel.findById(decoded._id);
        next()
    } catch (err) {
        res.status(400).send("Invalid token")
    }
}

module.exports = auth