import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme';

interface ProgressRingProps {
    /** Progress percentage (0–100) */
    progress: number;
    /** Ring diameter */
    size?: number;
    /** Label shown inside the ring */
    label?: string;
}

/**
 * PROGRESS RING
 * Circular progress indicator for the dashboard stats.
 * Uses a pure-View approach with border clipping to create an arc —
 * no react-native-svg dependency required.
 */
export default function ProgressRing({
    progress,
    size = 64,
    label,
}: ProgressRingProps) {
    const { colors } = useTheme();
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const strokeWidth = 5;
    const innerSize = size - strokeWidth * 2;

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: colors.border,
                },
            ]}
        >
            {/* Colored progress wedges */}
            {clampedProgress > 0 && (
                <View style={[StyleSheet.absoluteFill, { borderRadius: size / 2, overflow: 'hidden' }]}>
                    {/* Left half */}
                    <View style={[styles.halfClip, { width: size / 2, left: 0 }]}>
                        <View
                            style={[
                                styles.halfCircle,
                                {
                                    width: size,
                                    height: size,
                                    borderRadius: size / 2,
                                    borderWidth: strokeWidth,
                                    borderColor: colors.primary,
                                    transform: [
                                        {
                                            rotate: `${clampedProgress <= 50
                                                ? `${(clampedProgress / 50) * 180}deg`
                                                : '180deg'
                                            }`,
                                        },
                                    ],
                                },
                            ]}
                        />
                    </View>
                    {/* Right half — only visible above 50% */}
                    {clampedProgress > 50 && (
                        <View style={[styles.halfClip, { width: size / 2, right: 0, left: size / 2 }]}>
                            <View
                                style={[
                                    styles.halfCircleRight,
                                    {
                                        width: size,
                                        height: size,
                                        borderRadius: size / 2,
                                        borderWidth: strokeWidth,
                                        borderColor: colors.primary,
                                        left: -(size / 2),
                                        transform: [
                                            {
                                                rotate: `${((clampedProgress - 50) / 50) * 180}deg`,
                                            },
                                        ],
                                    },
                                ]}
                            />
                        </View>
                    )}
                </View>
            )}

            {/* Inner circle (mask) */}
            <View
                style={[
                    styles.inner,
                    {
                        width: innerSize,
                        height: innerSize,
                        borderRadius: innerSize / 2,
                        backgroundColor: colors.background,
                    },
                ]}
            >
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                    {label ?? `${clampedProgress}%`}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    halfClip: {
        position: 'absolute',
        top: 0,
        height: '100%',
        overflow: 'hidden',
    },
    halfCircle: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    halfCircleRight: {
        position: 'absolute',
        top: 0,
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
    },
    inner: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
    },
});
