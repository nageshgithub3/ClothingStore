const fs = require('fs-extra');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');
require('dotenv').config();

const ASSETS_ROOT = path.join(__dirname, '../frontend/src/assets');
const UPLOAD_ROOT = path.join(__dirname, 'uploads/products');
const CATEGORIES = ['accessories', 'bag', 'jewelery', 'menassets', 'womenassets', 'hoddies', 'jackets', 'shorts', 'shoes', 'tshirts', 'Dresses', 'pants'];

// Ensure local upload directory exists
fs.ensureDirSync(UPLOAD_ROOT);

const formatName = (filename) => {
    return filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

async function seedLocalAssets() {
    try {
        await connectDB();
        console.log('🚀 Scanning for new assets to add to local storage...');

        for (const folder of CATEGORIES) {
            const folderPath = path.join(ASSETS_ROOT, folder);
            if (!fs.existsSync(folderPath)) continue;

            const files = fs.readdirSync(folderPath).filter(f => f.match(/\.(webp|png|jpg|jpeg)$/i));
            console.log(`📂 Processing ${folder}: ${files.length} files found.`);

            for (const fileName of files) {
                const sourcePath = path.join(folderPath, fileName);
                const uniqueName = `local-${Date.now()}-${fileName}`;
                const destPath = path.join(UPLOAD_ROOT, uniqueName);

                // Copy file to local storage
                await fs.copy(sourcePath, destPath);

                const productName = formatName(fileName);
                let category = folder;
                if (folder === 'menassets') category = 'Men';
                if (folder === 'womenassets') category = 'Women';
                if (folder === 'jewelery') category = 'Jewelry';
                if (folder === 'bag') category = 'Bags';
                if (folder === 'accessories') category = 'Accessories';
                if (folder === 'hoddies') category = 'Hoodies';
                if (folder === 'jackets') category = 'Jackets';
                if (folder === 'shorts') category = 'Shorts';
                if (folder === 'shoes') category = 'Shoes';
                if (folder === 'tshirts') category = 'T-Shirts';
                if (folder === 'Dresses') category = 'Dresses';
                if (folder === 'pants') category = 'Pants';

                // Check if product already exists
                const exists = await Product.findOne({ name: productName });
                if (exists) {
                    console.log(`⏭️ Skipping ${productName} (exists)`);
                    continue;
                }
                await Product.create({
                    name: productName,
                    description: `Premium ${productName} from UrbanWeave. Locally hosted quality.`,
                    price: Math.floor(Math.random() * (4999 - 999 + 1)) + 999,
                    category: category,
                    sizes: category === 'Shoes' ? ['7', '8', '9', '10', '11'] : ['Hoodies', 'Jackets', 'Pants', 'Shorts', 'T-Shirts', 'Dresses', 'Men', 'Women'].includes(category) ? ['S', 'M', 'L', 'XL'] : [],
                    colors: [{ name: 'Default', hex: '#000000' }],
                    stock: Math.floor(Math.random() * 100),
                    images: [`/uploads/products/${uniqueName}`],
                    ratings: (Math.random() * (5 - 4) + 4).toFixed(1),
                    numReviews: Math.floor(Math.random() * 200),
                    isFeatured: true,
                    isNewArrival: true,
                    material: 'Premium Quality Materials',
                    tags: [folder, 'local', 'new'],
                    sold: Math.floor(Math.random() * 300)
                });
            }
        }

        console.log('✨ Local asset seeding complete!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedLocalAssets();
