const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "task_manager",
  password: "",
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function query(query, value) {
  try {
    const [executeQuery] = await db.query(query, value ?? []);
    return executeQuery;
  } catch (error) {
    throw error;
  }
}

module.exports = query;
