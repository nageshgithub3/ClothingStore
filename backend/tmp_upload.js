require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const images = [
    { name: 'brand_story', path: 'C:/Users/nages/.gemini/antigravity/brain/b6ce4992-1810-4c1b-8d7b-2eb715f91440/brand_story_1772504954991.png' },
    { name: 'hero_banner', path: 'C:/Users/nages/.gemini/antigravity/brain/b6ce4992-1810-4c1b-8d7b-2eb715f91440/hero_banner_1772504837587.png' },
    { name: 'hoodie', path: 'C:/Users/nages/.gemini/antigravity/brain/b6ce4992-1810-4c1b-8d7b-2eb715f91440/product_hoodie_1772504865525.png' },
    { name: 'jacket', path: 'C:/Users/nages/.gemini/antigravity/brain/b6ce4992-1810-4c1b-8d7b-2eb715f91440/product_jacket_1772504909168.png' },
    { name: 'pants', path: 'C:/Users/nages/.gemini/antigravity/brain/b6ce4992-1810-4c1b-8d7b-2eb715f91440/product_pants_1772504940156.png' },
    { name: 'tshirt', path: 'C:/Users/nages/.gemini/antigravity/brain/b6ce4992-1810-4c1b-8d7b-2eb715f91440/product_tshirt_1772504880598.png' }
];

async function uploadImages() {
    console.log('🚀 Starting Cloudinary upload...');
    const results = {};
    for (const img of images) {
        try {
            console.log(`Uploading ${img.name}...`);
            const result = await cloudinary.uploader.upload(img.path, {
                folder: 'urbanweave/seed',
                public_id: img.name
            });
            console.log(`✅ Success: ${img.name} -> ${result.secure_url}`);
            results[img.name] = result.secure_url;
        } catch (error) {
            console.error(`❌ Error uploading ${img.name}:`, error.message);
            results[img.name] = `ERROR: ${error.message}`;
        }
    }
    fs.writeFileSync('upload_results.json', JSON.stringify(results, null, 2));
    console.log('\n--- Results saved to upload_results.json ---');
}

uploadImages();
