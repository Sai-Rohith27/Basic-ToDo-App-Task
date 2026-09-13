import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, Spacing, Radii, Typography } from '../theme';

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
 * Shows active state when selected. Theme-aware for dark mode.
 */
export default function FilterChip({
    label,
    selected,
    onPress,
    count,
    style,
}: FilterChipProps) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`Filter: ${label}${count !== undefined ? `, ${count} items` : ''}`}
            style={[
                styles.chip,
                {
                    backgroundColor: selected ? colors.primaryBg : colors.surfaceAlt,
                    borderColor: selected ? colors.primary : 'transparent',
                },
                style,
            ]}
        >
            <Text style={[
                styles.label,
                { color: selected ? colors.primary : colors.textSecondary },
            ]}>
                {label}
            </Text>
            {count !== undefined && (
                <Text style={[
                    styles.count,
                    {
                        color: selected ? colors.primary : colors.textTertiary,
                        backgroundColor: selected ? colors.primaryBg : colors.border,
                    },
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
        borderWidth: 1.5,
        gap: 6,
    },
    label: {
        ...Typography.captionMedium,
    },
    count: {
        ...Typography.small,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: Radii.full,
        overflow: 'hidden',
    },
});
