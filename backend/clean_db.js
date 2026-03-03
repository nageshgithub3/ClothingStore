require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function cleanDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urbanweave');
        console.log('✅ Connected to MongoDB');

        // Instead of deleting everything, just clear the images from all products
        // This lets the user keep their product data but "re-upload" the files locally
        const result = await Product.updateMany({}, { $set: { images: [] } });
        console.log(`✅ Cleared images for ${result.modifiedCount} products.`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error cleaning DB:', error.message);
        process.exit(1);
    }
}

cleanDB();
