const env = require('./config.js'); // Import the config module
const knex = require('knex');
const knexConfig = require('./knexfile.js'); // Import the configuration file


const environment = env.NODE_ENV || 'development'; // Set the environment
const knexdb = knex(knexConfig[environment]); // Initialize Knex with the appropriate configuration

module.exports = knexdb; // Export the Knex instance for use in other modules