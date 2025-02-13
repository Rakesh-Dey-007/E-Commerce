const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const Product = require("../models/product-model");

// Render product page with empty products initially
router.get("/", (req, res) => {
  res.render("product_format", { products: [], selectedCategory: null });
});

router.get("/adminProductPage", (req, res) => {
  res.render("adminProductPage", { products: [], selectedCategory: null });
});

// Home and admin home routes
router.get("/home", (req, res) => {
  res.render("home");
});

router.get("/adminHome", (req, res) => {
  res.render("adminHome");
});

// Fetch products by category
router.get("/category/:category", async (req, res) => {
  try {
    const selectedCategory = req.params.category; // Get category from URL
    // console.log("Selected Category:", selectedCategory); // Debugging log

    const products = await Product.find({ category: selectedCategory });
    // console.log("Fetched Products:", products); // Debugging log

    if (!products.length) {
      return res.render("product_format", { products: [], selectedCategory });
    }

    res.render("product_format", { products, selectedCategory });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/admin/category/:category", async (req, res) => {
  try {
    const selectedCategory = req.params.category; // Get category from URL
    // console.log("Selected Category:", selectedCategory); // Debugging log

    const products = await Product.find({ category: selectedCategory });
    // console.log("Fetched Products:", products); // Debugging log

    if (!products.length) {
      return res.render("adminProductPage", { products: [], selectedCategory });
    }

    res.render("adminProductPage", { products, selectedCategory });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server Error");
  }
});


router.get("/update/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("updateProduct", { product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server Error");
  }
});


router.post("/update/:id", async (req, res) => {
  const { category, productName, productImg, productPrice, productOrgPrice, productIntro, productDetail } = req.body;

  try {
    await Product.findByIdAndUpdate(req.params.id, {
      category,
      productName,
      productImg,
      productPrice,
      productOrgPrice,
      productIntro,
      productDetail
    });

    res.redirect("/product/adminHome"); // Redirect to admin product page
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/product/adminHome");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to show product details for users
router.get("/detail/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("detail", { product });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Route to add a product to the cart
router.post("/addToCart/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Check if product is already in cart
    const existingProduct = req.session.cart.find((item) => item._id == product._id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      req.session.cart.push({ ...product.toObject(), quantity: 1 });
    }

    res.redirect("/product/addCart");
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to view the cart
router.get("/addCart", (req, res) => {
  res.render("addCart", { cart: req.session.cart || [] });
});

// Route to remove a product from the cart
router.get("/removeFromCart/:index", (req, res) => {
  if (req.session.cart && req.session.cart.length > 0) {
    req.session.cart.splice(req.params.index, 1);
  }
  res.redirect("/product/addCart");
});

// Place order and pass ordered product details to order.ejs
router.post("/placeOrder", (req, res) => {
  return res.redirect("/product/home");
});

router.get("/placeOrder/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("payment", { product });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).send("Internal Server Error");
  }
});




// Create a new product
router.post("/addProduct", productController.createProduct);

module.exports = router;
