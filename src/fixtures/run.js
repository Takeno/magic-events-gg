require('dotenv-flow').config();
const {populateDb, resetDb, verifyDb} = require('./index');

async function run() {
  // await verifyDb();
  await resetDb();
  await populateDb();
}

run();
