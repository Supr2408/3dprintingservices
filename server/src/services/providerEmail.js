const nodemailer = require("nodemailer");

const getMailerConfig = () => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    PROVIDER_ORDER_EMAIL
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !PROVIDER_ORDER_EMAIL) {
    return null;
  }

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    from: SMTP_FROM || SMTP_USER,
    to: PROVIDER_ORDER_EMAIL
  };
};

const buildTextBody = ({ order }) => {
  const customer = order.customer || {};
  const config = order.customConfig || {};
  const file = order.file || {};

  return [
    "New custom order received",
    "",
    `Order ID: ${order.id}`,
    `Created At: ${order.createdAt}`,
    `Status: ${order.status}`,
    "",
    "Customer details",
    `Name: ${customer.name || "N/A"}`,
    `Email: ${customer.email || "N/A"}`,
    `Phone: ${customer.phone || "N/A"}`,
    `Shipping Address: ${customer.shippingAddress || "N/A"}`,
    "",
    "Print configuration",
    `Material: ${config.material || "N/A"}`,
    `Color: ${config.color || "N/A"}`,
    `Infill: ${config.infill ?? "N/A"}`,
    `Layer Height: ${config.layerHeight ?? "N/A"}`,
    `Quantity: ${config.quantity ?? "N/A"}`,
    `Notes: ${config.notes || "N/A"}`,
    `Estimated Price: ${order.estimatedPrice ?? 0}`,
    "",
    "Model file details",
    `Original Name: ${file.originalName || "N/A"}`,
    `Stored Name: ${file.storedName || "N/A"}`,
    `Size (bytes): ${file.size || "N/A"}`,
    `External Link: ${file.externalLink || "N/A"}`
  ].join("\n");
};

const sendCustomOrderProviderEmail = async ({ order, localFilePath }) => {
  const config = getMailerConfig();
  if (!config) {
    return { sent: false, reason: "SMTP or provider email env vars are missing." };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth
  });

  const attachments = [];
  if (localFilePath) {
    attachments.push({
      filename: order.file?.originalName || "model-file",
      path: localFilePath
    });
  }

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    subject: `ForgeLayer Custom Order - ${order.id}`,
    text: buildTextBody({ order }),
    attachments
  });

  return { sent: true };
};

module.exports = {
  sendCustomOrderProviderEmail
};
