import { FiTarget, FiHeart, FiGlobe, FiUsers } from 'react-icons/fi';
import './About.css';

const About = () => {
    return (
        <div className="about-page animate-fadeIn">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <span className="subtitle">Our Story</span>
                    <h1>Defining the Intersection of Culture & Luxury</h1>
                    <p>UrbanWeave was born from a simple observation: the modern individual deserves quality that doesn't compromise on expression.</p>
                </div>
            </section>

            {/* Values */}
            <section className="about-values section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Our Core Pillars</h2>
                        <div className="gold-divider mx-auto" />
                    </div>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon"><FiTarget /></div>
                            <h3>Precision Craftsmanship</h3>
                            <p>Every stitch is a testament to our dedication to quality. we source only the finest fabrics from sustainable mills.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><FiHeart /></div>
                            <h3>Cultural Resonance</h3>
                            <p>Our designs are inspired by the streets, the galleries, and the pulse of urban environments worldwide.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><FiGlobe /></div>
                            <h3>Ethical Footprint</h3>
                            <p>We believe fashion shouldn't cost the earth. Our production processes are designed to minimize waste and ensure fair labor.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><FiUsers /></div>
                            <h3>Community First</h3>
                            <p>UrbanWeave isn't just a label; it's a collective of individuals who value authenticity and bold style.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="about-mission">
                <div className="container">
                    <div className="mission-content">
                        <h2>Our Mission</h2>
                        <p>"To empower a generation of urban explorers with garments that serve as a canvas for their identity, blending high-end fashion with the raw energy of streetwear."</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
