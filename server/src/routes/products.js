const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    if (category) {
      const filtered = await Product.find({
        category: new RegExp(`^${String(category).trim()}$`, "i")
      })
        .lean()
        .sort({ id: 1 });
      return res.status(200).json(filtered);
    }

    const products = await Product.find({}).lean().sort({ id: 1 });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products.", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch product.", error: error.message });
  }
});

module.exports = router;
