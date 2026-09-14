import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    Animated,
} from 'react-native';
import { useTheme, Spacing, Radii, Typography, Layout, Shadows, AnimDuration } from '../utils/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';

interface AppButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
    shape?: 'default' | 'pill';
}

/**
 * APP BUTTON
 * Themed button with variants: primary, secondary, danger, ghost.
 * Supports loading state, disabled state, icons, and press animation.
 */
export default function AppButton({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    icon,
    style,
    textStyle,
    fullWidth = true,
    shape = 'default',
}: AppButtonProps) {
    const { colors } = useTheme();
    const isDisabled = disabled || loading;
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    // Micro-interaction: subtle scale on press
    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    // Get variant-specific styles
    const variantStyles = getVariantStyles(variant, isDisabled, colors);

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                onPress={onPress}
                disabled={isDisabled}
                activeOpacity={0.8}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                accessibilityRole="button"
                accessibilityLabel={title}
                accessibilityState={{ disabled: isDisabled }}
                style={[
                    styles.button,
                    shape === 'pill' ? { borderRadius: Radii.full } : { borderRadius: Radii.md },
                    variantStyles.container,
                    fullWidth && styles.fullWidth,
                    isDisabled && styles.disabled,
                    style,
                ]}
            >
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={variantStyles.loaderColor}
                    />
                ) : (
                    <>
                        {icon}
                        <Text style={[styles.text, variantStyles.text, textStyle]}>
                            {title}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}

/**
 * Returns styles based on button variant and current theme colors
 */
function getVariantStyles(variant: ButtonVariant, disabled: boolean, colors: any) {
    switch (variant) {
        case 'primary':
            return {
                container: {
                    backgroundColor: disabled ? colors.disabled : colors.primary,
                    ...Shadows.sm,
                } as ViewStyle,
                text: {
                    color: colors.textInverse,
                } as TextStyle,
                loaderColor: colors.textInverse,
            };
        case 'secondary':
            return {
                container: {
                    backgroundColor: colors.primaryBg,
                    borderWidth: 1.5,
                    borderColor: colors.primary,
                } as ViewStyle,
                text: {
                    color: colors.primary,
                } as TextStyle,
                loaderColor: colors.primary,
            };
        case 'danger':
            return {
                container: {
                    backgroundColor: colors.errorBg,
                    borderWidth: 1.5,
                    borderColor: colors.error,
                } as ViewStyle,
                text: {
                    color: colors.error,
                } as TextStyle,
                loaderColor: colors.error,
            };
        case 'ghost':
            return {
                container: {
                    backgroundColor: 'transparent',
                } as ViewStyle,
                text: {
                    color: colors.primary,
                } as TextStyle,
                loaderColor: colors.primary,
            };
        case 'outline':
            return {
                container: {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                } as ViewStyle,
                text: {
                    color: colors.textPrimary,
                } as TextStyle,
                loaderColor: colors.textPrimary,
            };
    }
}

const styles = StyleSheet.create({
    button: {
        height: Layout.buttonHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        gap: Spacing.sm,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        ...Typography.button,
    },
});
