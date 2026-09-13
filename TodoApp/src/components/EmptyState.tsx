import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../theme';
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
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <IconButton
                    icon={icon}
                    size={48}
                    iconColor={Colors.textTertiary}
                />
            </View>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? (
                <Text style={styles.subtitle}>{subtitle}</Text>
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
        backgroundColor: Colors.surfaceAlt,
        borderRadius: 100,
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h3,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    buttonWrapper: {
        marginTop: Spacing.md,
    },
});
