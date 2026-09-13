import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAppDispatch } from '../../redux/hooks';
import { setUser, setAuthError } from '../../redux/slices/authSlice';
import { registerUser } from '../../services/firebaseAuth';

/**
 * REGISTER SCREEN
 * User creates new account with email & password
 */
export default function RegisterScreen({ navigation }: any) {
    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useAppDispatch();

    /**
     * VALIDATE PASSWORD
     * Checks if password meets requirements
     */
    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 6) {
            return 'Password must be at least 6 characters';
        }
        if (!/[A-Z]/.test(pwd)) {
            return 'Password must contain uppercase letter';
        }
        if (!/[0-9]/.test(pwd)) {
            return 'Password must contain number';
        }
        return null;
    };

    /**
     * HANDLE REGISTER
     * Called when user presses "Sign Up" button
     */
    const handleRegister = async () => {
        // Validate all fields filled
        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter valid email');
            return;
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setLoading(true);
        setError('');

        // Call Firebase auth function
        const result = await registerUser(email, password);

        if (result.success && result.user) {
            // Registration successful - update Redux
            dispatch(setUser(result.user));
            // Navigation happens automatically (RootNavigator sees isAuthenticated = true)
        } else {
            // Registration failed - show error
            setError(result.error || 'Registration failed');
            dispatch(setAuthError(result.error || 'Registration failed'));
        }

        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join us to manage your tasks</Text>
                </View>

                {/* ERROR MESSAGE */}
                {error ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* EMAIL INPUT */}
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    editable={!loading}
                />

                {/* PASSWORD INPUT */}
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    editable={!loading}
                />

                {/* PASSWORD REQUIREMENTS */}
                <View style={styles.requirements}>
                    <Text style={styles.requirementText}>
                        • At least 6 characters
                    </Text>
                    <Text style={styles.requirementText}>
                        • One uppercase letter (A-Z)
                    </Text>
                    <Text style={styles.requirementText}>
                        • One number (0-9)
                    </Text>
                </View>

                {/* CONFIRM PASSWORD INPUT */}
                <TextInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    editable={!loading}
                />

                {/* SIGN UP BUTTON */}
                <Button
                    mode="contained"
                    onPress={handleRegister}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                >
                    {loading ? 'Creating account...' : 'Sign Up'}
                </Button>

                {/* LOGIN LINK */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Text
                        style={styles.link}
                        onPress={() => navigation.navigate('Login')}
                    >
                        Login
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    input: {
        marginBottom: 12,
        fontSize: 14,
    },
    requirements: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    requirementText: {
        fontSize: 12,
        color: '#555',
        marginBottom: 4,
    },
    button: {
        marginTop: 10,
        marginBottom: 20,
        paddingVertical: 8,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    errorBox: {
        backgroundColor: '#ffebee',
        borderColor: '#ef5350',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        color: '#c62828',
        fontSize: 13,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#666',
        fontSize: 13,
    },
    link: {
        color: '#007AFF',
        fontWeight: 'bold',
        fontSize: 13,
    },
});