import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="global-site-footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand-section">
          <h2 className="footer-brand-logo">⚡ TechStore</h2>
          <p className="footer-brand-tagline">
            Your premium destination for high-performance laptops and gadgets.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-links-section">
          <h4>Quick Navigation</h4>
          <ul>
            <li><Link to="/">Home Storefront</Link></li>
            <li><Link to="/cart">View Shopping Cart</Link></li>
            <li><Link to="/myorders">Track Orders</Link></li>
          </ul>
        </div>

        {/* Customer Support Section */}
        <div className="footer-links-section">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="#faq">FAQ & Help</a></li>
            <li><a href="#shipping">Shipping Policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="footer-bottom-bar">
        <p>&copy; {currentYear} TechStore Inc. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;