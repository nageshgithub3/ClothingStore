const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build filter
        let filter = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }
        if (req.query.size) {
            filter.sizes = { $in: req.query.size.split(',') };
        }
        if (req.query.color) {
            filter['colors.name'] = { $in: req.query.color.split(',') };
        }
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }
        if (req.query.featured === 'true') {
            filter.isFeatured = true;
        }
        if (req.query.newArrivals === 'true') {
            filter.isNewArrival = true;
        }

        // Build sort
        let sort = {};
        switch (req.query.sort) {
            case 'price_asc':
                sort.price = 1;
                break;
            case 'price_desc':
                sort.price = -1;
                break;
            case 'newest':
                sort.createdAt = -1;
                break;
            case 'popular':
                sort.sold = -1;
                break;
            case 'rating':
                sort.ratings = -1;
                break;
            default:
                sort.createdAt = -1;
        }

        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select('-reviews');

        res.json({
            products,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('reviews.user', 'name avatar');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get product categories
// @route   GET /api/products/categories
const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create product (Admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
    try {
        let productData = req.body;

        // Handle images from local storage (via multer)
        if (req.files && req.files.length > 0) {
            // Convert local disk paths to web URLs (normalized from backslashes to forward slashes)
            const newImages = req.files.map(file => {
                const normalizedPath = file.path.replace(/\\/g, '/');
                return `/${normalizedPath}`;
            });
            productData.images = [...(productData.images || []), ...newImages];
        }

        // Parse nested fields if sent as form-data
        if (typeof productData.sizes === 'string') productData.sizes = JSON.parse(productData.sizes);
        if (typeof productData.colors === 'string') productData.colors = JSON.parse(productData.colors);
        if (typeof productData.tags === 'string') productData.tags = JSON.parse(productData.tags);

        const product = await Product.create(productData);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        let productData = req.body;

        // Handle images
        let existingImages = [];
        if (productData.existingImages) {
            existingImages = typeof productData.existingImages === 'string'
                ? JSON.parse(productData.existingImages)
                : productData.existingImages;
            productData.images = existingImages;
        }

        if (req.files && req.files.length > 0) {
            // Convert local disk paths to web URLs (normalized from backslashes to forward slashes)
            const newImages = req.files.map(file => {
                const normalizedPath = file.path.replace(/\\/g, '/');
                return `/${normalizedPath}`;
            });
            productData.images = [...(productData.images || []), ...newImages];
        }

        // Parse nested fields if sent as form-data
        if (typeof productData.sizes === 'string') productData.sizes = JSON.parse(productData.sizes);
        if (typeof productData.colors === 'string') productData.colors = JSON.parse(productData.colors);
        if (typeof productData.tags === 'string') productData.tags = JSON.parse(productData.tags);

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            productData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add review
// @route   POST /api/products/:id/reviews
const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const alreadyReviewed = product.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You already reviewed this product' });
        }

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProduct,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    addReview
};
