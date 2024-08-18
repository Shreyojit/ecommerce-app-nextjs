import mongoose from 'mongoose';
import { createClient } from 'redis';

// TypeScript interface for environment variables
interface ProcessEnv {
    MONGO_URI?: string;
    REDIS_URL?: string;
}

async function dbConnect() {
    // Ensure MONGO_URI is set
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI environment variable is not set.');
    }

    // Ensure REDIS_URL is set
    if (!process.env.REDIS_URL) {
        throw new Error('REDIS_URL environment variable is not set.');
    }

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully.');

        // Connect to Redis
        const redisClient = createClient({
            url: process.env.REDIS_URL,
        });

        redisClient.on('error', (err) => {
            console.error('Redis connection failed:', err.message);
            throw new Error(`Redis connection failed: ${err.message}`);
        });

        await redisClient.connect();
        console.log('Redis connected successfully.');

        // You can return the Redis client if needed elsewhere
        return { mongoose, redisClient };

    } catch (error) {
        // Handle unknown errors
        if (error instanceof Error) {
            console.error('Database connection failed:', error.message);
            throw new Error(`Database connection failed: ${error.message}`);
        } else {
            console.error('Database connection failed with an unknown error.');
            throw new Error('Database connection failed with an unknown error.');
        }
    }
}

export default dbConnect;
