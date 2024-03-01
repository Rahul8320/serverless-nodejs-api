const serverless = require("serverless-http");
const express = require("express");
const { neon, neonConfig } = require("@neondatabase/serverless");

const app = express();
// env variable
const DATABASE_URL = process.env.DATABASE_URL;

async function dbClient() {
  try {
    console.log(`database: ${DATABASE_URL}`);
    neonConfig.fetchConnectionCache = true;
    const sql = neon(DATABASE_URL);
    return sql;
  } catch (error) {
    console.error("An error occurred", error);
  }
}

app.get("/", async (req, res, next) => {
  const sql = await dbClient();
  const [results] = await sql`select now();`;

  return res.status(200).json({
    message: "Hello from root!",
    results: results.now,
  });
});

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
