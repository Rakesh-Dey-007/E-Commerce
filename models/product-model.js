const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    category: { type: String, required: true },
    productName: { type: String, required: true },
    productImg: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productOrgPrice: { type: Number, required: true },
    productIntro: { type: String, required: true },
    productDetail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
