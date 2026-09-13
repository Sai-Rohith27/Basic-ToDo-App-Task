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
import { setUser, setAuthError, setAuthLoading } from '../../redux/slices/authSlice';
import { loginUser } from '../../services/firebaseAuth';

/**
 * LOGIN SCREEN
 * User enters email & password to login
 */
export default function LoginScreen({ navigation }: any) {
    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useAppDispatch();

    /**
     * HANDLE LOGIN
     * Called when user presses "Login" button
     */
    const handleLogin = async () => {
        // Validate inputs
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        // Call Firebase auth function
        const result = await loginUser(email, password);

        if (result.success && result.user) {
            // Login successful - update Redux
            dispatch(setUser(result.user));
            // Navigation happens automatically (RootNavigator sees isAuthenticated = true)
        } else {
            // Login failed - show error
            setError(result.error || 'Login failed');
            dispatch(setAuthError(result.error || 'Login failed'));
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
                    <Text style={styles.title}>Welcome Back!</Text>
                    <Text style={styles.subtitle}>Login to your account</Text>
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

                {/* LOGIN BUTTON */}
                <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>

                {/* REGISTER LINK */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Text
                        style={styles.link}
                        onPress={() => navigation.navigate('Register')}
                    >
                        Sign Up
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
        marginBottom: 16,
        fontSize: 14,
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