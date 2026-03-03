import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, send to API
        console.log('Contact form:', formData);
        toast.success('Message sent! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page animate-fadeIn">
            {/* Header */}
            <section className="contact-header">
                <div className="container">
                    <h1>Get In Touch</h1>
                    <p>Have a question about our collections or an existing order? Our team is here to assist you.</p>
                </div>
            </section>

            <div className="container">
                <div className="contact-layout">
                    {/* Contact Info */}
                    <div className="contact-info">
                        <div className="info-section">
                            <h3>Contact Information</h3>
                            <div className="info-items">
                                <div className="info-item">
                                    <div className="info-icon"><FiMail /></div>
                                    <div>
                                        <p className="info-label">Email Us</p>
                                        <p className="info-value">concierge@urbanweave.com</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-icon"><FiPhone /></div>
                                    <div>
                                        <p className="info-label">Call Us</p>
                                        <p className="info-value">+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-icon"><FiMapPin /></div>
                                    <div>
                                        <p className="info-label">Headquarters</p>
                                        <p className="info-value">123 Fashion District, Lower Parel, Mumbai 400013</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-icon"><FiClock /></div>
                                    <div>
                                        <p className="info-label">Business Hours</p>
                                        <p className="info-value">Mon - Sat: 10:00 AM - 7:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="social-connect">
                            <h3>Connect With Us</h3>
                            <div className="social-links">
                                <a href="#">Instagram</a>
                                <a href="#">Twitter</a>
                                <a href="#">LinkedIn</a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="What is this about?"
                                />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    rows="6"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Your message here..."
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg btn-full">
                                Send Message <FiSend style={{ marginLeft: '0.5rem' }} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
