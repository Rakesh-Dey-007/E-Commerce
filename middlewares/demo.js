// Define the middleware function

const express = require('express');

const demoMiddleware = (req, res, next) => {
    console.log('Demo middleware executed');
    next();
};

module.exports = demoMiddleware;