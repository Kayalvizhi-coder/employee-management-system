
const { MongoClient } = require('mongodb');

async function main() {
  await client.connect();

  const db = client.db('WalletDB');
  const collection = db.collection('transactions');

  console.log('Database and Collection Created');

  await client.close();
}

main();
