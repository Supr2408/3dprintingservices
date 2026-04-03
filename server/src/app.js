const dotenv = require("dotenv");
const { createApp } = require("./createApp");
const { ensureAppReady } = require("./lib/bootstrap");

dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await ensureAppReady();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
