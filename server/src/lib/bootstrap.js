const mongoose = require("mongoose");

const { seedInitialData } = require("../services/seedData");

const globalState = globalThis.__forgeLayerBootstrap || {
  connectionPromise: null,
  seeded: false
};

globalThis.__forgeLayerBootstrap = globalState;

const connectToDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MONGO_URI not set. API routes that need the database will fail.");
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!globalState.connectionPromise) {
    globalState.connectionPromise = mongoose
      .connect(mongoUri)
      .then(() => mongoose.connection)
      .catch((error) => {
        globalState.connectionPromise = null;
        throw error;
      });
  }

  return globalState.connectionPromise;
};

const ensureAppReady = async () => {
  const connection = await connectToDatabase();

  if (connection && !globalState.seeded) {
    await seedInitialData();
    globalState.seeded = true;
  }

  return connection;
};

module.exports = {
  connectToDatabase,
  ensureAppReady
};
