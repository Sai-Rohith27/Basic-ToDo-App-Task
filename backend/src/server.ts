import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { connectDB } from './config/database';
import taskRoutes from './routes/taskRoutes';

// Load environment variables
dotenv.config();

/**
 * INITIALIZE EXPRESS APP
 */
const app: Express = express();

/**
 * MIDDLEWARE
 */

// Enable CORS (allow requests from frontend)
app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:19006',
            'http://localhost:8081',
            'http://localhost:19000',
        ],
        credentials: true,
    })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

/**
 * INITIALIZE FIREBASE ADMIN
 * Used to verify Firebase tokens
 */
try {
    // Robustly parse the private key
    let parsedPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (parsedPrivateKey) {
        if (parsedPrivateKey.startsWith('"') && parsedPrivateKey.endsWith('"')) {
            parsedPrivateKey = parsedPrivateKey.slice(1, -1);
        }
        parsedPrivateKey = parsedPrivateKey.replace(/\\n/g, '\n');
    }

    // Try to initialize from environment variables
    const firebaseConfig = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: parsedPrivateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
    };

    initializeApp({
        credential: cert(firebaseConfig as any),
    });

    console.log('✓ Firebase Admin initialized');
} catch (error) {
    console.warn('⚠️ Firebase Admin initialization failed:', error);
    console.warn('Token verification will not work');
}

/**
 * ROUTES
 */

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Modulus Todo API is running',
        timestamp: new Date(),
    });
});

// Task routes
app.use('/api/tasks', taskRoutes);

/**
 * ERROR HANDLING
 */

// 404 Not Found
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path,
    });
});

/**
 * START SERVER
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start server only if we're not in a serverless environment (Vercel)
        if (process.env.VERCEL !== '1') {
            app.listen(PORT, () => {
                console.log(`✓ Server running on http://localhost:${PORT}`);
                console.log(`✓ API: http://localhost:${PORT}/api/tasks`);
            });
        }
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;