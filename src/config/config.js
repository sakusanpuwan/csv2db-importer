const path = require("path");
const fs = require("fs");

require("dotenv").config({ path: path.join(process.cwd(), ".env") });


if (process.env.DB_USER) {
    console.log(".env file loaded successfully");
    console.log(`DB_USER: ${process.env.DB_USER}`);
    console.log(`DB URL: ${process.env.DB_CONNECTION_STRING}`);
};

if (!process.env.NODE_ENV) {
    console.error("NODE_ENV is not set. Please set it in your .env file. Defaulting to 'development'.");
    process.env.NODE_ENV = "development";
};

const configPath = path.join(process.cwd(), "config.json");
let config;
try {
    const configData = fs.readFileSync(configPath, "utf-8");
    config = JSON.parse(configData);
    console.log("config.json loaded successfully:", config);
} catch (error) {
    console.error(`Error loading config.json from ${configPath}:`, error.message);
    process.exit(1);
}

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    FILE_PATH: process.env.FILE_PATH,
    TABLE_NAME: config.TABLE_NAME,
    TABLE_HEADERS: config.TABLE_HEADERS,
};