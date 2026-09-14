import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Text, Switch, List, Avatar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { clearAuth } from '../redux/slices/authSlice';
import { logoutUser } from '../services/firebaseAuth';
import { useTheme, Spacing, Typography, Radii, Layout } from '../utils/theme';
import AppButton from '../components/AppButton';
import pkg from '../../package.json';

/**
 * PROFILE SCREEN
 * User settings, theme toggle, and logout.
 */
export default function ProfileScreen() {
    const { colors, isDark, toggleTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

    const handleLogout = () => {
        if (Platform.OS === 'web') {
            confirmLogout();
        } else {
            Alert.alert(
                'Log Out',
                'Are you sure you want to log out?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Log Out', style: 'destructive', onPress: confirmLogout },
                ]
            );
        }
    };

    const confirmLogout = async () => {
        await logoutUser();
        dispatch(clearAuth());
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.xxl }]}
        >
            {/* Header / Avatar */}
            <View style={styles.header}>
                <Avatar.Text
                    size={80}
                    label={displayName.charAt(0).toUpperCase()}
                    style={{ backgroundColor: colors.primary }}
                    color={colors.textInverse}
                />
                <Text style={[styles.name, { color: colors.textPrimary }]}>
                    {displayName}
                </Text>
                <Text style={[styles.email, { color: colors.textSecondary }]}>
                    {user?.email}
                </Text>
            </View>

            {/* Settings List */}
            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <List.Section>
                    <List.Subheader style={[styles.subheader, { color: colors.textTertiary }]}>Preferences</List.Subheader>
                    <List.Item
                        title="Dark Mode"
                        titleStyle={{ color: colors.textPrimary }}
                        left={props => <List.Icon {...props} icon="moon-waning-crescent" color={colors.primary} />}
                        right={() => <Switch value={isDark} onValueChange={toggleTheme} color={colors.primary} />}
                    />
                </List.Section>

                <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

                <List.Section>
                    <List.Subheader style={[styles.subheader, { color: colors.textTertiary }]}>Account</List.Subheader>
                    <List.Item
                        title="Log Out"
                        titleStyle={{ color: colors.error }}
                        left={props => <List.Icon {...props} icon="logout" color={colors.error} />}
                        onPress={handleLogout}
                        rippleColor={colors.errorBg}
                    />
                </List.Section>
            </View>

            <View style={styles.footer}>
                <Text style={[styles.version, { color: colors.textTertiary }]}>
                    Taskly v{pkg.version || '1.0.0'}
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: Layout.screenPaddingH,
        paddingBottom: Spacing.huge,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xxxl,
    },
    name: {
        ...Typography.h2,
        marginTop: Spacing.md,
        marginBottom: 4,
    },
    email: {
        ...Typography.body,
    },
    section: {
        borderRadius: Radii.lg,
        overflow: 'hidden',
        marginHorizontal: Spacing.sm, // slight inset for native feel
    },
    subheader: {
        ...Typography.small,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginLeft: -Spacing.sm,
    },
    divider: {
        height: 1,
        marginLeft: 56,
    },
    footer: {
        marginTop: Spacing.xxl,
        alignItems: 'center',
        opacity: 0.5,
    },
    version: {
        ...Typography.captionMedium,
    },
});
