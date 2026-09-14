import React from 'react';
import { StyleSheet, View, ViewStyle, TextInput as RNTextInput } from 'react-native';
import { TextInput, Text, IconButton } from 'react-native-paper';
import { useTheme, Spacing, Radii, Typography, Layout } from '../utils/theme';

interface AppInputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    leftIcon?: string;           // MaterialCommunityIcons name
    secureTextEntry?: boolean;   // For password fields
    showToggle?: boolean;        // Show password visibility toggle
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    error?: string;              // Error message to display below
    disabled?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    style?: ViewStyle;
    onBlur?: () => void;
    variant?: 'default' | 'pill'; // Added variant support
}

/**
 * APP INPUT
 * Themed text input with icon support, password toggle, and inline error.
 */
export default function AppInput({
    label,
    value,
    onChangeText,
    placeholder,
    leftIcon,
    secureTextEntry = false,
    showToggle = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    error,
    disabled = false,
    multiline = false,
    numberOfLines = 1,
    style,
    onBlur,
    variant = 'default',
}: AppInputProps) {
    const { colors, isDark } = useTheme();
    const [isSecure, setIsSecure] = React.useState(secureTextEntry);
    const [isFocused, setIsFocused] = React.useState(false);

    if (variant === 'pill') {
        const inputBg = isDark ? '#1C1C1E' : '#F1F5F9';
        const borderColor = error ? colors.error : (isFocused ? colors.primary : 'transparent');

        return (
            <View style={[styles.wrapper, style]}>
                <View
                    style={[
                        styles.pillContainer,
                        {
                            backgroundColor: inputBg,
                            borderColor,
                            borderWidth: 1,
                        }
                    ]}
                >
                    {leftIcon && (
                        <View style={styles.pillIconLeft}>
                            <IconButton icon={leftIcon} size={20} iconColor={colors.textTertiary} style={{ margin: 0 }} />
                        </View>
                    )}
                    <RNTextInput
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder || label}
                        placeholderTextColor={colors.textTertiary}
                        secureTextEntry={isSecure}
                        keyboardType={keyboardType}
                        autoCapitalize={autoCapitalize}
                        editable={!disabled}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            setIsFocused(false);
                            onBlur?.();
                        }}
                        style={[
                            styles.pillInput,
                            { color: colors.textPrimary },
                            leftIcon ? { paddingLeft: 0 } : { paddingLeft: Spacing.xl },
                            showToggle ? { paddingRight: 0 } : { paddingRight: Spacing.xl },
                        ]}
                    />
                    {showToggle && (
                        <View style={styles.pillIconRight}>
                            <IconButton
                                icon={isSecure ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                iconColor={colors.textTertiary}
                                onPress={() => setIsSecure(!isSecure)}
                                style={{ margin: 0 }}
                            />
                        </View>
                    )}
                </View>
                {error ? (
                    <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                ) : null}
            </View>
        );
    }

    return (
        <View style={[styles.wrapper, style]}>
            <TextInput
                label={label}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                mode="outlined"
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                secureTextEntry={isSecure}
                editable={!disabled}
                multiline={multiline}
                numberOfLines={numberOfLines}
                onBlur={onBlur}
                left={leftIcon ? <TextInput.Icon icon={leftIcon} color={colors.textTertiary} /> : undefined}
                right={
                    showToggle ? (
                        <TextInput.Icon
                            icon={isSecure ? 'eye-off-outline' : 'eye-outline'}
                            color={colors.textTertiary}
                            onPress={() => setIsSecure(!isSecure)}
                        />
                    ) : undefined
                }
                outlineColor={error ? colors.error : 'transparent'}
                activeOutlineColor={error ? colors.error : colors.primary}
                outlineStyle={styles.outline}
                textColor={colors.textPrimary}
                style={[
                    styles.input,
                    { backgroundColor: colors.surfaceAlt },
                    multiline && { height: numberOfLines * 22 + 32, textAlignVertical: 'top' as const },
                ]}
                theme={{
                    roundness: Radii.md,
                    colors: {
                        background: colors.surfaceAlt,
                        text: colors.textPrimary,
                        placeholder: colors.textTertiary,
                        onSurfaceVariant: colors.textSecondary,
                    },
                }}
            />
            {error ? (
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: Spacing.lg,
    },
    input: {
        fontSize: Typography.body.fontSize,
    },
    outline: {
        borderWidth: 1,
    },
    errorText: {
        ...Typography.caption,
        marginTop: Spacing.xs,
        marginLeft: Spacing.xs,
    },
    // Pill Variant Styles
    pillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: Radii.full,
        overflow: 'hidden',
    },
    pillInput: {
        flex: 1,
        height: '100%',
        ...Typography.body,
    },
    pillIconLeft: {
        width: 52,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pillIconRight: {
        width: 52,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
