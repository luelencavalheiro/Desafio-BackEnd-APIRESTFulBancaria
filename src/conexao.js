const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 3000,
    user: 'postgres',
    password: '123456',
    database: 'biblioteca',
})

module.exports = pool