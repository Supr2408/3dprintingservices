const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const VALID_STATUSES = ["Pending", "Printing", "Shipped"];

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true
    },
    type: {
      type: String,
      enum: ["predefined", "custom"],
      required: true
    },
    status: {
      type: String,
      enum: VALID_STATUSES,
      default: "Pending",
      index: true
    },
    customer: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      shippingAddress: { type: String, default: "" }
    },
    items: [
      {
        productId: { type: String, default: "" },
        name: { type: String, default: "" },
        material: { type: String, default: "" },
        unitPrice: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
        lineTotal: { type: Number, default: 0 }
      }
    ],
    total: {
      type: Number,
      default: 0
    },
    customConfig: {
      material: { type: String, default: "" },
      color: { type: String, default: "" },
      infill: { type: Number, default: 20 },
      layerHeight: { type: Number, default: 0.2 },
      quantity: { type: Number, default: 1 },
      notes: { type: String, default: "" }
    },
    estimatedPrice: {
      type: Number,
      default: 0
    },
    file: {
      originalName: { type: String, default: "" },
      storedName: { type: String, default: "" },
      size: { type: Number, default: 0 },
      externalLink: { type: String, default: "" },
      source: { type: String, default: "" }
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret._id;
        return ret;
      }
    }
  }
);

module.exports = {
  Order: mongoose.model("Order", orderSchema),
  VALID_STATUSES
};
