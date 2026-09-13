import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radii, Typography } from '../theme';

interface FilterChipProps {
    label: string;
    selected: boolean;
    onPress: () => void;
    count?: number;        // Optional count badge
    style?: ViewStyle;
}

/**
 * FILTER CHIP
 * Selectable chip for filter/sort options.
 * Shows active state when selected.
 */
export default function FilterChip({
    label,
    selected,
    onPress,
    count,
    style,
}: FilterChipProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.chip,
                selected && styles.chipSelected,
                style,
            ]}
        >
            <Text style={[
                styles.label,
                selected && styles.labelSelected,
            ]}>
                {label}
            </Text>
            {count !== undefined && (
                <Text style={[
                    styles.count,
                    selected && styles.countSelected,
                ]}>
                    {count}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radii.full,
        backgroundColor: Colors.surfaceAlt,
        borderWidth: 1.5,
        borderColor: 'transparent',
        gap: 6,
    },
    chipSelected: {
        backgroundColor: Colors.primaryBg,
        borderColor: Colors.primary,
    },
    label: {
        ...Typography.captionMedium,
        color: Colors.textSecondary,
    },
    labelSelected: {
        color: Colors.primary,
    },
    count: {
        ...Typography.small,
        color: Colors.textTertiary,
        backgroundColor: Colors.border,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: Radii.full,
        overflow: 'hidden',
    },
    countSelected: {
        color: Colors.primary,
        backgroundColor: Colors.primaryBg,
    },
});
