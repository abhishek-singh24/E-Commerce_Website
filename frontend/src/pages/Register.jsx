import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api.js";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  
  // Custom status banner state for clean inline UI notices
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
    setStatusMessage({ text: "", type: "" }); // Reset old status alerts

    try {
      const res = await API.post("/users/register", formData);
      
      // ✅ AUTOMATIC LOGIN: Save token & user if returned by backend
      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        window.dispatchEvent(new Event("cartUpdated"));
        
        setStatusMessage({
          text: "✨ Account created and logged in successfully! Redirecting...",
          type: "success"
        });

        setTimeout(() => {
          navigate("/"); // Send them straight to shop
        }, 1000);

      } else {
        // Fallback if backend only sends a success confirmation message
        setStatusMessage({
          text: res.data.message || "Registration Successful! Pushing to login panel...",
          type: "success"
        });

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Registration failed. Please try again.";
      setStatusMessage({ text: errMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="form-card">
          <h2>Create an Account</h2>
          <p className="subtitle">Join E-Shop today to manage your orders.</p>

          {/* Premium Status Banner Alternative to Windows Alerts */}
          {statusMessage.text && (
            <div className={`auth-status-banner ${statusMessage.type}-banner`}>
              {statusMessage.type === "success" ? "" : "⚠️ "}
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                autoComplete="off"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Register & Log In"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;