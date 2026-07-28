import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css"; 

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("search") || "";
    setSearch(query);
  }, [location.search]);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            TECH<span>STORE</span>
          </Link>
        </div>

        {/* Centered Search Bar */}
        <div className="nav-center">
          <form className="search-wrapper" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search products, brands, and more..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                navigate("/?search=" + encodeURIComponent(e.target.value));
              }}
            />
            <button type="submit" className="search-btn-icon" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </form>
        </div>

        {/* Navigation Links Right */}
        <div className="nav-right">
          <Link to="/" className="nav-item-link">Home</Link>

          {user?.role === "admin" && (
            <Link to="/admin" className="nav-item-link admin-tag">Admin</Link>
          )}

          {user && <Link to="/myorders" className="nav-item-link">Orders</Link>}

          <Link to="/cart" className="nav-item-link cart-link">
            <div className="cart-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            <span className="cart-text">Cart</span>
          </Link>

          <div className="nav-divider"></div>

          {user ? (
            <div className="user-menu">
              <span className="user-greeting">
                Hi, <strong>{user.name.split(" ")[0]}</strong>
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-nav-link">Log In</Link>
              <Link to="/register" className="register-nav-btn">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;