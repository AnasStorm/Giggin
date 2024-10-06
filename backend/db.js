const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

// Create a connection pool to handle multiple requests efficiently
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // Adjust the limit as needed
    queueLimit: 0
});

(async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL!');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        } else {
            console.error('Error connecting to the database:', err.message);
        }
    }
})();

module.exports = pool;
