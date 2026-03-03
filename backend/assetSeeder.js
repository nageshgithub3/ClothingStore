require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const ASSETS_ROOT = path.join(__dirname, '../frontend/src/assets');
const CATEGORIES = ['accessories', 'bag', 'jewelery', 'menassets', 'womenassets'];

// Helper to get all files in a directory
const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach((file) => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });
    return arrayOfFiles;
};

// Map filenames to product metadata
const formatName = (filename) => {
    return filename
        .replace(/\.[^/.]+$/, "") // remove extension
        .replace(/[-_]/g, ' ') // replace hyphens/underscores
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

async function seedAssets() {
    await connectDB();
    console.log('🧹 Clearing existing products in target categories for a fresh re-upload...');

    // Clear existing products in these categories
    const categoriesToClear = ['Accessories', 'Bags', 'Jewelry', 'Men', 'Women'];
    await Product.deleteMany({ category: { $in: categoriesToClear } });

    console.log('🚀 Scanning and uploading assets...');

    for (const folder of CATEGORIES) {
        const folderPath = path.join(ASSETS_ROOT, folder);
        if (!fs.existsSync(folderPath)) continue;

        const files = getAllFiles(folderPath).filter(f => f.match(/\.(webp|png|jpg|jpeg)$/i));
        console.log(`📂 Processing ${folder}: ${files.length} files found.`);

        for (const filePath of files) {
            const fileName = path.basename(filePath);
            const productName = formatName(fileName);

            try {
                // Upload to Cloudinary
                console.log(`⬆️ Uploading ${productName}...`);
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: `urbanweave/${folder}`,
                    public_id: fileName.replace(/\.[^/.]+$/, "")
                });

                // Create product entry
                let category = folder;
                if (folder === 'menassets') category = 'Men';
                if (folder === 'womenassets') category = 'Women';
                if (folder === 'jewelery') category = 'Jewelry';
                if (folder === 'bag') category = 'Bags';
                if (folder === 'accessories') category = 'Accessories';

                await Product.create({
                    name: productName,
                    description: `Premium ${productName} from UrbanWeave. Crafted with precision for the modern lifestyle.`,
                    price: Math.floor(Math.random() * (4999 - 999 + 1)) + 999, // Random price between 999-4999
                    originalPrice: null, // Let originalPrice be null to signify regular item
                    category: category,
                    sizes: (folder === 'menassets' || folder === 'womenassets') ? ['S', 'M', 'L', 'XL'] : [],
                    colors: [
                        { name: 'Default', hex: '#000000' }
                    ],
                    stock: Math.floor(Math.random() * 100),
                    images: [result.secure_url],
                    ratings: (Math.random() * (5 - 4) + 4).toFixed(1), // 4.0 to 5.0
                    numReviews: Math.floor(Math.random() * 200),
                    isFeatured: Math.random() > 0.8,
                    material: 'Premium Quality Materials',
                    tags: [folder, 'new', 'premium'],
                    sold: Math.floor(Math.random() * 300)
                });

                console.log(`✅ Seeded: ${productName}`);
            } catch (error) {
                console.error(`❌ Failed: ${productName}`, error.message);
            }
        }
    }

    console.log('✨ Asset seeding complete!');
    process.exit();
}

seedAssets();
