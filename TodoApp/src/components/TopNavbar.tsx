import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar, IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Spacing, Typography, Layout } from '../theme';
import ProfileMenu from './ProfileMenu';

interface TopNavbarProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
}

import { useAppSelector } from '../redux/hooks';

export default function TopNavbar({ title = 'Taskly', showBack = false, onBack }: TopNavbarProps) {
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const [menuVisible, setMenuVisible] = useState(false);
    const { user } = useAppSelector((state) => state.auth);

    return (
        <>
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.surface,
                        paddingTop: insets.top,
                        borderBottomColor: colors.borderLight,
                        borderBottomWidth: 1,
                    },
                ]}
            >
                <View style={styles.content}>
                    {/* Left: Greeting / Title / Back Button */}
                    <View style={styles.leftSection}>
                        {showBack ? (
                            <>
                                <IconButton
                                    icon="chevron-left"
                                    size={28}
                                    iconColor={colors.textPrimary}
                                    onPress={onBack}
                                    style={styles.backButton}
                                />
                                <Text style={[styles.title, { color: colors.textPrimary }]}>
                                    {title}
                                </Text>
                            </>
                        ) : (
                            <View style={styles.greetingContainer}>
                                <Text style={[styles.greetingText, { color: colors.textSecondary }]}>
                                    Welcome back,
                                </Text>
                                <Text style={[styles.userNameText, { color: colors.textPrimary }]} numberOfLines={1}>
                                    {user?.displayName || user?.email || 'User'}
                                </Text>
                                {user?.displayName ? (
                                    <Text style={[styles.userEmailText, { color: colors.textSecondary }]} numberOfLines={1}>
                                        {user?.email}
                                    </Text>
                                ) : null}
                            </View>
                        )}
                    </View>

                    {/* Right: Profile Avatar */}
                    {!showBack && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setMenuVisible(true)}
                            style={styles.avatarContainer}
                        >
                            <Avatar.Icon
                                size={36}
                                icon="account"
                                color={colors.textInverse}
                                style={{ backgroundColor: colors.primary }}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Profile Dropdown / Bottom Sheet Modal */}
            <ProfileMenu
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        zIndex: 10,
    },
    content: {
        minHeight: Layout.headerHeight,
        paddingVertical: Spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Layout.screenPaddingH,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginLeft: -12,
        marginRight: 0,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    avatarContainer: {
        borderRadius: 18,
        overflow: 'hidden',
    },
    greetingContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    greetingText: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 2,
    },
    userNameText: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    userEmailText: {
        fontSize: 12,
        fontWeight: '400',
        marginTop: 2,
    },
});
