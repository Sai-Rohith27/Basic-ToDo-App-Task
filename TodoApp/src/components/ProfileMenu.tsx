import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { Text, Avatar, IconButton } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { clearAuth } from '../redux/slices/authSlice';
import { logoutUser } from '../services/firebaseAuth';
import { useTheme, Spacing, Typography, Radii, Shadows } from '../utils/theme';

interface ProfileMenuProps {
    visible: boolean;
    onClose: () => void;
}

export default function ProfileMenu({ visible, onClose }: ProfileMenuProps) {
    const { colors, toggleTheme, isDark } = useTheme();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const slideAnim = useRef(new Animated.Value(-100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
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
                toValue: -100,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, slideAnim, fadeAnim]);

    const handleLogout = async () => {
        onClose();
        await logoutUser();
        dispatch(clearAuth());
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.menuContainer,
                                {
                                    backgroundColor: colors.surface,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            {/* User Info Header */}
                            <View style={[styles.userInfoContainer, { borderBottomColor: colors.borderLight }]}>
                                <Avatar.Icon size={48} icon="account" color={colors.textInverse} style={{ backgroundColor: colors.primary }} />
                                <View style={styles.userDetails}>
                                    <Text style={[styles.userName, { color: colors.textPrimary }]} numberOfLines={1}>
                                        {user?.name || 'User'}
                                    </Text>
                                    <Text style={[styles.userEmail, { color: colors.textSecondary }]} numberOfLines={1}>
                                        {user?.email || 'user@example.com'}
                                    </Text>
                                </View>
                            </View>

                            {/* Menu Options */}
                            <View style={styles.optionsContainer}>
                                <TouchableOpacity style={styles.optionRow} onPress={toggleTheme} activeOpacity={0.7}>
                                    <View style={[styles.iconContainer, { backgroundColor: colors.surfaceAlt }]}>
                                        <IconButton icon={isDark ? 'weather-sunny' : 'weather-night'} size={20} iconColor={colors.textPrimary} style={{ margin: 0 }} />
                                    </View>
                                    <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                                        {isDark ? 'Light Mode' : 'Dark Mode'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.optionRow} onPress={handleLogout} activeOpacity={0.7}>
                                    <View style={[styles.iconContainer, { backgroundColor: colors.errorBg }]}>
                                        <IconButton icon="logout" size={20} iconColor={colors.error} style={{ margin: 0 }} />
                                    </View>
                                    <Text style={[styles.optionText, { color: colors.error }]}>
                                        Log Out
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'flex-end',
        paddingTop: 60, // approximate height of header
        paddingRight: Spacing.lg,
    },
    menuContainer: {
        width: 250,
        borderRadius: Radii.lg,
        overflow: 'hidden',
        ...Shadows.lg,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        borderBottomWidth: 1,
    },
    userDetails: {
        marginLeft: Spacing.md,
        flex: 1,
    },
    userName: {
        ...Typography.bodyMedium,
    },
    userEmail: {
        ...Typography.caption,
    },
    optionsContainer: {
        paddingVertical: Spacing.sm,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    optionText: {
        ...Typography.bodyMedium,
    },
});
