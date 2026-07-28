import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API, { getOrders, updateOrderStatus } from "../api/api";
import "./Admin.css";
import Footer from "../components/Footer";

function Admin() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  
  // Adjusted State: Holds fields cleanly
  const [product, setProduct] = useState({ 
    name: "", 
    description: "", 
    price: "", 
<<<<<<< HEAD
    image: "", 
=======
    image: null, 
>>>>>>> 2a1e0654be6f4795994a174fbf3eee304dc2bdc6
    stock: "" 
  });
  
  // Local state for rendering a local visual preview string url
  const [previewUrl, setPreviewUrl] = useState("");

  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchLowStock = async () => {
    try {
      const res = await API.get("/products");
      const low = res.data.filter(product => product.stock <= 5);
      setLowStock(low);
    } catch (error) { console.error(error); }
  };

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/orders/stats");
      setStats(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchStats();
    fetchLowStock();
  }, []);

  const handleChange = (e) => {
<<<<<<< HEAD
    const { name, value } = e.target;
    if (name === "image") {
      setProduct({ ...product, image: value });
      // Live preview as the admin types/pastes the URL
      setPreviewUrl(value);
=======
    const { name, value, files } = e.target;
    if (name === "image") {
      const selectedFile = files[0];
      if (selectedFile) {
        setProduct({ ...product, image: selectedFile });
        // Generate temporary preview link
        setPreviewUrl(URL.createObjectURL(selectedFile));
      }
>>>>>>> 2a1e0654be6f4795994a174fbf3eee304dc2bdc6
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      const payload = {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image || ""
      };

      if (editId) {
        const res = await API.put(`/products/update/${editId}`, payload);
=======
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      
      // Check if product.image is a File object (user chose a new asset)
      if (product.image instanceof File) {
        formData.append("image", product.image);
      } else if (typeof product.image === "string") {
        // If it's a string path, pass it as a text field key separate from 'image'
        formData.append("existingImage", product.image);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };

      if (editId) {
        const res = await API.put(`/products/update/${editId}`, formData, config);
>>>>>>> 2a1e0654be6f4795994a174fbf3eee304dc2bdc6
        setMessage(res.data.message);
        setTimeout(() => setMessage(""), 3000);
        setEditId(null);
      } else {
<<<<<<< HEAD
        const res = await API.post("/products/add", payload);
=======
        const res = await API.post("/products/add", formData, config);
>>>>>>> 2a1e0654be6f4795994a174fbf3eee304dc2bdc6
        setMessage(res.data.message);
        setTimeout(() => setMessage(""), 3000);
      }

      // Reset application states cleanly
<<<<<<< HEAD
      setProduct({ name: "", description: "", price: "", image: "", stock: "" });
      setPreviewUrl("");
=======
      setProduct({ name: "", description: "", price: "", image: null, stock: "" });
      setPreviewUrl("");
      
      const fileInput = document.getElementById("adminProductImageInput");
      if (fileInput) fileInput.value = "";
>>>>>>> 2a1e0654be6f4795994a174fbf3eee304dc2bdc6

      fetchProducts();
      fetchStats();
      fetchLowStock();
    } catch (error) { 
      console.error("Frontend submit error:", error); 
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product template permanently?")) return;
    try {
      await API.delete(`/products/delete/${id}`);
      fetchProducts();
      fetchStats();
      fetchLowStock();
    } catch (error) { console.error(error); }
  };

  const editProduct = (prod) => {
    setEditId(prod.id);
    setProduct({
      name: prod.name,
      description: prod.description,
      price: prod.price,
<<<<<<< HEAD
      image: prod.image || "",
      stock: prod.stock
    });

    // Preview: handle both new full-URL images and old server-uploaded paths
    if (prod.image) {
      if (prod.image.startsWith("http")) {
        setPreviewUrl(prod.image);
      } else {
        const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        setPreviewUrl(prod.image.startsWith("/") ? `${BACKEND_URL}${prod.image}` : `${BACKEND_URL}/uploads/${prod.image}`);
      }
    } else {
      setPreviewUrl("");
=======
      image: prod.image, // 🛠️ FIXED: Stores the existing image path fallback string instead of clean null override
      stock: prod.stock
    });
    
    // Check if image is an absolute/relative server path string and format preview safely
    if (typeof prod.image === "string" && prod.image.startsWith("/")) {
      setPreviewUrl(`http://localhost:5000${prod.image}`);
    } else {
      setPreviewUrl(prod.image || "");
>>>>>>> 2a1e0654be6f4795994a174fbf3eee304dc2bdc6
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (error) { console.error(error); }
  };

  return (
    <>
      <Navbar />
      <main className="admin-dashboard-view">
        <h1 className="dashboard-title">Admin Controller Center</h1>

        {message && <div className="admin-status-toast-alert">{message}</div>}

        {/* Stats Grid Indicators */}
        <div className="admin-stats-grid">
          <div className="stat-metric-card">
            <span className="metric-label">Total Products</span>
            <h3>{stats.products}</h3>
          </div>
          <div className="stat-metric-card">
            <span className="metric-label">Active Customers</span>
            <h3>{stats.users}</h3>
          </div>
          <div className="stat-metric-card">
            <span className="metric-label">Processed Orders</span>
            <h3>{stats.orders}</h3>
          </div>
          <div className="stat-metric-card revenue-highlight">
            <span className="metric-label">Gross Earnings</span>
            <h3>₹{Number(stats.revenue).toLocaleString('en-IN')}</h3>
          </div>
        </div>

        {/* Inventory Warning Alerts Banner Section */}
        {lowStock.length > 0 && (
          <div className="inventory-alert-panel-card">
            <h3>⚠️ Low Stock Inventory Alert</h3>
            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>SKU ID</th>
                    <th>Product Model Name</th>
                    <th>Current stock Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((prod) => (
                    <tr key={prod.id}>
                      <td>#{prod.id}</td>
                      <td><strong>{prod.name}</strong></td>
                      <td><span className="critical-stock-tag">{prod.stock} units remaining</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dual Split Manager Layout Blocks */}
        <div className="admin-dual-column-layout">
          {/* Inventory Manager Form Panel */}
          <div className="admin-panel-card">
            <h3>{editId ? "Update Product Specifications" : "Provision New Catalog Product"}</h3>
            <form onSubmit={handleSubmit} className="admin-management-form">
              <div className="admin-input-group">
                <input name="name" value={product.name} placeholder="Product Title" onChange={handleChange} required />
              </div>
              <div className="admin-input-group">
                <input name="description" value={product.description} placeholder="Short Description Summary" onChange={handleChange} required />
              </div>
              <div className="admin-input-group">
                <input type="number" name="price" value={product.price} placeholder="Price Tag (INR)" onChange={handleChange} required />
              </div>
              
<<<<<<< HEAD
              {/* Image URL Input Field Block */}
              <div className="admin-input-group image-upload-field-container">
                <label htmlFor="adminProductImageInput" className="custom-file-upload-label">
                  Product Image URL
                </label>
                <input
                  id="adminProductImageInput"
                  name="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={product.image}
                  onChange={handleChange}
                  required={!editId}
                />

                {/* Dynamically Render Image Preview */}
                {previewUrl && (
                  <div className="product-image-preview-wrapper">
                    <p>Image Preview:</p>
                    <img
                      src={previewUrl}
                      alt="Product preview"
                      className="image-preview-thumbnail"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
=======
              {/* File Uploader Container Field Block */}
              <div className="admin-input-group image-upload-field-container">
                <label htmlFor="adminProductImageInput" className="custom-file-upload-label">
                  {editId ? "Replace Product Image (Optional)" : "Choose Product Image File"}
                </label>
                <input 
                  id="adminProductImageInput"
                  name="image" 
                  type="file" 
                  accept="image/*"
                  onChange={handleChange} 
                  required={!editId} 
                />
                
                {/* Dynamically Render Image Preview */}
                {previewUrl && (
                  <div className="product-image-preview-wrapper">
                    <p>Selected Asset Preview:</p>
                    <img src={previewUrl} alt="Product preview" className="image-preview-thumbnail" />
>>>>>>> 2a1e0654be6f4795994a174fbf3eee304dc2bdc6
                  </div>
                )}
              </div>

              <div className="admin-input-group">
                <input type="number" name="stock" value={product.stock} placeholder="Initial Stock Allocation" onChange={handleChange} required />
              </div>
              <button type="submit" className="admin-form-submit-btn">
                {editId ? "Apply Modifications" : "Deploy Product To Live Store"}
              </button>
            </form>
          </div>

          {/* Catalog Spreadsheet Records Table */}
          <div className="admin-panel-card full-spread">
            <h3>Current Catalog Inventory</h3>
            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product Item Title</th>
                    <th>Retail Price</th>
                    <th>Stock Allocation</th>
                    <th>Management Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id}>
                      <td>#{prod.id}</td>
                      <td>{prod.name}</td>
                      <td>₹{Number(prod.price).toLocaleString('en-IN')}</td>
                      <td>{prod.stock === 0 ? <span className="admin-stock-pill empty">Sold Out</span> : prod.stock <= 5 ? <span className="admin-stock-pill panic">{prod.stock} left</span> : <span className="admin-stock-pill healthy">{prod.stock} items</span>}</td>
                      <td>
                        <div className="row-action-buttons-wrap">
                          <button className="control-act-btn edit-act" onClick={() => editProduct(prod)}>Edit</button>
                          <button className="control-act-btn delete-act" onClick={() => deleteProduct(prod.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Global Operations Order Flow Pipeline Table */}
        <div className="admin-panel-card mt-32">
          <h3>Customer Orders Fulfillment Pipeline</h3>
          <div className="table-responsive-wrapper">
            <table className="admin-data-table variant-orders">
              <thead>
                <tr>
                  <th>Order Info</th>
                  <th>Customer Identity</th>
                  <th>Purchased Item Specifications</th>
                  <th>Computed Net Total</th>
                  <th>Fulfillment Status Trigger</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="order-block-id">ID: #{ord.order_id}</span>
                    </td>
                    <td>
                      <div className="customer-cell-meta">
                        <span>{ord.user_name}</span>
                        <small>UID: #{ord.user_id}</small>
                      </div>
                    </td>
                    <td>
                      <div className="product-inline-cell">
                        <strong>{ord.product_name}</strong>
                        <span>(Qty: {ord.quantity} × Price: ₹{Number(ord.price).toLocaleString('en-IN')})</span>
                      </div>
                    </td>
                    <td><strong>₹{(Number(ord.price) * ord.quantity).toLocaleString('en-IN')}</strong></td>
                    <td>
                      <select value={ord.status} onChange={(e) => handleStatusChange(ord.order_id, e.target.value)} className="admin-status-dropdown-select">
                        <option value="Pending">Pending Validation</option>
                        <option value="Processing">Processing / Packaging</option>
                        <option value="Shipped">Shipped Logistics Carrier</option>
                        <option value="Delivered">Delivered & Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Admin;