process.env.NODE_ENV = "test";

const fs = require("fs");
const path = require("path");
const knexdb = require("./config/knexdb.js");
const config = require("./config/config.js");
const { main, processCSV, createTable, insertData } = require("./index");

const TEST_CSV_PATH = path.join(__dirname, "../data/test.csv");
const TEST_TABLE = config.TABLE_NAME;
const TEST_HEADERS = config.TABLE_HEADERS;

beforeAll(async () => {
    const rows = [
        TEST_HEADERS.join(","),
        "1,Inception,2010,8.8,148",
        "2,The Dark Knight,2008,9.0,152"
    ]; // Sample CSV data
    fs.writeFileSync(TEST_CSV_PATH, rows.join("\n"), "utf8"); // Creates a test CSV file
    process.env.FILE_PATH = TEST_CSV_PATH; // Set the file path in the environment variable
});

beforeEach(async () => {
    await knexdb.schema.dropTableIfExists(TEST_TABLE); // Drop the test table if it exists before each test
});

afterAll(async () => {
    fs.unlinkSync(TEST_CSV_PATH); // Clean up the test CSV file
    await knexdb.schema.dropTableIfExists(TEST_TABLE);
    await knexdb.destroy();
});

describe("processCSV", () => {
    it("parses CSV and skips header row", async () => {
        const rows = await processCSV(TEST_CSV_PATH, TEST_HEADERS);
        expect(rows.length).toBe(2);
        expect(rows[1]).toMatchObject({
            RANK: "2",
            TITLE: "The Dark Knight",
            YEAR: "2008",
            RATING: "9.0",
            RUNTIME: "152"
        });
    });
});

describe("createTable", () => {
    it("creates the table if it does not exist", async () => {
        await createTable(TEST_TABLE, TEST_HEADERS);
        const exists = await knexdb.schema.hasTable(TEST_TABLE);
        expect(exists).toBe(true);
    });
});

describe("insertData", () => {
    it("inserts data into the table", async () => {
        await createTable(TEST_TABLE, TEST_HEADERS);
        const rows = [
            { RANK: "1", TITLE: "Inception", YEAR: "2010", RATING: "8.8", RUNTIME: "148" },
            { RANK: "2", TITLE: "The Dark Knight", YEAR: "2008", RATING: "9.0", RUNTIME: "152" }
        ];
        await insertData(TEST_TABLE, rows);
        const dbRows = await knexdb(TEST_TABLE).select();
        expect(dbRows.length).toBe(2);
        expect(dbRows[0]).toMatchObject(rows[0]);
        expect(dbRows[1]).toMatchObject(rows[1]);
    });
});

describe("main", () => {
    it("main successful", async () => {
        await main(TEST_CSV_PATH, TEST_TABLE, TEST_HEADERS);
        const rows = await knexdb(TEST_TABLE).select();
        console.table(rows);
        expect(rows.length).toBe(2);
        expect(rows[0]).toMatchObject({
            RANK: "1",
            TITLE: "Inception",
            YEAR: "2010",
            RATING: "8.8",
            RUNTIME: "148"
        });
        expect(rows[1]).toMatchObject({
            RANK: "2",
            TITLE: "The Dark Knight",
            YEAR: "2008",
            RATING: "9.0",
            RUNTIME: "152"
        });
    });
});
