const express = require('express');
const router = express.Router();
const userModel = require("../models/user-model");
const { genSalt } = require('bcrypt');
const generateToken = require('../utils/generateToken');
const { registerUser, loginUser, deleteUser, logout } = require('../controllers/authController');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');


// router.set('view engine', 'ejs');
// router.set('views', path.join(__dirname, 'views'));

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/delete', deleteUser);

router.get('/logout', logout);

// Profile route
router.get('/profile', async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/'); // Redirect to login if not logged in
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_KEY); // Use the appropriate secret or key
        const { email } = decoded;

        // Retrieve user data using email number
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Pass user data to the profile page
        res.render('profile', { user });
    } catch (error) {
        console.error('Error in profile route:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Profile Edit - GET (Show user data in the form)
router.get('/profileEdit', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.redirect('/register');

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) return res.status(404).send('User not found');

        res.render('profileEdit', { user });
    } catch (error) {
        console.error('Error in profileEdit GET route:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Profile Edit - POST (Update user details)
router.post('/profileUpdate', upload.single('profileImage'), async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.redirect('/register');

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) return res.status(404).send('User not found');

        const { fullname, username, mobile, address, age } = req.body;
        const profileImage = req.file ? req.file.filename : user.profileImage; // Keep existing image if not updated

        user.fullname = fullname;
        user.username = username;
        user.mobile = mobile;
        user.address = address;
        user.age = age;
        user.profileImage = profileImage;

        await user.save();
        res.redirect('/user/profile');
    } catch (error) {
        console.error('Error in profileEdit POST route:', error);
        res.status(500).send('Internal Server Error');
    }
});


// 🔹 DELETE Route: Remove user by email
router.delete('/delete', async (req, res) => {
    try {
        const { email } = req.body; // Get email from request body

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const deletedUser = await User.findOneAndDelete({ email });

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: `User with email ${email} deleted successfully.` });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
