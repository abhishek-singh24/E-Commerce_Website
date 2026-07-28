import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API, { getReviews, addReview, updateReview, deleteReview } from "../api/api";
import "./ProductDetails.css";
import Footer from "../components/Footer";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Tracks which specific review is currently showcasing the confirmation toggle
  const [deletingId, setDeletingId] = useState(null);

  // Helper function to dynamically process image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    if (imagePath.startsWith("http")) return imagePath;

    const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return imagePath.startsWith("/") ? `${BACKEND_URL}${imagePath}` : `${BACKEND_URL}/uploads/${imagePath}`;
  };

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await getReviews(id);
      setReviews(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const userReview = reviews.find(item => item.user_id === user?.id);

  useEffect(() => {
    if (userReview) {
      setReview({ rating: userReview.rating, comment: userReview.comment });
    } else {
      setReview({ rating: 5, comment: "" });
    }
  }, [userReview]);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="pdp-loading-spinner">Loading item specifications...</div>
      </>
    );
  }

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
      if (existingProduct.quantity >= product.stock) return;
      existingProduct.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const submitReview = async () => {
    try {
      await addReview(id, { user_id: user.id, rating: review.rating, comment: review.comment });
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const editReview = async () => {
    try {
      await updateReview(id, { user_id: user.id, rating: review.rating, comment: review.comment });
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setDeletingId(null); // Reset inline prompt tracking on completion
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, item) => sum + Number(item.rating), 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <>
      <Navbar />
      <main className="pdp-layout-container">
        {/* Top Product Identity Split Grid */}
        <div className="pdp-main-card">
          <div className="pdp-gallery-panel">
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name} 
              loading="lazy" 
            />
          </div>

          <div className="pdp-details-panel">
            <h1 className="pdp-title">{product.name}</h1>
            
            <div className="pdp-rating-strip">
              <span className="stars-val">⭐ {averageRating}</span>
              <span className="count-label">({reviews.length} Verified Reviews)</span>
            </div>

            <div className="pdp-price-tag">₹{Number(product.price).toLocaleString('en-IN')}</div>
            
            <p className="pdp-description-body">{product.description}</p>

            <div className="pdp-stock-status-row">
              <span className="status-label">Availability:</span>
              {product.stock > 0 ? (
                <span className="status-indicator-tag status-in">In Stock ({product.stock} units)</span>
              ) : (
                <span className="status-indicator-tag status-out">Out of Stock</span>
              )}
            </div>

            <button
              className="pdp-add-cart-btn"
              onClick={addToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? "Add to Shopping Bag" : "Temporarily Sold Out"}
            </button>
          </div>
        </div>

        {/* Bottom Split Layout: Reviews Feed & Review Composer */}
        <div className="pdp-reviews-split-grid">
          {/* Reviews Stream Container */}
          <div className="pdp-sub-section-card">
            <h3>Customer Feedback</h3>
            {reviews.length === 0 ? (
              <p className="pdp-empty-state-text">No reviews posted for this item yet.</p>
            ) : (
              <div className="pdp-reviews-stream">
                {reviews.map((item) => (
                  <div key={item.id} className="pdp-review-bubble">
                    <div className="bubble-header">
                      <h5>{item.name || "Verified Buyer"}</h5>
                      
                      {/* Contextual Inline Deletion UI */}
                      {(user?.id === item.user_id || user?.role === "admin") && (
                        <div className="review-action-container">
                          {deletingId === item.id ? (
                            <div className="pdp-inline-confirm-box">
                              <span className="confirm-text">Delete?</span>
                              <button 
                                className="confirm-btn-yes" 
                                onClick={() => handleDeleteReview(item.id)}
                              >
                                Yes
                              </button>
                              <button 
                                className="confirm-btn-no" 
                                onClick={() => setDeletingId(null)}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button 
                              className="review-delete-action-btn" 
                              onClick={() => setDeletingId(item.id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="bubble-rating-row">{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</div>
                    <p className="bubble-comment-body">{item.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Review Composer Form */}
          {user ? (
            <div className="pdp-sub-section-card">
              <h3>{userReview ? "Modify Your Review" : "Share Your Experience"}</h3>
              <div className="composer-form-inner">
                <div className="form-element-block">
                  <label>Select Rating</label>
                  <select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                    <option value="5">5 Stars — Excellent</option>
                    <option value="4">4 Stars — Good</option>
                    <option value="3">3 Stars — Average</option>
                    <option value="2">2 Stars — Poor</option>
                    <option value="1">1 Star — Terrible</option>
                  </select>
                </div>

                <div className="form-element-block">
                  <label>Write Your Review</label>
                  <textarea
                    rows="4"
                    placeholder="Describe product quality, shipping experience, or packaging details..."
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  />
                </div>

                <button className="composer-submit-btn" onClick={userReview ? editReview : submitReview}>
                  {userReview ? "Update Review Statement" : "Publish Review"}
                </button>
              </div>
            </div>
          ) : (
            <div className="pdp-sub-section-card non-auth-alert">
              <p>Please <a href="/login">log in</a> to post product reviews.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ProductDetails;