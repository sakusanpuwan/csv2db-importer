// This is a configuration file for Knex.js, a SQL query builder for Node.js.
// It defines the database connection settings for different environments: development, test, and production.
const config = require('./config'); 

const { DB_USER, DB_PASSWORD, DB_CONNECTION_STRING } = config;

const knexConfig = {
  development: {
    client: 'oracledb',
    connection: {
      user: DB_USER, 
      password: DB_PASSWORD,
      connectString: DB_CONNECTION_STRING
    },
    pool: { min: 0, max: 7 }
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:', // in-memory DB
    },
    useNullAsDefault: true, // required for SQLite
  },
  // production: {
  //   client: 'oracledb',
  //   connection: {
  //     user: 'prod_user',
  //     password: 'prod_pass',
  //     connectString: 'prod-db/XEPDB1',
  //   },
  // },
};

module.exports = knexConfig;