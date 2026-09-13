import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { useTheme, Spacing, Radii, Typography, Layout } from '../theme';

interface AppInputProps {
    label: string;
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
}

/**
 * APP INPUT
 * Themed text input with icon support, password toggle, and inline error.
 * Wraps React Native Paper TextInput for consistent styling.
 * Uses theme context for dark mode support.
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
}: AppInputProps) {
    const { colors } = useTheme();
    const [isSecure, setIsSecure] = React.useState(secureTextEntry);

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
                outlineColor={error ? colors.error : colors.border}
                activeOutlineColor={error ? colors.error : colors.primary}
                outlineStyle={styles.outline}
                textColor={colors.textPrimary}
                style={[
                    styles.input,
                    { backgroundColor: colors.surface },
                    multiline && { height: numberOfLines * 22 + 32, textAlignVertical: 'top' as const },
                ]}
                theme={{
                    roundness: Radii.md,
                    colors: {
                        background: colors.surface,
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
        borderWidth: 1.5,
    },
    errorText: {
        ...Typography.caption,
        marginTop: Spacing.xs,
        marginLeft: Spacing.xs,
    },
});
