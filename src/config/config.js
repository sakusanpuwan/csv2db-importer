require('dotenv').config();

module.exports = {
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    NODE_ENV: process.env.NODE_ENV || 'development',
    FILE_PATH: process.env.FILE_PATH || './data/imdb_top_250.csv',
    TABLE_NAME: process.env.TABLE_NAME || 'TOP_MOVIES',
};