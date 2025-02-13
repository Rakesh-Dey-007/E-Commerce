// owner-model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Predefined admin details
const adminData = {
    fullname: 'Rakesh Dey',
    username: '@RD',
    email: 'admin_rd@gmail.com',
    mobile: '7001584784',
    address: 'Purba Bardhaman, India',
    password: '$2b$10$58RPReRFPTdt3wcIaJoyAOPw4DcIiE.aPOTAREIMnEZ.2JDagF/6m', // Will be populated after hashing
};

// Hash the password before storing it
bcrypt.hash('Rakesh.D@2004', 10, (err, hashedPassword) => {
    if (err) throw err;
    adminData.password = hashedPassword; // Store the hashed password
});

// Export model and functions
module.exports = { adminData };
