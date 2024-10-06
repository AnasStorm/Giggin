const db = require('../db'); // Import the MySQL connection from db.js

const User = {
    // Method to find a user by username
    findByUsername: async (username) => {
        try {
            const query = 'SELECT * FROM users WHERE username = ?';
            const [rows] = await db.execute(query, [username]); // Ensure db.execute returns a promise
            return rows; // Return the result set (could be empty)
        } catch (err) {
            throw new Error('Database error: ' + err.message);
        }
    },

    // Method to create a new user
    create: async (username, hashedPassword) => {
        try {
            const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
            const result = await db.execute(query, [username, hashedPassword]);
            return result;
        } catch (err) {
            throw new Error('Error creating user: ' + err.message);
        }
    }
};

module.exports = User;
