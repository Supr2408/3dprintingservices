const Product = require("../models/Product");
const seedProducts = require("../data/seedProducts");

const seedInitialData = async () => {
  if (!seedProducts.length) {
    return;
  }

  const operations = seedProducts.map((product) => ({
    updateOne: {
      filter: { id: product.id },
      update: { $set: product },
      upsert: true
    }
  }));

  await Product.bulkWrite(operations);
  console.log(`Seeded or updated ${seedProducts.length} products.`);
};

module.exports = {
  seedInitialData
};
