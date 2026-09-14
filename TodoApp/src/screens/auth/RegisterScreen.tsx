import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Animated, Image, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerUser } from '../../services/firebaseAuth';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import PasswordStrength from '../../components/PasswordStrength';
import { useTheme, Spacing, Typography, Layout, Radii } from '../../theme';

const HERO_IMAGE_URL = { uri: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1000&auto=format&fit=crop' };

export default function RegisterScreen({ navigation }: any) {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const isLargeScreen = width > 768;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const result = await registerUser(email, password, name);
            if (!result.success) {
                setError(result.error || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed');
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
                    <View style={StyleSheet.absoluteFill} /> {/* Overlay placeholder if needed */}
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
                            <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Join us to start organizing your life.
                            </Text>
                        </View>

                        <View style={styles.formGroup}>
                            <AppInput
                                label="Full Name"
                                value={name}
                                onChangeText={(t) => { setName(t); setError(''); }}
                                autoCapitalize="words"
                                leftIcon="account-outline"
                                variant="pill"
                            />

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
                                <View style={styles.strengthContainer}>
                                    <PasswordStrength password={password} />
                                </View>
                            </View>

                            <AppInput
                                label="Confirm Password"
                                value={confirmPassword}
                                onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
                                secureTextEntry
                                showToggle
                                leftIcon="lock-check-outline"
                                variant="pill"
                            />

                            {error ? (
                                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                            ) : null}

                            <AppButton
                                title="Sign Up"
                                onPress={handleRegister}
                                loading={loading}
                                style={styles.mainButton}
                                shape="pill"
                            />
                        </View>



                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{ paddingVertical: 4 }}>
                                <Text style={[styles.link, { color: colors.primary }]}>Sign In</Text>
                            </TouchableOpacity>
                        </View>

                    </Animated.View>
                </ScrollView>
            </View>
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
        height: '30%',
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
    strengthContainer: {
        marginTop: Spacing.xs,
        paddingHorizontal: Spacing.xs,
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