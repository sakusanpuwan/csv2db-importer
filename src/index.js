const knexdb = require("./config/knexdb.js");
const config = require('./config/config.js')
const fs = require("fs");
const csvParser = require("csv-parser");

const filePath = config.FILE_PATH;
const tableName = config.TABLE_NAME;
const headers = config.TABLE_HEADERS;
const rows = [];
let isFirstRow = true;

async function main() {
    fs.createReadStream(filePath)
        .pipe(csvParser({ headers: headers }))
        .on("data", (row) => {
            if (isFirstRow) {
                isFirstRow = false;
                return;
            }
            rows.push(row);
        })
        .on("end", async () => {
            console.log("CSV file successfully processed");
            try {
                await createTable();
                // await insertData();
                knexdb.destroy(); // Close the database connection
            } catch (error) {
                console.error(error);
            }

        })
        .on("error", (error) => {
            console.error("Error processing CSV file:", error);
        });
}

async function createTable() {
    try {
        const tableExists = await knexdb.schema.hasTable(tableName);
        if (tableExists) {
            console.log(`Table ${tableName} already exists`);
            return;
        }
        // Create the table if it doesn't exist
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

async function insertData() {
    try {
        await knexdb(tableName).insert(rows);
        console.log(`Data inserted successfully into ${tableName}`);
        console.log(`Inserted ${rows.length} rows`);
    } catch (error) {
        throw new Error(`Error inserting data: ${error.message}`, error);
    }
};

main();
