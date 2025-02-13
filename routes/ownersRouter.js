const express = require('express');
const router = express.Router();
const env = require('dotenv');
const ownerModel = require("../models/owner-model");
const {loginUser, logout } = require('../controllers/authController');
const generateToken = require('../utils/generateToken');
const { createProduct } = require("../controllers/productController");
const Product = require('../models/product-model');




router.post("/addProduct", async (req, res) => {
    const { category, productName, productImg, productPrice, productOrgPrice, productIntro, productDetail } = req.body;

    try {
        // Ensure category is provided
        if (!category) {
            throw new Error("Category is required.");
        }

        // Save the product data to the database
        await Product.create({
            category,
            productName,
            productImg,
            productPrice,
            productOrgPrice,
            productIntro,
            productDetail
        });

        res.redirect(`/Product/admin/category/${encodeURIComponent(category)}`); 
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.get("/adminProductPage", (req, res) => {
    res.render("adminProductPage", { products: [], selectedCategory: null });
});


router.get("/addProduct", (req, res) => {
    const selectedCategory = req.query.category || ""; // Get category from query parameters if available
    res.render("addProduct", { selectedCategory });
  });

router.get('/', (req, res) => {
    res.render('intro')
});


router.get('/dashboard', (req, res) => {
    res.render('admin-dashboard');
});

router.get('/addProduct', (req, res) => {
    res.render('addProduct');
});

router.post('/login', loginUser);

router.get('/logout', logout);



module.exports = router;