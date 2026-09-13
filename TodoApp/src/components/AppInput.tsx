import React from 'react';
import { StyleSheet, View, TouchableOpacity, ViewStyle } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { Colors, Spacing, Radii, Typography, Layout } from '../theme';

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
                left={leftIcon ? <TextInput.Icon icon={leftIcon} color={Colors.textTertiary} /> : undefined}
                right={
                    showToggle ? (
                        <TextInput.Icon
                            icon={isSecure ? 'eye-off-outline' : 'eye-outline'}
                            color={Colors.textTertiary}
                            onPress={() => setIsSecure(!isSecure)}
                        />
                    ) : undefined
                }
                outlineColor={error ? Colors.error : Colors.border}
                activeOutlineColor={error ? Colors.error : Colors.primary}
                outlineStyle={styles.outline}
                style={[
                    styles.input,
                    multiline && { height: numberOfLines * 22 + 32, textAlignVertical: 'top' },
                ]}
                theme={{
                    roundness: Radii.md,
                    colors: {
                        background: Colors.surface,
                        text: Colors.textPrimary,
                        placeholder: Colors.textTertiary,
                    },
                }}
            />
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: Spacing.lg,
    },
    input: {
        backgroundColor: Colors.surface,
        fontSize: Typography.body.fontSize,
    },
    outline: {
        borderWidth: 1.5,
    },
    errorText: {
        ...Typography.caption,
        color: Colors.error,
        marginTop: Spacing.xs,
        marginLeft: Spacing.xs,
    },
});
