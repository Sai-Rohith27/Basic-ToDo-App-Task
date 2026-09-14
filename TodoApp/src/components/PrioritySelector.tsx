import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Spacing, Radii, Typography } from '../utils/theme';

interface PrioritySelectorProps {
    value: 'low' | 'medium' | 'high';
    onChange: (value: 'low' | 'medium' | 'high') => void;
    disabled?: boolean;
}

/**
 * PRIORITY SELECTOR
 * Horizontal pill-style selector replacing SegmentedButtons.
 * Each priority level has its own accent color for clear visual distinction.
 */
export default function PrioritySelector({
    value,
    onChange,
    disabled = false,
}: PrioritySelectorProps) {
    const { colors } = useTheme();

    const options: {
        key: 'low' | 'medium' | 'high';
        label: string;
        color: string;
        bg: string;
    }[] = [
            { key: 'low', label: 'Low', color: colors.priorityLow, bg: colors.successBg },
            { key: 'medium', label: 'Medium', color: colors.priorityMedium, bg: colors.warningBg },
            { key: 'high', label: 'High', color: colors.priorityHigh, bg: colors.errorBg },
        ];

    return (
        <View style={styles.container}>
            {options.map((option) => {
                const isSelected = value === option.key;
                return (
                    <TouchableOpacity
                        key={option.key}
                        onPress={() => !disabled && onChange(option.key)}
                        activeOpacity={disabled ? 1 : 0.7}
                        accessibilityRole="button"
                        accessibilityLabel={`${option.label} priority`}
                        accessibilityState={{ selected: isSelected, disabled }}
                        style={[
                            styles.pill,
                            {
                                backgroundColor: isSelected ? option.bg : colors.surfaceAlt,
                                borderColor: isSelected ? option.color : 'transparent',
                            },
                            disabled && styles.disabled,
                        ]}
                    >
                        {/* Small colored dot */}
                        <View
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: isSelected
                                        ? option.color
                                        : colors.textTertiary,
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.label,
                                {
                                    color: isSelected
                                        ? option.color
                                        : colors.textSecondary,
                                },
                            ]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    pill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        borderRadius: Radii.md,
        borderWidth: 1.5,
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    label: {
        ...Typography.captionMedium,
    },
    disabled: {
        opacity: 0.5,
    },
});
