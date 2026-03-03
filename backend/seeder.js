const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const User = require('./models/User');
const Coupon = require('./models/Coupon');
const connectDB = require('./config/db');

const products = [
    {
        name: 'Shadow Noir Oversized Hoodie',
        description: 'Premium heavyweight cotton blend oversized hoodie. Features a relaxed drop-shoulder silhouette, ribbed cuffs and hem, and a kangaroo pocket. The perfect blend of comfort and street-luxury aesthetic.',
        price: 3499,
        originalPrice: 4999,
        category: 'Hoodies',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Charcoal Black', hex: '#1a1a1a' },
            { name: 'Stone Grey', hex: '#8a8a8a' },
            { name: 'Deep Burgundy', hex: '#5a1a2a' }
        ],
        stock: 50,
        images: ['https://res.cloudinary.com/drctil0no/image/upload/v1772511690/urbanweave/seed/hoodie.png'],
        ratings: 4.8,
        numReviews: 124,
        isFeatured: true,
        isNewArrival: true,
        material: '80% Cotton, 20% Polyester',
        tags: ['hoodie', 'streetwear', 'oversized', 'premium'],
        sold: 342
    },
    {
        name: 'Midnight Essential Crew T-Shirt',
        description: 'Ultra-soft 100% organic cotton crew neck t-shirt. Garment-dyed for a vintage feel. Minimalist UrbanWeave branding on the chest. A wardrobe essential elevated to premium craftsmanship.',
        price: 1299,
        originalPrice: 1799,
        category: 'T-Shirts',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Jet Black', hex: '#0a0a0a' },
            { name: 'Off White', hex: '#f5f0eb' },
            { name: 'Olive', hex: '#4a5a3a' }
        ],
        stock: 120,
        images: ['https://res.cloudinary.com/drctil0no/image/upload/v1772511695/urbanweave/seed/tshirt.png'],
        ratings: 4.6,
        numReviews: 89,
        isFeatured: true,
        isNewArrival: false,
        material: '100% Organic Cotton',
        tags: ['t-shirt', 'essential', 'minimal', 'organic'],
        sold: 567
    },
    {
        name: 'Urban Stealth Bomber Jacket',
        description: 'Premium faux-leather bomber jacket with satin lining. Features gold-tone hardware, ribbed collar, cuffs and hem. A statement piece that bridges classic aviator heritage with modern urban edge.',
        price: 7999,
        originalPrice: 9999,
        category: 'Jackets',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Obsidian', hex: '#0d0d0d' },
            { name: 'Dark Brown', hex: '#3a2a1a' }
        ],
        stock: 25,
        images: ['https://res.cloudinary.com/drctil0no/image/upload/v1772511692/urbanweave/seed/jacket.png'],
        ratings: 4.9,
        numReviews: 56,
        isFeatured: true,
        isNewArrival: true,
        material: 'Premium Faux Leather, Satin Lining',
        tags: ['jacket', 'bomber', 'leather', 'statement'],
        sold: 189
    },
    {
        name: 'Phantom Relaxed Cargo Pants',
        description: 'Wide-leg cargo pants crafted from premium Japanese twill. Six-pocket design with magnetic closures. Adjustable waist and tapered ankle. The ultimate blend of utility and luxury.',
        price: 4299,
        originalPrice: 5499,
        category: 'Pants',
        sizes: ['28', '30', '32', '34', '36', '38'],
        colors: [
            { name: 'Washed Black', hex: '#2a2a2a' },
            { name: 'Stone', hex: '#c4b6a5' },
            { name: 'Army Green', hex: '#3a4a2a' }
        ],
        stock: 40,
        images: ['https://res.cloudinary.com/drctil0no/image/upload/v1772511693/urbanweave/seed/pants.png'],
        ratings: 4.7,
        numReviews: 73,
        isFeatured: true,
        isNewArrival: false,
        material: 'Japanese Twill Cotton',
        tags: ['cargo', 'pants', 'utility', 'relaxed'],
        sold: 298
    },
    {
        name: 'Eclipse Graphic Tee – Limited Edition',
        description: 'Limited edition graphic t-shirt featuring hand-illustrated eclipse artwork. Printed with water-based inks on premium heavyweight cotton. Each piece is individually numbered.',
        price: 2199,
        originalPrice: 2999,
        category: 'T-Shirts',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Black', hex: '#000000' },
            { name: 'Cream', hex: '#f5f0eb' }
        ],
        stock: 30,
        images: ['/images/tshirt-3.jpg'],
        ratings: 4.5,
        numReviews: 42,
        isFeatured: false,
        isNewArrival: true,
        material: 'Heavyweight 100% Cotton',
        tags: ['graphic', 't-shirt', 'limited-edition', 'art'],
        sold: 156
    },
    {
        name: 'Velocity Track Shorts',
        description: 'Premium athletic shorts with hidden zip pockets and moisture-wicking technology. Dual-layer construction with built-in compression liner. Perfect for training or casual wear.',
        price: 1999,
        originalPrice: 2499,
        category: 'Shorts',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Onyx', hex: '#0f0f0f' },
            { name: 'Slate', hex: '#5a5a5a' }
        ],
        stock: 60,
        images: ['/images/shorts-1.jpg'],
        ratings: 4.4,
        numReviews: 38,
        isFeatured: false,
        isNewArrival: true,
        material: 'Nylon Blend, Mesh Lining',
        tags: ['shorts', 'athletic', 'training'],
        sold: 210
    },
    {
        name: 'Heritage Wool Overcoat',
        description: 'Double-breasted overcoat crafted from Italian wool blend. Features peak lapels, full satin lining, and two interior pockets. A timeless silhouette redefined with modern proportions.',
        price: 12999,
        originalPrice: 16999,
        category: 'Jackets',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Charcoal', hex: '#2d2d2d' },
            { name: 'Camel', hex: '#c19a6b' }
        ],
        stock: 15,
        images: ['/images/overcoat-1.jpg'],
        ratings: 4.9,
        numReviews: 29,
        isFeatured: true,
        isNewArrival: false,
        material: 'Italian Wool Blend',
        tags: ['overcoat', 'wool', 'heritage', 'luxury'],
        sold: 98
    },
    {
        name: 'Drift Longline Hoodie',
        description: 'Extended-length hoodie with thumbhole cuffs and side zips. Double-layered hood with subtle gold-tone drawstrings. Made from a premium French terry cotton blend.',
        price: 3999,
        originalPrice: 4799,
        category: 'Hoodies',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'Matte Black', hex: '#1a1a1a' },
            { name: 'Sand', hex: '#c2b280' },
            { name: 'Ash Grey', hex: '#b2beb5' }
        ],
        stock: 35,
        images: ['/images/hoodie-3.jpg'],
        ratings: 4.7,
        numReviews: 67,
        isFeatured: false,
        isNewArrival: true,
        material: 'French Terry Cotton Blend',
        tags: ['hoodie', 'longline', 'premium'],
        sold: 234
    },
    {
        name: 'Stealth Jogger Pants',
        description: 'Tapered joggers with water-repellent finish. Features zippered pockets, elastic waistband with internal drawcord, and ribbed ankle cuffs. Technical performance meets everyday style.',
        price: 3299,
        originalPrice: 3999,
        category: 'Pants',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Black', hex: '#0a0a0a' },
            { name: 'Dark Navy', hex: '#0a0a2a' }
        ],
        stock: 45,
        images: ['/images/joggers-1.jpg'],
        ratings: 4.6,
        numReviews: 91,
        isFeatured: false,
        isNewArrival: false,
        material: 'Water-Repellent Nylon Blend',
        tags: ['joggers', 'pants', 'technical', 'water-repellent'],
        sold: 389
    },
    {
        name: 'Monochrome Cap – Signature',
        description: 'Structured 6-panel cap with embroidered UrbanWeave signature logo. Pre-curved brim, adjustable metal clasp closure. Made from premium washed cotton canvas.',
        price: 999,
        originalPrice: 1299,
        category: 'Accessories',
        sizes: ['M'],
        colors: [
            { name: 'Black', hex: '#000000' },
            { name: 'White', hex: '#ffffff' },
            { name: 'Olive', hex: '#556b2f' }
        ],
        stock: 80,
        images: ['/images/cap-1.jpg'],
        ratings: 4.3,
        numReviews: 55,
        isFeatured: false,
        isNewArrival: false,
        material: 'Washed Cotton Canvas',
        tags: ['cap', 'accessory', 'signature', 'logo'],
        sold: 445
    },
    {
        name: 'Noir Slim Fit Chinos',
        description: 'Classic slim-fit chinos made from premium stretch cotton. Features a comfortable mid-rise waist, zip fly, and tailored leg. Versatile enough for office or weekend wear.',
        price: 2999,
        originalPrice: 3799,
        category: 'Pants',
        sizes: ['28', '30', '32', '34', '36'],
        colors: [
            { name: 'Black', hex: '#0a0a0a' },
            { name: 'Tan', hex: '#d2b48c' },
            { name: 'Navy', hex: '#1a1a3a' }
        ],
        stock: 55,
        images: ['/images/chinos-1.jpg'],
        ratings: 4.5,
        numReviews: 47,
        isFeatured: false,
        isNewArrival: false,
        material: 'Stretch Cotton Twill',
        tags: ['chinos', 'pants', 'slim-fit', 'classic'],
        sold: 312
    },
    {
        name: 'Aether Performance Tee',
        description: 'Technical performance t-shirt with 4-way stretch fabric. Features moisture-wicking technology, flatlock seams, and anti-odor treatment. Ultralight at just 120 GSM.',
        price: 1799,
        originalPrice: 2199,
        category: 'T-Shirts',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Carbon', hex: '#1c1c1c' },
            { name: 'Arctic White', hex: '#f8f8f8' },
            { name: 'Steel Blue', hex: '#4682b4' }
        ],
        stock: 70,
        images: ['/images/tshirt-4.jpg'],
        ratings: 4.4,
        numReviews: 36,
        isFeatured: false,
        isNewArrival: true,
        material: '92% Polyester, 8% Elastane',
        tags: ['performance', 't-shirt', 'technical', 'athletic'],
        sold: 178
    }
];

const adminUser = {
    name: 'Admin',
    email: 'admin@urbanweave.com',
    password: 'admin123',
    role: 'admin'
};

const testUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'test123',
    role: 'user'
};

const coupons = [
    {
        code: 'WELCOME20',
        description: '20% off on your first order',
        discountType: 'percentage',
        discountValue: 20,
        minimumPurchase: 999,
        maxDiscount: 2000,
        usageLimit: 100,
        expiresAt: new Date('2027-12-31'),
        isActive: true
    },
    {
        code: 'FLAT500',
        description: 'Flat ₹500 off on orders above ₹2999',
        discountType: 'fixed',
        discountValue: 500,
        minimumPurchase: 2999,
        usageLimit: 50,
        expiresAt: new Date('2027-06-30'),
        isActive: true
    }
];

const seedDB = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Coupon.deleteMany();

        console.log('Data cleared...');

        // Create users
        await User.create(adminUser);
        await User.create(testUser);
        console.log('Users seeded ✓');

        // Create products
        await Product.insertMany(products);
        console.log('Products seeded ✓');

        // Create coupons
        await Coupon.insertMany(coupons);
        console.log('Coupons seeded ✓');

        console.log('\\n✅ Database seeded successfully!');
        console.log('Admin: admin@urbanweave.com / admin123');
        console.log('User: john@example.com / test123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
