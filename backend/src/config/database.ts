import mongoose from 'mongoose';

/**
 * CONNECT TO MONGODB
 * This function connects your app to MongoDB database
 */
export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error('MONGODB_URI not set in .env file');
        }

        await mongoose.connect(uri);

        console.log('✓ MongoDB connected successfully');
        console.log(`  Database: ${mongoose.connection.name}`);

        return true;
    } catch (error) {
        console.error('✗ MongoDB connection failed:');
        console.error(error);
        process.exit(1);
    }
};

/**
 * DISCONNECT FROM MONGODB
 * Call this when shutting down server
 */
export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('✓ MongoDB disconnected');
    } catch (error) {
        console.error('✗ MongoDB disconnection failed:', error);
    }
};