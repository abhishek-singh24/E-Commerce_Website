import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api.js";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  
  // Custom inline status message state instead of window alerts
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ text: "", type: "" }); // Clear past errors/messages

    try {
      const res = await API.post("/users/login", formData);

      console.log("Login server response:", res.data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        window.dispatchEvent(new Event("cartUpdated"));

        // Display a clean inline success message
        setStatusMessage({
          text: res.data.message || "Welcome back! Login Successful.",
          type: "success"
        });

        // Give them a brief moment (800ms) to enjoy the success UI before redirecting
        setTimeout(() => {
          navigate("/");
        }, 800);
        
      } else {
        setStatusMessage({
          text: "Unexpected response format from server.",
          type: "error"
        });
      }

    } catch (error) {
      console.error("Login Error context:", error.response || error);

      const errMsg = error.response?.data?.message || 
                     error.response?.data?.error || 
                     "Invalid email or password. Please verify and try again.";
                     
      setStatusMessage({ text: errMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="form-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Log in to view your orders and speed through checkout.</p>

          {/* Premium Status Banner Box Replacement */}
          {statusMessage.text && (
            <div className={`auth-status-banner ${statusMessage.type}-banner`}>
              {statusMessage.type === "success" ? "✨ " : "⚠️ "}
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;