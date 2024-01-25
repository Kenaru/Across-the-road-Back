const mysql = require('mysql2');
require('dotenv').config();


const pool = mysql.createPool({
    connectionLimit: 10, // Limite du pool de connexions
    host: '109.234.165.230', // Adresse de votre base de données
    user: 'biau7663_acrosstheroad',
    password: 'FTQkmTg4T1OHwCCcp0',
    database: 'biau7663_acrosstheroad',
});

// Exporter la méthode promise() du pool
module.exports = pool.promise();
