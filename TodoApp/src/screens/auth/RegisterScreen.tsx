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
import { setUser, setAuthError } from '../../redux/slices/authSlice';
import { registerUser } from '../../services/firebaseAuth';
import { Colors, Spacing, Typography, Layout, Radii } from '../../theme';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import PasswordStrength from '../../components/PasswordStrength';

/**
 * REGISTER SCREEN
 * User creates new account with email & password.
 * Preserves existing Firebase auth logic and validation — only UI is redesigned.
 */
export default function RegisterScreen({ navigation }: any) {
    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Field-level touch tracking
    const [emailTouched, setEmailTouched] = useState(false);
    const [confirmTouched, setConfirmTouched] = useState(false);

    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    // ── Inline Validators ──

    const getEmailError = (): string | undefined => {
        if (!emailTouched || !email) return undefined;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Enter a valid email address';
        return undefined;
    };

    const getConfirmError = (): string | undefined => {
        if (!confirmTouched || !confirmPassword) return undefined;
        if (password !== confirmPassword) return 'Passwords do not match';
        return undefined;
    };

    /**
     * VALIDATE PASSWORD
     * Checks if password meets requirements.
     * (Existing logic preserved exactly)
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
     * Called when user presses "Sign Up" button.
     * (Existing logic preserved exactly)
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
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + Spacing.xxl },
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
                    <Text style={styles.tagline}>Start getting things done.</Text>
                </View>

                {/* ── Form Card ── */}
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Create Account</Text>
                    <Text style={styles.formSubtitle}>Sign up to get started</Text>

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
                    />

                    {/* Live Password Strength Indicator */}
                    <PasswordStrength password={password} />

                    {/* Confirm Password Input */}
                    <AppInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            setError('');
                        }}
                        leftIcon="lock-check-outline"
                        secureTextEntry
                        showToggle
                        disabled={loading}
                        error={getConfirmError()}
                        onBlur={() => setConfirmTouched(true)}
                    />

                    {/* Sign Up Button */}
                    <AppButton
                        title={loading ? 'Creating account...' : 'Create Account'}
                        onPress={handleRegister}
                        loading={loading}
                        disabled={loading}
                        style={styles.signUpButton}
                    />
                </View>

                {/* ── Footer ── */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Text
                        style={styles.footerLink}
                        onPress={() => navigation.navigate('Login')}
                    >
                        Sign In
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
        marginBottom: Spacing.xxl,
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
    signUpButton: {
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