import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme, Spacing, Typography } from '../utils/theme';
import AppButton from './AppButton';

interface EmptyStateProps {
    icon: string;           // MaterialCommunityIcons name
    title: string;
    subtitle?: string;
    actionLabel?: string;   // CTA button text
    onAction?: () => void;  // CTA button handler
}

/**
 * EMPTY STATE
 * Shown when a list has no items.
 * Includes icon, messaging, and optional CTA button.
 */
export default function EmptyState({
    icon,
    title,
    subtitle,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: colors.surfaceAlt }]}>
                <IconButton
                    icon={icon}
                    size={48}
                    iconColor={colors.textTertiary}
                />
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
            {subtitle ? (
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
            ) : null}
            {actionLabel && onAction ? (
                <View style={styles.buttonWrapper}>
                    <AppButton
                        title={actionLabel}
                        onPress={onAction}
                        variant="secondary"
                        fullWidth={false}
                    />
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xxxl,
        paddingVertical: Spacing.huge,
    },
    iconContainer: {
        borderRadius: 100,
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h3,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        ...Typography.body,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    buttonWrapper: {
        marginTop: Spacing.md,
    },
});
