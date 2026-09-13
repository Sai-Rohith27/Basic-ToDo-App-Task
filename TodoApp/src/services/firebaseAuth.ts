import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * REGISTER NEW USER
 * Takes email & password, creates account in Firebase
 */
export const registerUser = async (email: string, password: string) => {
    try {
        // Create user in Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Return user info
        return {
            success: true,
            user: {
                uid: userCredential.user.uid,
                email: userCredential.user.email || '',
            },
        };
    } catch (error: any) {
        // Handle errors
        let errorMessage = 'Registration failed';

        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Email already registered';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address';
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
};

/**
 * LOGIN USER
 * Takes email & password, logs into Firebase
 */
export const loginUser = async (email: string, password: string) => {
    try {
        // Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Get ID token for backend API calls
        const token = await userCredential.user.getIdToken();

        return {
            success: true,
            user: {
                uid: userCredential.user.uid,
                email: userCredential.user.email || '',
            },
            token: token,
        };
    } catch (error: any) {
        // Handle errors
        let errorMessage = 'Login failed';

        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Email not registered';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address';
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
};

/**
 * LOGOUT USER
 * Signs out current user
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: 'Logout failed',
        };
    }
};

/**
 * GET CURRENT USER
 * Returns currently logged in user (null if not logged in)
 */
export const getCurrentUser = (): Promise<FirebaseUser | null> => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};

/**
 * LISTEN TO AUTH STATE CHANGES
 * Calls callback whenever user logs in/out
 * Returns function to stop listening
 */
export const listenToAuthState = (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

/**
 * GET ID TOKEN
 * Get token to send with API requests
 */
export const getIdToken = async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
};