import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// ⚠️ IMPORTANT: You'll get these from Firebase console later
// For now, use placeholder values
const firebaseConfig = {
    apiKey: "AIzaSyBcd6o7DYwadjtS35wmeruVYvXzn2LcYoQ",
    authDomain: "to-do-app-623db.firebaseapp.com",
    projectId: "to-do-app-623db",
    storageBucket: "to-do-app-623db.firebasestorage.app",
    messagingSenderId: "943733123921",
    appId: "1:943733123921:web:e5c29b0a28ac51c3b34170",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
    .catch((error) => console.log('Persistence error:', error));
export default app;