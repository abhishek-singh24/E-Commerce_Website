import { useState } from "react";
import Navbar from "../components/Navbar";
import { createOrder, saveOrderItems, updateStock, createPaymentOrder } from "../api/api";
import "./Checkout.css";

function Checkout() {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
    payment_method: "COD"
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Modern Alert/Modal State Management
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info", // "info", "error", or "success"
    onCloseAction: null
  });

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);

  // Quick helper to summon our polished UI Alert
  const showAlert = (title, message, type = "info", onCloseAction = null) => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type,
      onCloseAction
    });
  };

  const closeAlert = () => {
    const nextAction = alertModal.onCloseAction;
    setAlertModal({ isOpen: false, title: "", message: "", type: "info", onCloseAction: null });
    if (nextAction) nextAction();
  };

  const payWithRazorpay = async () => {
    if (!window.Razorpay) {
      showAlert(
        "Network Connection Issue",
        "Razorpay SDK failed to load. Please check your internet connection and try reloading.",
        "error"
      );
      return;
    }
    try {
      setIsProcessing(true);
      const { data } = await createPaymentOrder(total);
      const razorpayOrderId = data.id || data.order?.id;

      if (!razorpayOrderId) {
        throw new Error("Razorpay Order Creation Failed on backend.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount || data.order?.amount,
        currency: data.currency || data.order?.currency || "INR",
        name: "E-Shop",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function () {
          await placeOrder();
        },
        prefill: {
          name: formData.customer_name,
          contact: formData.phone,
          email: user.email || ""
        },
        theme: { color: "#2563eb" },
        modal: { ondismiss: () => setIsProcessing(false) }
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
      showAlert(
        "Payment Setup Error",
        error.response?.data?.message || error.message,
        "error"
      );
      setIsProcessing(false);
    }
  };

  const placeOrder = async () => {
    if (!user.id) {
      showAlert("Authentication Required", "Please log in to your account before checking out.", "info");
      return;
    }
    try {
      setIsProcessing(true);
      const orderData = {
        user_id: user.id,
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: formData.address,
        payment_method: formData.payment_method,
        total: total
      };

      const res = await createOrder(orderData);
      const orderId = res.data.orderId;

      const orderItems = cart.map(item => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity || 1,
        price: item.price
      }));

      await saveOrderItems(orderItems);
      await updateStock(orderItems);

      localStorage.removeItem("cart");

      // Smooth modern victory screen instead of standard blocking window alert
      showAlert(
        "🎉 Order Placed!",
        `Thank you for shopping with us! Your order #${orderId} has been successfully registered.`,
        "success",
        () => {
          window.location.href = "/";
        }
      );
    } catch (err) {
      console.error(err);
      showAlert(
        "Transaction Failed",
        err.response?.data?.message || "An unexpected error occurred while saving your transaction details.",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <main className="checkout-view-wrapper">
        <div className="checkout-split-layout">
          {/* Shipping Form Card */}
          <div className="checkout-card form-split">
            <h2>Shipping Information</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-input-group">
                <label htmlFor="customer_name">Customer Name</label>
                <input
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="address">Shipping Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat No, Street, Landmark, City, Pincode"
                  rows="4"
                  required
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="payment_method">Payment Option</label>
                <select
                  id="payment_method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                >
                  <option value="COD">Cash On Delivery (COD)</option>
                  <option value="UPI">UPI / Card Payment (Razorpay)</option>
                </select>
              </div>
            </form>
          </div>

          {/* Order Summary Sticky Card */}
          <div className="checkout-card summary-split">
            <h2>Order Summary</h2>
            <div className="summary-items-list">
              {cart.map((item, idx) => (
                <div key={idx} className="summary-item-row">
                  <span className="item-text-title">
                    {item.name} <strong>x{item.quantity || 1}</strong>
                  </span>
                  <span className="item-price-val">₹{(Number(item.price) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals-divider"></div>
            
            <div className="summary-total-row">
              <span>Grand Total</span>
              <span className="grand-total-price">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              className="checkout-submit-btn"
              disabled={isProcessing || cart.length === 0}
              onClick={() => {
                if (!formData.customer_name || !formData.phone || !formData.address) {
                  showAlert("Missing Information", "Please fill out all address and contact fields first.", "info");
                  return;
                }
                if (formData.payment_method === "COD") {
                  placeOrder();
                } else {
                  payWithRazorpay();
                }
              }}
            >
              {isProcessing ? "Processing Order..." : formData.payment_method === "COD" ? "Confirm Order (COD)" : "Proceed to Secure Payment"}
            </button>
          </div>
        </div>
      </main>

      {/* Styled Modern Modal Overlay Alternative to Window Alerts */}
      {alertModal.isOpen && (
        <div className="pdp-modal-overlay">
          <div className={`pdp-modal-box scale-up-animation ${alertModal.type}-container`}>
            <div className="pdp-modal-header">
              <h3>{alertModal.title}</h3>
            </div>
            <div className="pdp-modal-body">
              <p>{alertModal.message}</p>
            </div>
            <div className="pdp-modal-actions">
              <button className={`pdp-modal-btn ${alertModal.type}-btn`} onClick={closeAlert}>
                {alertModal.type === "success" ? "Continue to Home" : "Dismiss"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Checkout;