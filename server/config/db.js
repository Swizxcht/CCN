const mysql = require("mysql2");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

if (process.env.DB_PORT) {
  dbConfig.port = Number(process.env.DB_PORT);
}

if (process.env.DB_SSL === "true") {
  dbConfig.ssl = {
    rejectUnauthorized: true,
  };
}

const db = mysql.createPool(dbConfig);

module.exports = db;
