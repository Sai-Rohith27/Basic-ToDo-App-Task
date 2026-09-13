import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Spacing, Radii, Typography } from '../theme';

interface PriorityBadgeProps {
    priority: 'low' | 'medium' | 'high';
    size?: 'small' | 'default';
}

/**
 * PRIORITY BADGE
 * Small colored pill showing task priority level.
 * Uses theme context for dark mode support.
 */
export default function PriorityBadge({ priority, size = 'default' }: PriorityBadgeProps) {
    const { colors } = useTheme();
    const isSmall = size === 'small';

    const config = {
        high: { label: 'High', color: colors.priorityHigh, bg: colors.errorBg },
        medium: { label: 'Med', color: colors.priorityMedium, bg: colors.warningBg },
        low: { label: 'Low', color: colors.priorityLow, bg: colors.successBg },
    }[priority];

    return (
        <View style={[
            styles.badge,
            { backgroundColor: config.bg },
            isSmall && styles.badgeSmall,
        ]}>
            <View style={[styles.dot, { backgroundColor: config.color }]} />
            <Text style={[
                styles.text,
                { color: config.color },
                isSmall && styles.textSmall,
            ]}>
                {config.label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radii.full,
        gap: Spacing.xs,
    },
    badgeSmall: {
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    text: {
        ...Typography.small,
    },
    textSmall: {
        fontSize: 10,
    },
});
