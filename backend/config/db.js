const mysql = require("mysql2");

// Added port & SSL support required for cloud MySQL (Aiven)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 17897,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

// Verify the connection pool is working on startup
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err.message || err);
    } else {
        console.log("✅ MySQL Pool Connected Successfully");
        connection.release(); // Release the test connection back to the pool
    }
});

module.exports = db;