import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radii, Typography } from '../theme';

interface PriorityBadgeProps {
    priority: 'low' | 'medium' | 'high';
    size?: 'small' | 'default';
}

/**
 * PRIORITY BADGE
 * Small colored pill showing task priority level.
 */
export default function PriorityBadge({ priority, size = 'default' }: PriorityBadgeProps) {
    const config = PRIORITY_CONFIG[priority];
    const isSmall = size === 'small';

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

const PRIORITY_CONFIG = {
    high: { label: 'High', color: Colors.priorityHigh, bg: Colors.errorBg },
    medium: { label: 'Medium', color: Colors.priorityMedium, bg: Colors.warningBg },
    low: { label: 'Low', color: Colors.priorityLow, bg: Colors.successBg },
};

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
