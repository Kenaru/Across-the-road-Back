const mysql = require('mysql2');
require('dotenv').config();

// Define the pool using environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',  // Default to 'localhost' if not defined
    user: process.env.DB_USER || 'root',       // Default to 'root' if not defined
    password: process.env.DB_PASSWORD || '',  // Default to 'root' if not defined
    database: process.env.DB_NAME || 'atr',    // Default to 'atr' if not defined
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export the promise() method of the pool
module.exports = pool.promise();
