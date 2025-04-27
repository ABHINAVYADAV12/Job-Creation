// Usage: node scripts/mongo_force_applied_jobs.js
// This script directly connects to MongoDB and ensures every UserProfile has appliedJobs: [] if missing.

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.DATABASE_URL;
const dbName = uri.match(/\/(\w+)\?/)?.[1] || 'jobportal';

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const userProfiles = db.collection('UserProfile');
    const result = await userProfiles.updateMany(
      { appliedJobs: { $exists: false } },
      { $set: { appliedJobs: [] } }
    );
    console.log(`Updated ${result.modifiedCount} user profiles to add appliedJobs: []`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
