const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const Product = require("../models/Product");
const { Order } = require("../models/Order");
const { upload } = require("../middleware/upload");
const { sendCustomOrderProviderEmail } = require("../services/providerEmail");

const router = express.Router();

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

router.post("/predefined", async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must include at least one item." });
    }

    const productIds = items.map((item) => item.productId);
    const foundProducts = await Product.find({ id: { $in: productIds } }).lean();
    const productsById = new Map(foundProducts.map((entry) => [entry.id, entry]));

    const normalizedItems = [];
    let total = 0;

    for (const item of items) {
      const product = productsById.get(item.productId);
      const quantity = toNumber(item.quantity, 0);

      if (!product || quantity <= 0) {
        return res.status(400).json({ message: "Invalid product item in order." });
      }

      const lineTotal = Number((product.price * quantity).toFixed(2));
      total += lineTotal;
      normalizedItems.push({
        productId: product.id,
        name: product.name,
        material: product.material,
        unitPrice: product.price,
        quantity,
        lineTotal
      });
    }

    const order = await Order.create({
      type: "predefined",
      status: "Pending",
      customer,
      items: normalizedItems,
      total: Number(total.toFixed(2))
    });

    return res.status(201).json({
      message: "Predefined order submitted successfully.",
      order: order.toJSON()
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit predefined order.", error: error.message });
  }
});

router.post("/custom", upload.single("modelFile"), async (req, res) => {
  const uploadedFilePath = req.file?.path;

  try {
    const externalFileLink = String(req.body.externalFileLink || "").trim();
    if (!req.file && !externalFileLink) {
      return res.status(400).json({ message: "Provide either a model file upload or an external file link." });
    }

    const {
      material,
      color,
      infill,
      layerHeight,
      quantity,
      notes,
      estimatedPrice,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress
    } = req.body;

    if (!material || !color || !quantity || !layerHeight) {
      return res.status(400).json({
        message: "Missing required custom order fields."
      });
    }

    const customConfig = {
      material,
      color,
      infill: toNumber(infill, 20),
      layerHeight: toNumber(layerHeight, 0.2),
      quantity: toNumber(quantity, 1),
      notes: notes || ""
    };

    const order = await Order.create({
      type: "custom",
      status: "Pending",
      customer: {
        name: customerName || "",
        email: customerEmail || "",
        phone: customerPhone || "",
        shippingAddress: shippingAddress || ""
      },
      customConfig,
      estimatedPrice: toNumber(estimatedPrice, 0),
      file: {
        originalName: req.file?.originalname || "",
        storedName: req.file?.filename || "",
        size: req.file?.size || 0,
        externalLink: externalFileLink || "",
        source: req.file ? "upload" : "link"
      }
    });

    const plainOrder = order.toJSON();

    let providerEmailStatus = { sent: false, reason: "Unknown" };
    try {
      providerEmailStatus = await sendCustomOrderProviderEmail({
        order: plainOrder,
        localFilePath: uploadedFilePath
      });
    } catch (emailError) {
      providerEmailStatus = { sent: false, reason: emailError.message };
    }

    return res.status(201).json({
      message: providerEmailStatus.sent
        ? "Custom order submitted and provider notified by email."
        : "Custom order submitted. Provider email was not sent.",
      order: plainOrder,
      providerEmailStatus
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit custom order.", error: error.message });
  } finally {
    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath);
      } catch {
        // Ignore cleanup errors.
      }
    }
  }
});

module.exports = router;
