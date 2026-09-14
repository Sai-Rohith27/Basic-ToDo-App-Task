import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Animated, Image, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginUser } from '../../services/firebaseAuth';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import { useTheme, Spacing, Typography, Layout, Radii } from '../../theme';

const HERO_IMAGE_URL = { uri: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1000&auto=format&fit=crop' };

export default function LoginScreen({ navigation }: any) {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const isLargeScreen = width > 768;

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [forgotPasswordVisible, setForgotPasswordVisible] = React.useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const result = await loginUser(email, password);
            if (!result.success) {
                setError(result.error || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={[styles.container, { backgroundColor: colors.background }]} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={[styles.layoutWrapper, isLargeScreen && styles.layoutRow]}>

                {/* Hero Image Section */}
                <View style={[styles.imageContainer, isLargeScreen ? styles.imageContainerLarge : styles.imageContainerSmall]}>
                    <Image source={HERO_IMAGE_URL} style={StyleSheet.absoluteFill} resizeMode="cover" />
                    <View style={StyleSheet.absoluteFill} />{/* Overlay placeholder if needed */}
                </View>

                {/* Form Section */}
                <ScrollView
                    contentContainerStyle={[
                        styles.formScrollContainer, 
                        !isLargeScreen && { paddingTop: Spacing.huge, paddingBottom: Math.max(insets.bottom, Spacing.xl) },
                        isLargeScreen && { paddingVertical: Spacing.huge }
                    ]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={[styles.formContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

                        <View style={styles.header}>
                            <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome back</Text>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Enter your details to access your tasks.
                            </Text>
                        </View>

                        <View style={styles.formGroup}>
                            <AppInput
                                label="Email Address"
                                value={email}
                                onChangeText={(t) => { setEmail(t); setError(''); }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                leftIcon="email-outline"
                                variant="pill"
                            />

                            <View>
                                <AppInput
                                    label="Password"
                                    value={password}
                                    onChangeText={(t) => { setPassword(t); setError(''); }}
                                    secureTextEntry
                                    showToggle
                                    leftIcon="lock-outline"
                                    variant="pill"
                                />
                                <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => setForgotPasswordVisible(true)}>
                                    <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>

                            {error ? (
                                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                            ) : null}

                            <AppButton
                                title="Sign In"
                                onPress={handleLogin}
                                loading={loading}
                                style={styles.mainButton}
                                shape="pill"
                            />
                        </View>



                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                                Don't have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7} style={{ paddingVertical: 4 }}>
                                <Text style={[styles.link, { color: colors.primary }]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                    </Animated.View>
                </ScrollView>
            </View>

            {/* FORGOT PASSWORD MODAL */}
            <ForgotPasswordModal 
                visible={forgotPasswordVisible}
                onClose={() => setForgotPasswordVisible(false)}
                initialEmail={email}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    layoutWrapper: {
        flex: 1,
        flexDirection: 'column',
    },
    layoutRow: {
        flexDirection: 'row',
    },
    imageContainer: {
        width: '100%',
        overflow: 'hidden',
    },
    imageContainerSmall: {
        height: '35%',
        borderBottomLeftRadius: Radii.xl,
        borderBottomRightRadius: Radii.xl,
    },
    imageContainerLarge: {
        flex: 1,
        height: '100%',
        borderTopRightRadius: 32,
        borderBottomRightRadius: 32,
    },
    formScrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    formContent: {
        width: '100%',
        maxWidth: 440,
        alignSelf: 'center',
        paddingHorizontal: Layout.screenPaddingH,
    },
    header: {
        marginBottom: Spacing.xxxl,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.body,
    },
    formGroup: {
        gap: Spacing.sm,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        paddingVertical: Spacing.xs,
        marginTop: -Spacing.xs,
    },
    forgotPasswordText: {
        ...Typography.captionMedium,
    },
    mainButton: {
        marginTop: Spacing.md,
    },
    errorText: {
        ...Typography.caption,
        textAlign: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.xxl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        ...Typography.captionMedium,
        marginHorizontal: Spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.xxxl,
    },
    footerText: {
        ...Typography.body,
    },
    link: {
        ...Typography.body,
        fontWeight: '700',
    },
});
