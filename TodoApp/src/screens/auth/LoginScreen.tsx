import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch } from '../../redux/hooks';
import { setUser, setAuthError, setAuthLoading } from '../../redux/slices/authSlice';
import { loginUser } from '../../services/firebaseAuth';
import { Colors, Spacing, Typography, Layout, Radii } from '../../theme';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';

/**
 * LOGIN SCREEN
 * User enters email & password to login.
 * Preserves existing Firebase auth logic — only UI is redesigned.
 */
export default function LoginScreen({ navigation }: any) {
    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Field-level validation
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    // Inline validators
    const getEmailError = (): string | undefined => {
        if (!emailTouched || !email) return undefined;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Enter a valid email address';
        return undefined;
    };

    const getPasswordError = (): string | undefined => {
        if (!passwordTouched || !password) return undefined;
        if (password.length < 6) return 'Password must be at least 6 characters';
        return undefined;
    };

    /**
     * HANDLE LOGIN
     * Called when user presses "Login" button.
     * (Existing logic preserved exactly)
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
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + Spacing.xxxl },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* ── Branding Header ── */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoIcon}>✓</Text>
                    </View>
                    <Text style={styles.appName}>Taskly</Text>
                    <Text style={styles.tagline}>Organize your day, own your goals.</Text>
                </View>

                {/* ── Form Card ── */}
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Welcome Back</Text>
                    <Text style={styles.formSubtitle}>Sign in to continue</Text>

                    {/* Error Banner */}
                    {error ? (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorIcon}>⚠</Text>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Email Input */}
                    <AppInput
                        label="Email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setError('');
                        }}
                        leftIcon="email-outline"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        disabled={loading}
                        error={getEmailError()}
                        onBlur={() => setEmailTouched(true)}
                    />

                    {/* Password Input */}
                    <AppInput
                        label="Password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setError('');
                        }}
                        leftIcon="lock-outline"
                        secureTextEntry
                        showToggle
                        disabled={loading}
                        error={getPasswordError()}
                        onBlur={() => setPasswordTouched(true)}
                    />

                    {/* Login Button */}
                    <AppButton
                        title={loading ? 'Signing in...' : 'Sign In'}
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                        style={styles.loginButton}
                    />
                </View>

                {/* ── Footer ── */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Text
                        style={styles.footerLink}
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
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Layout.screenPaddingH,
        paddingBottom: Spacing.xxxl,
    },

    // ── Header / Branding ──
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xxxl,
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    logoIcon: {
        fontSize: 28,
        color: Colors.textInverse,
        fontWeight: '700',
    },
    appName: {
        ...Typography.h1,
        color: Colors.primary,
        marginBottom: Spacing.xs,
    },
    tagline: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },

    // ── Form Card ──
    formCard: {
        backgroundColor: Colors.surface,
        borderRadius: Radii.xl,
        padding: Spacing.xxl,
        maxWidth: Layout.maxFormWidth,
        width: '100%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    formTitle: {
        ...Typography.h2,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    formSubtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginBottom: Spacing.xxl,
    },

    // ── Error Banner ──
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.errorBg,
        borderRadius: Radii.sm,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    errorIcon: {
        fontSize: 16,
    },
    errorText: {
        ...Typography.caption,
        color: Colors.error,
        flex: 1,
    },

    // ── Button ──
    loginButton: {
        marginTop: Spacing.sm,
    },

    // ── Footer ──
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.xxl,
        paddingBottom: Spacing.lg,
    },
    footerText: {
        ...Typography.body,
        color: Colors.textSecondary,
    },
    footerLink: {
        ...Typography.bodyMedium,
        color: Colors.primary,
    },
});