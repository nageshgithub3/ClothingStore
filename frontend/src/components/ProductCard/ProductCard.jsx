import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageHelper';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1, product.sizes?.[1] || product.sizes?.[0] || '', product.colors?.[0]?.name || '');
    };

    return (
        <Link to={`/product/${product._id}`} className="product-card">
            <div className="product-card-image">
                {product.images && product.images.length > 0 ? (
                    <>
                        <img src={getImageUrl(product.images[0])} alt={product.name} className="primary-img" />
                        {product.images[1] && <img src={getImageUrl(product.images[1])} alt={product.name} className="secondary-img" />}
                    </>
                ) : (
                    <div className="product-card-img-placeholder">
                        <span className="placeholder-icon"><FiShoppingBag /></span>
                        <span className="placeholder-name">{product.name}</span>
                    </div>
                )}

                {/* Badges */}
                <div className="product-card-badges">
                    {product.isNewArrival && <span className="badge badge-gold">New</span>}
                    {discount > 0 && <span className="badge badge-burgundy">-{discount}%</span>}
                </div>

                {/* Quick Actions */}
                <div className="product-card-actions">
                    <button className="quick-action-btn" onClick={handleAddToCart} title="Add to Cart">
                        <FiShoppingBag />
                    </button>
                    <button className="quick-action-btn" title="Add to Wishlist">
                        <FiHeart />
                    </button>
                </div>
            </div>

            <div className="product-card-info">
                <p className="product-card-category">{product.category}</p>
                <h3 className="product-card-name">{product.name}</h3>

                <div className="product-card-rating">
                    <FiStar className="star-icon" />
                    <span>{product.ratings?.toFixed(1) || '0.0'}</span>
                    <span className="review-count">({product.numReviews || 0})</span>
                </div>

                <div className="product-card-price">
                    <span className="current-price">₹{product.price?.toLocaleString()}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original-price">₹{product.originalPrice?.toLocaleString()}</span>
                    )}
                </div>

                {/* Color Swatches */}
                {product.colors?.length > 0 && (
                    <div className="product-card-colors">
                        {product.colors.map((color, i) => (
                            <span
                                key={i}
                                className="color-swatch"
                                style={{ background: color.hex }}
                                title={color.name}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;
