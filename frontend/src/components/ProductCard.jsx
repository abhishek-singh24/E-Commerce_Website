import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
<<<<<<< HEAD
  // Helper function to dynamically process image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    if (imagePath.startsWith("http")) return imagePath;

    // Connect to live Render server on Vercel, or Localhost for local testing
    const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return imagePath.startsWith("/") ? `${BACKEND_URL}${imagePath}` : `${BACKEND_URL}/uploads/${imagePath}`;
  };
=======
  const BACKEND_URL = "http://localhost:5000"; 
>>>>>>> 2a1e0654be6f4795994a174fbf3eee304dc2bdc6

  // Local state to display dynamic micro-toast banners inside the card
  const [feedback, setFeedback] = useState({ text: "", type: "" });

  // Automatically clear the mini-notification after 2.5 seconds
  useEffect(() => {
    if (!feedback.text) return;
    
    const timer = setTimeout(() => {
      setFeedback({ text: "", type: "" });
    }, 2500);

    return () => clearTimeout(timer);
  }, [feedback.text]);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      if (existingProduct.quantity >= product.stock) {
        setFeedback({
          text: `Limit reached! Only ${product.stock} units available.`,
          type: "warning"
        });
        return;
      }
      existingProduct.quantity += 1;
    } else {
      if (product.stock <= 0) {
        setFeedback({ text: "Sorry, this product is out of stock.", type: "error" });
        return;
      }
      cart.push({ ...product, quantity: 1 });
    }

    // Success confirmation micro-interaction
    setFeedback({ text: "🛒 Added to your cart!", type: "success" });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <div className="product-card">
      {/* Product Image Capsule Area */}
      <div className="product-image-wrapper">
        <img 
<<<<<<< HEAD
          src={getImageUrl(product.image)} 
=======
          src={`${BACKEND_URL}${product.image}`} 
>>>>>>> 2a1e0654be6f4795994a174fbf3eee304dc2bdc6
          alt={product.name} 
          loading="lazy" 
        />
        {isOutOfStock && <div className="stock-badge out-badge">Out of Stock</div>}
        {isLowStock && <div className="stock-badge low-badge">Only {product.stock} Left</div>}
        
        {/* Sleek, Non-Blocking Inline Micro-Toast Overlay */}
        {feedback.text && (
          <div className={`card-micro-toast ${feedback.type}-toast`}>
            {feedback.text}
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="product-card-body">
        <Link to={`/product/${product.id}`} className="product-title-link">
          <h3 className="product-title">{product.name}</h3>
        </Link>
        
        <p className="product-description">{product.description}</p>
        
        <div className="product-price-row">
          <span className="product-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
          <span className={`stock-indicator ${isOutOfStock ? "txt-danger" : "txt-muted"}`}>
            {isOutOfStock ? "Unavailable" : `Stock: ${product.stock}`}
          </span>
        </div>
      </div>

      {/* Product Actions Bottom Button Bar */}
      <div className="product-card-footer">
        {isOutOfStock ? (
          <button className="card-btn btn-disabled" disabled>
            Sold Out
          </button>
        ) : (
          <button onClick={addToCart} className="card-btn btn-primary">
            Add To Cart
          </button>
        )}
        
        <Link to={`/product/${product.id}`} className="card-btn btn-secondary">
          Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;