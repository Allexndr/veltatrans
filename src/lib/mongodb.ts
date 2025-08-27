import { MongoClient, Db } from 'mongodb';

// В продакшене MongoDB может быть недоступна
const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;

export async function getDb(): Promise<Db | null> {
  if (!clientPromise) {
    console.warn('MongoDB not configured - skipping database operations');
    return null;
  }
  
  try {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB_NAME || 'velta_trans');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return null;
  }
}
