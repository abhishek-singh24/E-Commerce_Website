import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "./Cart.css";
import Footer from "../components/Footer";

function Cart() {
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const total = cart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);

  const updateQuantity = (index, change) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += change;

    if (updatedCart[index].quantity <= 0) {
      updatedCart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <>
      <Navbar />
      <main className="cart-view-container">
        <h1 className="cart-view-title">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="cart-empty-card">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart feels light</h2>
            <p>There are no products added here yet. Explore our storefront to find great items.</p>
            <Link to="/" className="continue-shopping-link">Back to Store</Link>
          </div>
        ) : (
          <div className="cart-split-engine">
            {/* Left Items Column */}
            <div className="cart-items-column">
              {cart.map((item, index) => (
                <div className="cart-item-card" key={index}>
                  {/* 🛠️ FIXED: Prepend BACKEND_URL so the browser can locate the uploaded asset */}
                  <img 
                    src={item.image && item.image.startsWith("http") ? item.image : `${BACKEND_URL}${item.image}`} 
                    alt={item.name} 
                    className="cart-product-thumbnail"
                  />
                  
                  <div className="cart-item-details">
                    <div className="details-header-row">
                      <h3>{item.name}</h3>
                      <button className="item-delete-btn" onClick={() => removeFromCart(index)} aria-label="Delete item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>

                    <div className="details-footer-row">
                      <div className="cart-quantity-capsule">
                        <button onClick={() => updateQuantity(index, -1)} disabled={item.quantity <= 1}>-</button>
                        <span>{item.quantity || 1}</span>
                        <button onClick={() => updateQuantity(index, 1)} disabled={item.quantity >= item.stock}>+</button>
                      </div>
                      <span className="cart-item-price-computed">
                        ₹{(Number(item.price) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Summary Panel Card */}
            <div className="cart-summary-panel">
              <h3>Price Summary</h3>
              <div className="summary-row-line">
                <span>Items Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row-line">
                <span>Shipping Fee</span>
                <span className="txt-success">FREE</span>
              </div>
              <div className="panel-divider-line"></div>
              <div className="summary-row-line total-highlight">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <Link to="/checkout" className="checkout-cta-btn-link">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Cart;