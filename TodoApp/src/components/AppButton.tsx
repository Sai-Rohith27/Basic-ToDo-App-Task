import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { Colors, Spacing, Radii, Typography, Layout, Shadows } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

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
}

/**
 * APP BUTTON
 * Themed button with variants: primary, secondary, danger, ghost.
 * Supports loading state, disabled state, and icons.
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
}: AppButtonProps) {
    const isDisabled = disabled || loading;

    // Get variant-specific styles
    const variantStyles = getVariantStyles(variant, isDisabled);

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                styles.button,
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
    );
}

/**
 * Returns styles based on button variant
 */
function getVariantStyles(variant: ButtonVariant, disabled: boolean) {
    switch (variant) {
        case 'primary':
            return {
                container: {
                    backgroundColor: disabled ? Colors.disabled : Colors.primary,
                    ...Shadows.sm,
                } as ViewStyle,
                text: {
                    color: Colors.textInverse,
                } as TextStyle,
                loaderColor: Colors.textInverse,
            };
        case 'secondary':
            return {
                container: {
                    backgroundColor: Colors.primaryBg,
                    borderWidth: 1.5,
                    borderColor: Colors.primary,
                } as ViewStyle,
                text: {
                    color: Colors.primary,
                } as TextStyle,
                loaderColor: Colors.primary,
            };
        case 'danger':
            return {
                container: {
                    backgroundColor: Colors.errorBg,
                    borderWidth: 1.5,
                    borderColor: Colors.error,
                } as ViewStyle,
                text: {
                    color: Colors.error,
                } as TextStyle,
                loaderColor: Colors.error,
            };
        case 'ghost':
            return {
                container: {
                    backgroundColor: 'transparent',
                } as ViewStyle,
                text: {
                    color: Colors.primary,
                } as TextStyle,
                loaderColor: Colors.primary,
            };
    }
}

const styles = StyleSheet.create({
    button: {
        height: Layout.buttonHeight,
        borderRadius: Radii.md,
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
