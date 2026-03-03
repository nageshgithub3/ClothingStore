require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function clearCloudinary() {
    console.log('🗑️ Starting Cloudinary cleanup...');
    try {
        // Delete all resources in the 'urbanweave' folder
        console.log('Searching for resources in "urbanweave" folder...');

        // This will delete all images in the specified folder
        const result = await cloudinary.api.delete_resources_by_prefix('urbanweave');
        console.log('✅ Deleted resources:', result);

        // Delete the folders
        try {
            await cloudinary.api.delete_folder('urbanweave/products');
            await cloudinary.api.delete_folder('urbanweave/seed');
            await cloudinary.api.delete_folder('urbanweave/accessories');
            await cloudinary.api.delete_folder('urbanweave/bag');
            await cloudinary.api.delete_folder('urbanweave/jewelery');
            await cloudinary.api.delete_folder('urbanweave/menassets');
            await cloudinary.api.delete_folder('urbanweave/womenassets');
            await cloudinary.api.delete_folder('urbanweave');
            console.log('✅ Folders deleted');
        } catch (e) {
            console.log('ℹ️ Note: Some folders might still be present or already empty.');
        }

    } catch (error) {
        console.error('❌ Error clearing Cloudinary:', error.message);
    }
    console.log('✨ Cleanup finished!');
}

clearCloudinary();
