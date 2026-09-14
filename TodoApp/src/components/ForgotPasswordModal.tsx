import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { resetPassword } from '../services/firebaseAuth';
import AppInput from './AppInput';
import AppButton from './AppButton';
import { useTheme, Spacing, Typography, Radii, Shadows } from '../utils/theme';

interface ForgotPasswordModalProps {
    visible: boolean;
    onClose: () => void;
    initialEmail?: string;
}

export default function ForgotPasswordModal({ visible, onClose, initialEmail = '' }: ForgotPasswordModalProps) {
    const { colors } = useTheme();
    const [email, setEmail] = useState(initialEmail);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const slideAnim = useRef(new Animated.Value(100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setEmail(initialEmail);
            setError('');
            setSuccess(false);

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 60,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
            Animated.timing(slideAnim, {
                toValue: 100,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, initialEmail]);

    const handleReset = async () => {
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const res = await resetPassword(email);

            if (res.success) {
                setSuccess(true);
            } else {
                setError(res.error || 'Failed to send reset email');
            }
        } catch (err: any) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.4)', opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            backgroundColor: colors.surface,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            Reset Password
                        </Text>
                        <IconButton
                            icon="close"
                            size={20}
                            iconColor={colors.textSecondary}
                            onPress={onClose}
                            style={styles.closeButton}
                        />
                    </View>

                    {success ? (
                        <View style={styles.content}>
                            <View style={[styles.successIconContainer, { backgroundColor: colors.primaryBg }]}>
                                <IconButton icon="email-check-outline" size={40} iconColor={colors.primary} />
                            </View>
                            <Text style={[styles.successText, { color: colors.textPrimary }]}>
                                Check your email
                            </Text>
                            <Text style={[styles.successSubtext, { color: colors.textSecondary }]}>
                                We've sent a password reset link to {email}
                            </Text>
                            <AppButton
                                title="Back to Login"
                                onPress={onClose}
                                style={styles.actionButton}
                                shape="pill"
                            />
                        </View>
                    ) : (
                        <View style={styles.content}>
                            <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                                Enter your registered email address and we'll send you a link to reset your password.
                            </Text>

                            <AppInput
                                label="Email Address"
                                value={email}
                                onChangeText={(t) => { setEmail(t); setError(''); }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                leftIcon="email-outline"
                                variant="pill"
                                error={error}
                            />

                            <AppButton
                                title="Send Reset Link"
                                onPress={handleReset}
                                loading={loading}
                                style={styles.actionButton}
                                shape="pill"
                            />
                        </View>
                    )}
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
    },
    modalContainer: {
        borderRadius: Radii.xl,
        overflow: 'hidden',
        ...Shadows.xl,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.sm,
    },
    title: {
        ...Typography.h3,
    },
    closeButton: {
        margin: 0,
        marginRight: -Spacing.sm,
    },
    content: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xl,
    },
    instructionText: {
        ...Typography.body,
        marginBottom: Spacing.lg,
    },
    actionButton: {
        marginTop: Spacing.lg,
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: Spacing.md,
    },
    successText: {
        ...Typography.h3,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    successSubtext: {
        ...Typography.body,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
});
