const mongoose = require("mongoose");
const mongoUri = process.env.MONGO_URI;

module.exports = async () => {
    return await mongoose.connect(mongoUri)
        .then(() => {
            console.log("Connected to MongoDB")
        })
        .catch(err => console.log("Error connecting", err));
}
