import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../utils/theme';

interface PasswordStrengthProps {
    password: string;
}

/**
 * PASSWORD STRENGTH
 * Live checklist of password requirements.
 * Shows ✓/✗ with color coding as the user types.
 * Replaces the static bullet list on RegisterScreen.
 */
export default function PasswordStrength({ password }: PasswordStrengthProps) {
    // Check each requirement
    const requirements = [
        {
            label: 'At least 6 characters',
            met: password.length >= 6,
        },
        {
            label: 'One uppercase letter (A-Z)',
            met: /[A-Z]/.test(password),
        },
        {
            label: 'One number (0-9)',
            met: /[0-9]/.test(password),
        },
    ];

    // Don't show anything if password is empty
    if (!password) return null;

    const metCount = requirements.filter(r => r.met).length;
    const allMet = metCount === requirements.length;

    return (
        <View style={styles.container}>
            {/* Strength bar */}
            <View style={styles.barTrack}>
                <View
                    style={[
                        styles.barFill,
                        {
                            width: `${(metCount / requirements.length) * 100}%`,
                            backgroundColor: allMet
                                ? Colors.success
                                : metCount >= 2
                                    ? Colors.warning
                                    : Colors.error,
                        },
                    ]}
                />
            </View>

            {/* Requirement checklist */}
            {requirements.map((req, index) => (
                <View key={index} style={styles.row}>
                    <Text style={[
                        styles.icon,
                        { color: req.met ? Colors.success : Colors.textTertiary },
                    ]}>
                        {req.met ? '✓' : '○'}
                    </Text>
                    <Text style={[
                        styles.label,
                        { color: req.met ? Colors.success : Colors.textTertiary },
                    ]}>
                        {req.label}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
        paddingHorizontal: Spacing.xs,
    },
    barTrack: {
        height: 3,
        backgroundColor: Colors.border,
        borderRadius: 2,
        marginBottom: Spacing.md,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: 4,
    },
    icon: {
        fontSize: 13,
        fontWeight: '600',
        width: 16,
        textAlign: 'center',
    },
    label: {
        ...Typography.caption,
    },
});
