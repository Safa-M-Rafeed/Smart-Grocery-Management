const connectDB = require('./config/db');

connectDB().then(async () => {
  // Example: Create a collection
  await require('mongoose').connection.db.createCollection('products');
  console.log('Collection "products" created');
  process.exit(0); // Exit after creation
}).catch((error) => {
  console.error(error);
  process.exit(1);
});