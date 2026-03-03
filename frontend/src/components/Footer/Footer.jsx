import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="footer-grid">
                        {/* Brand */}
                        <div className="footer-brand">
                            <Link to="/" className="footer-logo">
                                <span className="logo-text">URBAN</span>
                                <span className="logo-accent">WEAVE</span>
                            </Link>
                            <p className="footer-tagline">
                                Premium streetwear and luxury essentials for the modern individual.
                                Crafted with precision, designed for expression.
                            </p>
                            <div className="footer-social">
                                <a href="#" aria-label="Instagram"><FiInstagram /></a>
                                <a href="#" aria-label="Twitter"><FiTwitter /></a>
                                <a href="#" aria-label="Facebook"><FiFacebook /></a>
                                <a href="#" aria-label="YouTube"><FiYoutube /></a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-column">
                            <h4>Shop</h4>
                            <ul>
                                <li><Link to="/products?category=T-Shirts">T-Shirts</Link></li>
                                <li><Link to="/products?category=Hoodies">Hoodies</Link></li>
                                <li><Link to="/products?category=Jackets">Jackets</Link></li>
                                <li><Link to="/products?category=Pants">Pants</Link></li>
                                <li><Link to="/products?newArrivals=true">New Arrivals</Link></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div className="footer-column">
                            <h4>Company</h4>
                            <ul>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                                <li><Link to="/careers">Careers</Link></li>
                                <li><Link to="/sustainability">Sustainability</Link></li>
                                <li><Link to="/press">Press</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="footer-column">
                            <h4>Contact</h4>
                            <ul className="contact-list">
                                <li>
                                    <FiMapPin />
                                    <span>123 Fashion Street, Mumbai, India</span>
                                </li>
                                <li>
                                    <FiMail />
                                    <span>hello@urbanweave.com</span>
                                </li>
                                <li>
                                    <FiPhone />
                                    <span>+91 98765 43210</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter */}
            <div className="footer-newsletter">
                <div className="container">
                    <div className="newsletter-content">
                        <div>
                            <h3>Join the UrbanWeave Community</h3>
                            <p>Subscribe for exclusive drops, early access & member-only discounts.</p>
                        </div>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Enter your email" />
                            <button type="submit" className="btn btn-primary">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p>&copy; 2024 UrbanWeave. All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                            <Link to="/returns">Returns</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
