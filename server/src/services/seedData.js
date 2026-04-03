const Product = require("../models/Product");
const seedProducts = require("../data/seedProducts");

const seedInitialData = async () => {
  await Product.deleteMany({});
  await Product.insertMany(seedProducts);
  console.log(`Seeded ${seedProducts.length} products.`);
};

module.exports = {
  seedInitialData
};
