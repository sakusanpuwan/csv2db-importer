const knexdb = require("./config/knexdb.js");
const config = require("./config/config.js");

console.log('DB_USER:', config.DB_USER);
console.log('DB_PASSWORD:', config.DB_PASSWORD);
console.log('DB_CONNECTION_STRING:', config.DB_CONNECTION_STRING);
console.log('FILE_PATH:', config.FILE_PATH);

async function main() {
    const rows = await knexdb.select('*').from('MOVIES');
    console.table(rows);
    await knexdb.destroy(); // Close the database connection
};

main();

