// @ts-nocheck
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { client: null, promise: null };
}

export async function connectMongo() {
  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10, // Adjust connection pooling
      connectTimeoutMS: 30000, // Increased timeout to 30s
      socketTimeoutMS: 45000,
    })
      .connect()
      .then((client) => {
        console.log('MongoDB connected successfully');
        return client;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }

  cached.client = await cached.promise;
  return cached.client;
}
