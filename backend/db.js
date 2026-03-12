const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'buildsphere',
    user: 'postgres',
    password: 'admin123',
});

module.exports = pool;
