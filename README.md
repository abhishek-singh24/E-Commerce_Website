<div align="center">

# 🛍️ E-Commerce Shopping Website

A full-stack e-commerce platform where customers can browse products, manage carts, place orders, and pay online — with a complete admin dashboard to manage inventory, orders, and stock.

[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C2451?logo=razorpay&logoColor=white)](https://razorpay.com/)

</div>

---

## 📖 Introduction

The **E-Commerce Shopping Website** is a web-based platform that lets users browse products, manage shopping carts, place orders, and complete payments online. It gives customers a convenient shopping experience while helping businesses reach a wider audience through a digital sales channel.

## ❓ Problem Statement

Traditional shopping requires customers to visit physical stores, which costs time and effort, while businesses stay limited to their local reach. This project solves both problems by providing a secure, accessible, full-featured online shopping platform.

## 🎯 Objectives

- Develop a complete online shopping system
- Provide secure user authentication (JWT-based)
- Enable product browsing and searching
- Implement full shopping cart functionality
- Process customer orders efficiently
- Support real-time online payment integration
- Give admins full control over inventory and orders

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Vite), React Router, Axios, Bootstrap |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (`mysql2`) |
| **Auth** | JWT (`jsonwebtoken`), `bcrypt` / `bcryptjs` |
| **Payments** | Razorpay |
| **Version Control** | Git & GitHub |

---

## 🧩 System Modules

1. **User Authentication Module** — Register/login, JWT-secured sessions, role-based access (`user` / `admin`)
2. **Product Management Module** — Add, edit, delete, and view products
3. **Shopping Cart Module** — Add/update/remove items, live total calculation
4. **Order Management Module** — Place orders, track status, view order history
5. **Payment Processing Module** — Secure checkout via Razorpay
6. **Review & Rating Module** — Customers can rate and review purchased products
7. **Admin Dashboard Module** — Manage catalog, monitor stock, update order status, view sales stats

---

## ✨ Detailed Features

### 🛒 Product Catalog
- Product listing with images, prices, descriptions, and live stock status
- Product detail pages with reviews

### 🛍️ Shopping Cart
- Add, update, and remove items
- Automatic total cost calculation

### 📦 Order Management
- Place orders and track fulfillment status (Pending → Processing → Shipped → Delivered)
- Customers can view their full order history

### 💳 Payment Gateway
- Secure online transactions via Razorpay
- Payment confirmation and order status sync

### ⭐ Customer Reviews
- Star ratings and written feedback per product
- One review per user per product

### 🛠️ Admin Dashboard
- Live stats: total products, active customers, processed orders, gross earnings
- Low-stock inventory alerts
- Add/edit/delete products
- **Product images are added via direct Image URL** (e.g. Unsplash, Cloudinary, Imgur) instead of file uploads — this keeps the app lightweight and avoids server storage limits on free-tier hosting
- Order fulfillment pipeline with live status updates

---

## 🗄️ Database Design

**`users`**
| Column | Type |
|---|---|
| id | INT, PK, Auto Increment |
| name | VARCHAR(100) |
| email | VARCHAR(100), Unique |
| password | VARCHAR(255) |
| role | ENUM('user','admin') |
| created_at | TIMESTAMP |

**`products`**
| Column | Type |
|---|---|
| id | INT, PK, Auto Increment |
| name | VARCHAR(200) |
| description | TEXT |
| price | DECIMAL(10,2) |
| image | VARCHAR(255) — *stores an image URL* |
| stock | INT |
| created_at | TIMESTAMP |

**`cart`**
| Column | Type |
|---|---|
| id | INT, PK |
| user_id | INT, FK → users |
| product_id | INT, FK → products |
| quantity | INT |

**`orders`**
| Column | Type |
|---|---|
| id | INT, PK |
| user_id | INT, FK → users |
| customer_name | VARCHAR(100) |
| phone | VARCHAR(20) |
| address | TEXT |
| payment_method | VARCHAR(50) |
| total | DECIMAL(10,2) |
| status | VARCHAR(50) |
| created_at | TIMESTAMP |

**`order_items`**
| Column | Type |
|---|---|
| id | INT, PK |
| order_id | INT, FK → orders |
| product_id | INT, FK → products |
| quantity | INT |
| price | DECIMAL(10,2) |

**`reviews`**
| Column | Type |
|---|---|
| id | INT, PK |
| user_id | INT, FK → users |
| product_id | INT, FK → products |
| rating | INT |
| comment | TEXT |
| created_at | TIMESTAMP |

---

## 🏗️ System Architecture

```
        Customer
           ↓
   React Frontend (Vite)
           ↓
 Node.js + Express REST API
           ↓
      MySQL Database
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js & npm
- MySQL Server

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Set up the database
Run the SQL schema (your `.sql` file) in MySQL Workbench or CLI to create `ecommerce_db` with all tables and seed products.

### 3. Backend setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_db
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```
Run the server:
```bash
node server.js
```

### 4. Frontend setup
```bash
cd frontend
npm install
```
Create a `.env` file in `frontend/`:
```
VITE_API_URL=http://localhost:5000
```
Run the dev server:
```bash
npm run dev
```

---

## 🧠 Concepts Used

- CRUD Operations
- REST APIs
- JWT Authentication & Authorization
- Payment Gateway Integration
- Relational Database Design
- Error Handling & Input Validation

---

## 🚀 Expected Outcomes

A user-friendly shopping experience with secure transactions, efficient order processing, and a scalable full-stack architecture suitable for real-world deployment.

## 🔮 Future Enhancements

- 🤖 AI-based product recommendations
- ❤️ Wishlist functionality
- 📱 Mobile application
- 🌐 Multi-language support
- 📊 Advanced analytics dashboard
- 📈 Inventory prediction system

---

## 🏁 Conclusion

The **E-Commerce Shopping Website** is a comprehensive full-stack web application demonstrating frontend development, backend REST APIs, relational database management, and secure transaction handling — built to provide practical, real-world full-stack development experience.

---

<div align="center">

Made with ❤️ using React, Node.js & MySQL

</div>
