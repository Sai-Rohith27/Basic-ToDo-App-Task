import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Shadows } from '../utils/theme';

interface FloatingActionButtonProps {
    onPress: () => void;
    icon?: string;
}

export default function FloatingActionButton({ onPress, icon = 'plus' }: FloatingActionButtonProps) {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.fab,
                {
                    backgroundColor: colors.primary,
                    bottom: Math.max(insets.bottom, 24) + 24, // 24px above the bottom safe area
                },
            ]}
        >
            <IconButton
                icon={icon}
                size={32}
                iconColor={colors.white} // Using explicit white so it contrasts on any primary color
                style={{ margin: 0 }}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.lg,
        zIndex: 100, // Ensure it sits above lists
    },
});
