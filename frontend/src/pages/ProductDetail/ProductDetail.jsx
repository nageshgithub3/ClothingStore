import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiStar, FiTruck, FiShield, FiRefreshCw, FiMinus, FiPlus, FiChevronRight } from 'react-icons/fi';
import API from '../../api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageHelper';
import ProductCard from '../../components/ProductCard/ProductCard';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data } = await API.get(`/products/${id}`);
                setProduct(data);
                setSelectedSize(data.sizes?.[0] || '');
                setSelectedColor(data.colors?.[0]?.name || '');

                // Fetch related
                const relRes = await API.get(`/products?category=${data.category}&limit=4`);
                setRelated(relRes.data.products.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }
        addToCart(product, quantity, selectedSize, selectedColor);
    };

    const discount = product?.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    if (loading) return <div className="loading-container" style={{ paddingTop: '100px' }}><div className="spinner" /></div>;
    if (!product) return <div className="loading-container" style={{ paddingTop: '100px' }}><p>Product not found</p></div>;

    return (
        <div className="product-detail-page">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <div className="container">
                    <Link to="/">Home</Link>
                    <FiChevronRight />
                    <Link to="/products">Shop</Link>
                    <FiChevronRight />
                    <Link to={`/products?category=${product.category}`}>{product.category}</Link>
                    <FiChevronRight />
                    <span>{product.name}</span>
                </div>
            </div>

            <div className="container">
                <div className="product-detail-grid">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="gallery-main">
                            {product.images?.[0] ? (
                                <img
                                    src={getImageUrl(product.images[0])}
                                    alt={product.name}
                                    className="main-detail-img"
                                />
                            ) : (
                                <div className="gallery-placeholder">
                                    <span className="gallery-brand">UW</span>
                                    <span className="gallery-product-name">{product.name}</span>
                                </div>
                            )}
                            {product.isNewArrival && <span className="badge badge-gold detail-badge">New Arrival</span>}
                            {discount > 0 && <span className="badge badge-burgundy detail-badge discount-badge">{discount}% OFF</span>}
                        </div>

                        {product.images?.length > 1 && (
                            <div className="gallery-thumbs">
                                {product.images.map((img, i) => (
                                    <div key={i} className="thumb-item">
                                        <img src={getImageUrl(img)} alt="" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <span className="product-detail-category">{product.category}</span>
                        <h1 className="product-detail-name">{product.name}</h1>

                        {/* Rating */}
                        <div className="product-detail-rating">
                            <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <FiStar
                                        key={star}
                                        className={`star ${star <= Math.round(product.ratings) ? 'filled' : ''}`}
                                    />
                                ))}
                            </div>
                            <span className="rating-value">{product.ratings?.toFixed(1)}</span>
                            <span className="rating-count">({product.numReviews} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="product-detail-price">
                            <span className="detail-current-price">₹{product.price?.toLocaleString()}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <>
                                    <span className="detail-original-price">₹{product.originalPrice?.toLocaleString()}</span>
                                    <span className="detail-discount">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
                                </>
                            )}
                        </div>

                        <p className="product-detail-desc">{product.description}</p>

                        {/* Color Selector */}
                        {product.colors?.length > 0 && (
                            <div className="detail-section">
                                <label>Color: <strong>{selectedColor}</strong></label>
                                <div className="color-options">
                                    {product.colors.map((color, i) => (
                                        <button
                                            key={i}
                                            className={`color-option ${selectedColor === color.name ? 'active' : ''}`}
                                            style={{ background: color.hex }}
                                            onClick={() => setSelectedColor(color.name)}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selector */}
                        {product.sizes?.length > 0 && (
                            <div className="detail-section">
                                <label>Size: <strong>{selectedSize}</strong></label>
                                <div className="size-options">
                                    {product.sizes.map((size, i) => (
                                        <button
                                            key={i}
                                            className={`size-option ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="detail-section">
                            <label>Quantity</label>
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><FiPlus /></button>
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="stock-info">
                            {product.stock > 0 ? (
                                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
                            ) : (
                                <span className="out-of-stock">✕ Out of Stock</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="detail-actions">
                            <button
                                className="btn btn-primary btn-lg btn-full"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                <FiShoppingBag /> Add to Cart
                            </button>
                            <button className="btn btn-secondary wishlist-btn">
                                <FiHeart />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="detail-features">
                            <div className="detail-feature">
                                <FiTruck /> <span>Free shipping on orders above ₹999</span>
                            </div>
                            <div className="detail-feature">
                                <FiShield /> <span>100% authentic product guarantee</span>
                            </div>
                            <div className="detail-feature">
                                <FiRefreshCw /> <span>Easy 30-day returns & exchange</span>
                            </div>
                        </div>

                        {/* Material */}
                        {product.material && (
                            <div className="detail-material">
                                <strong>Material:</strong> {product.material}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="product-tabs">
                    <div className="tabs-header">
                        <button
                            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews ({product.numReviews})
                        </button>
                    </div>
                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <div className="tab-description">
                                <p>{product.description}</p>
                                {product.material && <p><strong>Material:</strong> {product.material}</p>}
                                {product.tags?.length > 0 && (
                                    <div className="product-tags">
                                        {product.tags.map((tag, i) => (
                                            <span key={i} className="product-tag">#{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="tab-reviews">
                                {product.reviews?.length === 0 ? (
                                    <p className="no-reviews">No reviews yet. Be the first to review!</p>
                                ) : (
                                    product.reviews?.map((review, i) => (
                                        <div key={i} className="review-item">
                                            <div className="review-header">
                                                <div className="review-author">{review.name}</div>
                                                <div className="review-stars">
                                                    {[...Array(review.rating)].map((_, j) => (
                                                        <FiStar key={j} className="star-icon" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="review-comment">{review.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <div className="related-products section">
                        <div className="section-header">
                            <h2>You May Also Like</h2>
                            <div className="gold-divider" />
                        </div>
                        <div className="products-grid">
                            {related.slice(0, 4).map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
