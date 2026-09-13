import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme';

interface SkeletonLoaderProps {
    /** Number of skeleton task rows to show */
    count?: number;
}

/**
 * SKELETON LOADER
 * Animated shimmer placeholder shown while tasks are loading.
 * Uses a pulsing opacity animation for a modern feel.
 */
export default function SkeletonLoader({ count = 4 }: SkeletonLoaderProps) {
    const { colors } = useTheme();
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [opacity]);

    return (
        <View style={styles.container}>
            {Array.from({ length: count }).map((_, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.row,
                        {
                            opacity,
                            backgroundColor: colors.surfaceAlt,
                            borderColor: colors.borderLight,
                        },
                    ]}
                >
                    {/* Checkbox placeholder */}
                    <View style={[styles.checkboxPlaceholder, { backgroundColor: colors.border }]} />

                    <View style={styles.content}>
                        {/* Title line */}
                        <View
                            style={[
                                styles.lineLong,
                                { backgroundColor: colors.border },
                            ]}
                        />
                        {/* Description line */}
                        <View
                            style={[
                                styles.lineShort,
                                { backgroundColor: colors.border },
                            ]}
                        />
                        {/* Meta line */}
                        <View style={styles.metaRow}>
                            <View style={[styles.metaPill, { backgroundColor: colors.border }]} />
                            <View style={[styles.metaPill, { backgroundColor: colors.border, width: 48 }]} />
                        </View>
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
    },
    checkboxPlaceholder: {
        width: 22,
        height: 22,
        borderRadius: 6,
        marginRight: 12,
        marginTop: 2,
    },
    content: {
        flex: 1,
    },
    lineLong: {
        height: 14,
        borderRadius: 4,
        width: '70%',
        marginBottom: 8,
    },
    lineShort: {
        height: 12,
        borderRadius: 4,
        width: '45%',
        marginBottom: 10,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 8,
    },
    metaPill: {
        height: 10,
        borderRadius: 5,
        width: 64,
    },
});
