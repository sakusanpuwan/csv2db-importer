require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    FILE_PATH: process.env.FILE_PATH,
};