
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
// Create Order
router.post("/", verifyToken,(req, res) => {

    console.log("ORDER DATA:", req.body);
    const {
        user_id,
        customer_name,
        phone,
        address,
        payment_method,
        total
    } = req.body;

    const sql = `
        INSERT INTO orders
        (
            user_id,
            customer_name,
            phone,
            address,
            payment_method,
            total
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user_id,
            customer_name,
            phone,
            address,
            payment_method,
            total
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Order placed successfully",
                orderId: result.insertId
            });

        }
    );

});

//save order items

router.post("/items",verifyToken, (req, res) => {

    const items = req.body;

    const sql = `
        INSERT INTO order_items
        (
            order_id,
            product_id,
            quantity,
            price
        )
        VALUES ?
    `;

    const values = items.map(item => [
        item.order_id,
        item.product_id,
        item.quantity,
        item.price
    ]);

    db.query(
        sql,
        [values],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Order items saved"
            });

        }
    );

});

// get all orders for admin

router.get("/", verifyAdmin,(req, res) => {

    const sql = `
        SELECT
            u.id AS user_id,
            u.name AS user_name,
            o.id AS order_id,
            p.id AS product_id,
            p.name AS product_name,
            oi.quantity,
            oi.price,
            o.total,
            o.payment_method,
            o.status
        FROM users u
        JOIN orders o
            ON u.id = o.user_id
        JOIN order_items oi
            ON o.id = oi.order_id
        JOIN products p
            ON oi.product_id = p.id
        ORDER BY o.id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});

//order status route
router.put("/status/:id", verifyAdmin,(req, res) => {

    const { status } = req.body;

    const sql =
        "UPDATE orders SET status = ? WHERE id = ?";

    db.query(
        sql,
        [status, req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Status updated"
            });

        }
    );

});

router.get("/user/:id",verifyToken, (req, res) => {

    const sql = `
        SELECT
            o.id AS order_id,
            o.total,
            o.status,
            o.created_at,
            p.name AS product_name,
            p.image,
            oi.quantity,
            oi.price
        FROM orders o
        JOIN order_items oi
            ON o.id = oi.order_id
        JOIN products p
            ON oi.product_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.id DESC
    `;

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

// admin dashoard statistic
router.get("/stats",verifyAdmin, (req, res) => {

    const stats = {};

    db.query(
        "SELECT COUNT(*) AS products FROM products",
        (err, result) => {

            if (err) return res.status(500).json(err);

            stats.products = result[0].products;

            db.query(
                "SELECT COUNT(*) AS users FROM users",
                (err, result) => {

                    if (err) return res.status(500).json(err);

                    stats.users = result[0].users;

                    db.query(
                        "SELECT COUNT(*) AS orders FROM orders",
                        (err, result) => {

                            if (err) return res.status(500).json(err);

                            stats.orders = result[0].orders;

                            db.query(
                                "SELECT IFNULL(SUM(total),0) AS revenue FROM orders",
                                (err, result) => {

                                    if (err) return res.status(500).json(err);

                                    stats.revenue = result[0].revenue;

                                    res.json(stats);

                                }
                            );

                        }
                    );

                }
            );

        }
    );

});


module.exports = router;