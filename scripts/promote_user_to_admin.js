// Script to promote a user to admin by email or userId (ESM version)
// Usage: node scripts/promote_user_to_admin.js <email or userId>

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve .env in project root, regardless of where the script is run from
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const uri = process.env.DATABASE_URL;
if (!uri) {
  console.error('DATABASE_URL not set in environment variables. Tried loading from:', envPath);
  process.exit(1);
}

const identifier = process.argv[2];
if (!identifier) {
  console.error('Usage: node scripts/promote_user_to_admin.js <email or userId>');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const userProfiles = db.collection('UserProfile');

    // Try to find by email first, then by userId
    const filter = {
      $or: [
        { email: identifier },
        { userId: identifier }
      ]
    };

    const result = await userProfiles.updateOne(filter, { $set: { role: 'admin' } });
    if (result.matchedCount === 0) {
      console.log(`No user found with email or userId: ${identifier}`);
    } else {
      console.log(`User with email or userId '${identifier}' promoted to admin.`);
    }
  } catch (err) {
    console.error('Error promoting user:', err);
  } finally {
    await client.close();
  }
}

main();
