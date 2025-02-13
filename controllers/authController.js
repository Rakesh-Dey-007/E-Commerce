const userModel = require('../models/user-model');
const { adminData } = require('../models/owner-model');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');



module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) return res.status(401).send('You already have an account, please login.');

        bcrypt.genSalt(10, function (err, salt) {
            if (err) return res.send(err.message);

            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message);
                else {
                    let user = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                    });
                    let token = generateToken(user);
                    res.cookie('token', token);
                    console.log("User Created Successfully.");
                    res.redirect('/product/home');
                }
            });
        });
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
}



// module.exports.loginUser = async function (req, res) {
//     let { email, password } = req.body;

//     let user = await userModel.findOne({ email: email });
//     if (!user) return res.send("Email or password incorrect.");

//     bcrypt.compare(password, user.password, function (err, result) {
//         if (result) {
//             let token = generateToken(user);
//             res.cookie('token', token);
//             res.redirect('/product/home');
//             console.log('User login successfully.');
//         }
//         else {
//             return res.send('Email or Password incorrect.')
//         }
//     });
// };


module.exports.logout = function (req, res) {
    res.cookie("token", "");
    res.redirect('/');
};



module.exports.deleteUser = async function (req, res) {
    try {
        // Extract token from cookies
        const token = req.cookies.token;
        if (!token) return res.status(401).send('Unauthorized. No token provided.');

        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const email = decoded.email; // Extract email from decoded token

        if (!email) return res.status(400).send('Email is required.');

        // Find and delete the user
        let user = await userModel.findOneAndDelete({ email });

        if (!user) return res.status(404).send('User not found.');

        console.log(`User with email ${email} deleted successfully.`);
        res.clearCookie('token'); // Clear the token after deletion
        res.redirect('/'); // Redirect to intro page
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Internal Server Error');
    }
};








module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;

    // Trim the email and password to avoid issues with extra spaces
    email = email.trim();
    password = password.trim();

    // Check if the email belongs to the admin (use the predefined admin data)
    if (email === adminData.email) {
        try {
            // Compare the entered plain text password with the stored hashed password
            const isAdminPasswordValid = await bcrypt.compare(password, adminData.password);
            
            if (isAdminPasswordValid) {
                let token = generateToken(adminData); // Generate token for admin
                res.cookie('token', token);
                console.log('Admin login successful.');
                return res.redirect('/product/adminHome'); // Redirect to admin panel
            } else {
                console.log('Admin password mismatch.');
                return res.send('Email or Password incorrect.');
            }
        } catch (error) {
            console.log('Error during password comparison:', error);
            return res.send('Error during login. Please try again.');
        }
    }

    // If not admin, check for regular user
    let user = await userModel.findOne({ email: email });
    if (!user) return res.send("Email or password incorrect.");

    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = generateToken(user);
            res.cookie('token', token);
            console.log('User login successful.');
            return res.redirect('/product/home'); // Redirect to user panel
        } else {
            console.log('User password mismatch.');
            return res.send('Email or Password incorrect.');
        }
    });
};
