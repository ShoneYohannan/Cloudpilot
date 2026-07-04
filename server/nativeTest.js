require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
  try {
    await client.connect();
    console.log("✅ Native MongoDB Driver Connected!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();