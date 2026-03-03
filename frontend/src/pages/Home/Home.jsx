import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiShoppingBag } from 'react-icons/fi';
import API from '../../api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const [featuredRes, newRes] = await Promise.all([
                API.get('/products?featured=true&limit=4'),
                API.get('/products?newArrivals=true&limit=4')
            ]);
            setFeatured(featuredRes.data.products || []);
            setNewArrivals(newRes.data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [location.key, fetchProducts]);

    const categories = [
        { name: 'Men', icon: '👤', desc: 'Modern Men' },
        { name: 'Women', icon: '💃', desc: 'Urban Women' },
        { name: 'Hoodies', icon: '🧥', desc: 'Premium Hoodies' },
        { name: 'Jackets', icon: '🧥', desc: 'Statement Jackets' },
        { name: 'Shorts', icon: '🩳', desc: 'Athletic Shorts' },
        { name: 'Accessories', icon: '🧢', desc: 'Signature Drops' }
    ];

    const testimonials = [
        { name: 'Arjun M.', text: 'The quality of UrbanWeave is unmatched. Every piece feels premium and the fit is perfect.', rating: 5 },
        { name: 'Priya S.', text: 'Finally a brand that understands street-luxury. The Shadow Noir Hoodie is my absolute favorite.', rating: 5 },
        { name: 'Rahul K.', text: 'Fast shipping, amazing packaging, and the clothes speak for themselves. 10/10 experience.', rating: 5 }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg-overlay" />
                <div className="hero-particles">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }} />
                    ))}
                </div>
                <div className="container hero-content">
                    <div className="hero-text animate-fadeInUp">
                        <span className="hero-badge">New Collection 2024</span>
                        <h1>
                            <span className="hero-line-1">Redefine</span>
                            <span className="hero-line-2">Your <em>Style</em></span>
                        </h1>
                        <p className="hero-subtitle">
                            Premium streetwear crafted for those who refuse to blend in.
                            Discover the intersection of luxury and urban culture.
                        </p>
                        <div className="hero-actions">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Shop Collection <FiArrowRight />
                            </Link>
                            <Link to="/products?newArrivals=true" className="btn btn-secondary btn-lg">
                                New Arrivals
                            </Link>
                        </div>
                    </div>
                    <div className="hero-visual animate-fadeInUp delay-2">
                        <div className="hero-image-frame">
                            <div className="hero-glow" />
                            <div className="hero-image-placeholder">
                                <span>URBAN</span>
                                <span className="gold">WEAVE</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-scroll-indicator">
                    <div className="scroll-line" />
                    <span>Scroll to explore</span>
                </div>
            </section>

            {/* Features Strip */}
            <section className="features-strip">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-item">
                            <FiTruck />
                            <div>
                                <h4>Free Shipping</h4>
                                <p>Orders above ₹999</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FiShield />
                            <div>
                                <h4>Secure Payment</h4>
                                <p>100% Protected</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FiRefreshCw />
                            <div>
                                <h4>Easy Returns</h4>
                                <p>30-day policy</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FiHeadphones />
                            <div>
                                <h4>24/7 Support</h4>
                                <p>Expert assistance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Shop by Category</h2>
                        <div className="gold-divider" />
                        <p>Explore our curated collections</p>
                    </div>
                    <div className="categories-grid">
                        {categories.map((cat, i) => (
                            <Link
                                to={`/products?category=${cat.name}`}
                                key={i}
                                className="category-card animate-fadeInUp"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <span className="category-icon">{cat.icon}</span>
                                <h3>{cat.name}</h3>
                                <p>{cat.desc}</p>
                                <FiArrowRight className="category-arrow" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section featured-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Featured Collection</h2>
                        <div className="gold-divider" />
                        <p>Handpicked premium pieces for the discerning individual</p>
                    </div>
                    {loading ? (
                        <div className="loading-container"><div className="spinner" /></div>
                    ) : featured.length === 0 ? (
                        <div className="empty-state">
                            <FiShoppingBag className="empty-icon" />
                            <h3>New items coming soon</h3>
                            <p>Our featured collection is currently being updated. Check back shortly!</p>
                            <Link to="/products" className="btn btn-secondary">Browse Shop</Link>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {featured.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                    <div className="section-cta">
                        <Link to="/products?featured=true" className="btn btn-secondary">
                            View All Featured <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Brand Story Banner */}
            <section className="brand-story">
                <div className="brand-story-overlay" />
                <div className="container">
                    <div className="brand-story-content">
                        <span className="brand-story-label">Our Story</span>
                        <h2>Crafted for the <em>Bold</em></h2>
                        <p>
                            Born from the streets of Mumbai, UrbanWeave represents the fusion of
                            Indian craftsmanship and global street culture. Every thread tells a story
                            of precision, passion, and uncompromising quality.
                        </p>
                        <Link to="/about" className="btn btn-primary">
                            Discover More <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            <section className="section new-arrivals-section">
                <div className="container">
                    <div className="section-header">
                        <h2>New Arrivals</h2>
                        <div className="gold-divider" />
                        <p>Fresh drops just landed in the collection</p>
                    </div>
                    {loading ? (
                        <div className="loading-container"><div className="spinner" /></div>
                    ) : newArrivals.length === 0 ? (
                        <div className="empty-state">
                            <FiShoppingBag className="empty-icon" />
                            <h3>No new drops yet</h3>
                            <p>Stay tuned for our latest arrivals and seasonal collections!</p>
                            <Link to="/products" className="btn btn-secondary">Explore All Products</Link>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {newArrivals.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                    <div className="section-cta">
                        <Link to="/products?newArrivals=true" className="btn btn-secondary">
                            View All New Arrivals <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <h2>What Our Customers Say</h2>
                        <div className="gold-divider" />
                        <p>Real experiences from the UrbanWeave community</p>
                    </div>
                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <div key={i} className="testimonial-card animate-fadeInUp" style={{ animationDelay: `${i * 0.15}s` }}>
                                <div className="testimonial-stars">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <FiStar key={j} className="star-icon" />
                                    ))}
                                </div>
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{t.name[0]}</div>
                                    <span className="author-name">{t.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Elevate Your Wardrobe?</h2>
                        <p>Join thousands who've discovered premium street-luxury fashion.</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Start Shopping <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
