// models/User.js
const mysql = require('mysql2');
const db = require('../db'); // Import your database connection

const Reward = {
    create: (label, price, callback) => {
        const sql = 'INSERT INTO rewards (label, price) VALUES (?, ?)';
        db.query(sql, [label, price], callback);
    },

    getAll: (callback) => {
        const sql = 'SELECT * FROM rewards';
        db.query(sql, [], callback);
    }
};

module.exports = Reward;
