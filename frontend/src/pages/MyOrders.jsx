import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getUserOrders } from "../api/api";
import "./MyOrders.css";

function MyOrders() {
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getUserOrders(user.id);
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.order_id]) {
      acc[order.order_id] = {
        order_id: order.order_id,
        total: order.total,
        status: order.status,
        created_at: order.created_at,
        products: []
      };
    }
    acc[order.order_id].products.push({
      name: order.product_name,
      image: order.image,
      quantity: order.quantity,
      price: order.price
    });
    return acc;
  }, {});

  // Safe helper to return clean semantic color mappings based on order state values
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "badge-success";
      case "shipped": return "badge-info";
      case "processing": return "badge-warning";
      default: return "badge-pending";
    }
  };

  return (
    <>
      <Navbar />
      <main className="orders-view-wrapper">
        <h1 className="orders-page-title">Your Orders</h1>

        {Object.values(groupedOrders).length === 0 ? (
          <div className="no-orders-card">
            <h3>No orders found</h3>
            <p>You haven't purchased anything yet. Your order history will appear here once items are booked.</p>
          </div>
        ) : (
          <div className="orders-stack-list">
            {Object.values(groupedOrders).map((order) => (
              <div className="order-history-card" key={order.order_id}>

                {/* Order Top Meta Panel */}
                <div className="order-card-header">
                  <div className="header-meta-block">
                    <span className="meta-label">ORDER ID</span>
                    <span className="meta-value">#{order.order_id}</span>
                  </div>
                  <div className="header-meta-block">
                    <span className="meta-label">PLACED ON</span>
                    <span className="meta-value">{new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  </div>
                  <div className="header-meta-block right-aligned">
                    <span className="meta-label">STATUS</span>
                    <span className={`status-badge-capsule ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Embedded Line Items */}
                <div className="order-card-body-items">
                  {order.products.map((product, index) => (
                    <div className="order-product-row-item" key={index}>
                      <img
                        src={`${BACKEND_URL}${product.image}`}
                        alt={product.name}
                        loading="lazy"
                      />
                      <div className="order-product-meta-text">
                        <h5>{product.name}</h5>
                        <p className="product-qty-multiplier">Qty: {product.quantity}</p>
                        <p className="product-single-price">₹{Number(product.price).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Base Pricing Footer */}
                <div className="order-card-footer">
                  <span>Total Amount Paid:</span>
                  <span className="footer-computed-grand-total">₹{Number(order.total).toLocaleString('en-IN')}</span>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default MyOrders;