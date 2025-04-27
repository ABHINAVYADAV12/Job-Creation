// Script to add a `role` field to all UserProfile documents in MongoDB
// Default role is 'user'; you can manually update admins later or extend logic as needed.

import { MongoClient } from 'mongodb';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '../.env' });

const uri = process.env.DATABASE_URL;
if (!uri) {
  console.error('DATABASE_URL not set in environment variables.');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(); // Uses DB name from URI
    const userProfiles = db.collection('UserProfile');

    // Update all documents that do NOT have a role field
    const result = await userProfiles.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user' } }
    );

    console.log(`Updated ${result.modifiedCount} user profiles with default role 'user'.`);
  } catch (err) {
    console.error('Error updating user profiles:', err);
  } finally {
    await client.close();
  }
}

main();
