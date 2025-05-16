const knexdb = require("./config/knexdb.js");
const config = require('./config/config.js')
const fs = require("fs");
const csvParser = require("csv-parser");
const filePath = config.FILE_PATH;
const tableName = config.TABLE_NAME;
const headers = config.TABLE_HEADERS;

async function index() {
    try {
        await main(filePath, tableName, headers);
        console.log(`CSV file processed and data inserted into ${tableName} table successfully.`);
    } catch (error) {
        console.error(error);
    } finally {
        console.log("Closing database connection...");
        await knexdb.destroy(); // Close the database connection
    }
}

async function main(filePath, tableName, headers) {
    const rows = await processCSV(filePath, headers);
    await createTable(tableName, headers);
    await insertData(tableName, rows);
}

async function processCSV(filePath, headers) {
    let isFirstRow = true; // Flag to skip the first row (header row)
    const rows = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser({ headers: headers }))
            .on("data", (row) => {
                if (isFirstRow) {
                    isFirstRow = false;
                    return;
                }
                rows.push(row);
            })
            .on("end", () => {
                console.log("CSV file successfully processed");
                console.log(`Parsed ${rows.length} rows`);
                resolve(rows);
            })
            .on("error", (error) => {
                console.error("Error processing CSV file:", error);
                reject(error);
            });
    });
}

async function createTable(tableName, headers) {
    try {
        const tableExists = await knexdb.schema.hasTable(tableName);
        if (tableExists) {
            console.log(`Table ${tableName} already exists`);
            return;
        }
        await knexdb.schema.createTable(tableName, (table) => {
            headers.forEach((header) => {
                table.string(header);
            });
        });
        console.log(`Table ${tableName} created successfully`);
        console.log(`Headers: ${headers}`);
    } catch (error) {
        throw new Error(`Error creating table: ${error.message}`, error);
    }

};

async function insertData(tableName, rows) {
    try {
        await knexdb(tableName).insert(rows);
        console.log(`Data inserted successfully into ${tableName}`);
        console.log(`Inserted ${rows.length} rows`);
    } catch (error) {
        throw new Error(`Error inserting data: ${error.message}`, error);
    }
};

if (require.main === module) {
    index(); // Execute the main function if this file is run directly only
}

module.exports = {
    main,
    processCSV,
    createTable,
    insertData
};
