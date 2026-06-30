import mongoose from 'mongoose';
import { env } from './env';
import { IDatabaseConnection } from '../interfaces';

class DatabaseConnection implements IDatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    mongoose.set('strictQuery', true);

    await mongoose.connect(env.mongodbUri, {
      autoIndex: env.isDevelopment,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    mongoose.connection.on('error', (error: Error) => {
      console.error('[MongoDB] Connection error:', error.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected');
    });

    console.info('[MongoDB] Connected successfully');
  }

  public async disconnect(): Promise<void> {
    if (mongoose.connection.readyState === 0) {
      return;
    }

    await mongoose.disconnect();
    console.info('[MongoDB] Disconnected gracefully');
  }

  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}

export const database = DatabaseConnection.getInstance();
