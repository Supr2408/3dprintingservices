const express = require("express");
const { Order, VALID_STATUSES } = require("../models/Order");

const router = express.Router();

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders.", error: error.message });
  }
});

router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}.`
      });
    }

    const updated = await Order.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({
      message: "Order status updated successfully.",
      order: updated
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order status.", error: error.message });
  }
});

module.exports = router;
