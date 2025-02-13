// const mongoose = require('mongoose');
// const config = require('config');

// const dbgr = require("debug")("development:mongoose");



// // Connect to MongoDB
// mongoose
//     .connect(`${config.get("MONGODB_URI")}/BagShop`)
//     .then(() => dbgr("Connected."))
//     .catch((err) => dbgr(err));



// module.exports = mongoose.connection;


const mongoose = require("mongoose");
const config = require("config");
const debug = require("debug")("development:mongoose");

// Determine the correct MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || config.get("MONGODB_URI");

// Connect to MongoDB (Deployment Ready)
mongoose
    .connect(`${MONGODB_URI}/BagShop`)
    .then(() => debug("MongoDB Connected Successfully."))
    .catch((err) => {
        debug("MongoDB Connection Error:", err);
        process.exit(1); // Exit if DB connection fails
    });

module.exports = mongoose.connection;
