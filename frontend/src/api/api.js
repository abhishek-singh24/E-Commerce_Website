import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`
});

// Axios Request Interceptor: Injects JWT token automatically if logged in
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    }, 
    (error) => {
        return Promise.reject(error);
    }
);

// Named API Exports
export const createOrder = (data) => API.post("/orders", data);
export const saveOrderItems = (data) => API.post("/orders/items", data);
export const getOrders = () => API.get("/orders");
export const updateOrderStatus = (id, status) => API.put(`/orders/status/${id}`, { status });
export const getUserOrders = (id) => API.get(`/orders/user/${id}`);
export const updateStock = (items) => API.put("/products/stock", items);
export const getReviews = (id) => API.get(`/products/${id}/reviews`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);
export const updateReview = (id, data) => API.put(`/products/${id}/reviews`, data);
export const deleteReview = (reviewId) => API.delete(`/products/reviews/${reviewId}`);
export const createPaymentOrder = (amount) => API.post("/payment/create-order", { amount });

// FIXED: Default export must come after the declaration 
export default API;