const Product = require("../models/product-model");

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { category, productName, productImg, productPrice, productOrgPrice, productIntro, productDetail } = req.body;

        if (!category || !productName || !productImg || !productPrice || !productOrgPrice || !productIntro || !productDetail) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = new Product({
            category,
            productName,
            productImg,
            productPrice,
            productOrgPrice,
            productIntro,
            productDetail,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product created successfully", product: newProduct });

    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// Fetch products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({ category });

        if (!products.length) {
            return res.status(404).json({ message: "No products found for this category" });
        }

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};
