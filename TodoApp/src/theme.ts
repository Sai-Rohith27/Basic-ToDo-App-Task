/**
 * DESIGN SYSTEM — THEME
 * Central design tokens for the entire app.
 * Every screen/component imports from here for consistency.
 *
 * Supports LIGHT and DARK themes via React Context.
 */

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

// ─── Color Palettes ──────────────────────────────────────────────
// Deep indigo primary with warm neutrals — professional yet distinctive.

const LightColors = {
    // Primary brand
    primary: '#4F46E5',        // Indigo-600
    primaryLight: '#818CF8',   // Indigo-400
    primaryDark: '#3730A3',    // Indigo-800
    primaryBg: '#EEF2FF',      // Indigo-50

    // Semantic
    success: '#10B981',        // Emerald-500
    successBg: '#ECFDF5',
    warning: '#F59E0B',        // Amber-500
    warningBg: '#FFFBEB',
    error: '#EF4444',          // Red-500
    errorBg: '#FEF2F2',
    info: '#3B82F6',           // Blue-500

    // Priority colors
    priorityHigh: '#EF4444',
    priorityMedium: '#F59E0B',
    priorityLow: '#10B981',

    // Neutrals
    white: '#FFFFFF',
    background: '#F8FAFC',     // Slate-50
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',     // Slate-100
    border: '#E2E8F0',         // Slate-200
    borderLight: '#F1F5F9',
    textPrimary: '#0F172A',    // Slate-900
    textSecondary: '#475569',  // Slate-600
    textTertiary: '#94A3B8',   // Slate-400
    textInverse: '#FFFFFF',
    disabled: '#CBD5E1',       // Slate-300
    overlay: 'rgba(15, 23, 42, 0.4)',

    // Tab bar
    tabBarBg: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    tabInactive: '#94A3B8',
};

const DarkColors = {
    // Primary brand — slightly lighter for dark backgrounds
    primary: '#818CF8',        // Indigo-400
    primaryLight: '#A5B4FC',   // Indigo-300
    primaryDark: '#4F46E5',    // Indigo-600
    primaryBg: 'rgba(79, 70, 229, 0.15)',

    // Semantic
    success: '#34D399',        // Emerald-400
    successBg: 'rgba(16, 185, 129, 0.12)',
    warning: '#FBBF24',        // Amber-400
    warningBg: 'rgba(245, 158, 11, 0.12)',
    error: '#F87171',          // Red-400
    errorBg: 'rgba(239, 68, 68, 0.12)',
    info: '#60A5FA',           // Blue-400

    // Priority colors
    priorityHigh: '#F87171',
    priorityMedium: '#FBBF24',
    priorityLow: '#34D399',

    // Neutrals — intentionally designed dark palette
    white: '#FFFFFF',
    background: '#0F172A',     // Slate-900
    surface: '#1E293B',        // Slate-800
    surfaceAlt: '#334155',     // Slate-700
    border: '#334155',         // Slate-700
    borderLight: '#1E293B',    // Slate-800
    textPrimary: '#F1F5F9',    // Slate-100
    textSecondary: '#94A3B8',  // Slate-400
    textTertiary: '#64748B',   // Slate-500
    textInverse: '#0F172A',    // Slate-900
    disabled: '#475569',       // Slate-600
    overlay: 'rgba(0, 0, 0, 0.6)',

    // Tab bar
    tabBarBg: '#1E293B',
    tabBarBorder: '#334155',
    tabInactive: '#64748B',
};

export type ThemeColors = typeof LightColors;

// ─── Spacing Scale ───────────────────────────────────────────────
// 4px base unit
export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
};

// ─── Typography ──────────────────────────────────────────────────
export const Typography = {
    // Sizes
    h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
    h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
    h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
    bodyMedium: { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
    caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
    captionMedium: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
    small: { fontSize: 11, fontWeight: '500' as const, lineHeight: 16 },
    button: { fontSize: 15, fontWeight: '600' as const, lineHeight: 20 },
};

// ─── Border Radii ────────────────────────────────────────────────
export const Radii = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
};

// ─── Elevation / Shadows ─────────────────────────────────────────
// React Native shadows (iOS) + elevation (Android)
export const Shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
    },
};

// ─── Layout Constants ────────────────────────────────────────────
export const Layout = {
    screenPaddingH: 20,        // Horizontal padding for screen content
    maxFormWidth: 400,          // Max width for auth forms
    inputHeight: 52,           // Standard input height for comfortable touch
    buttonHeight: 50,          // Standard button height
    cardPadding: 16,
    headerHeight: 56,
};

// ─── Animation Durations ─────────────────────────────────────────
export const AnimDuration = {
    fast: 150,
    normal: 250,
    slow: 400,
};

// ─── Theme Context ───────────────────────────────────────────────

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    colors: ThemeColors;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    colors: LightColors,
    toggleTheme: () => {},
    isDark: false,
});

/**
 * THEME PROVIDER
 * Wraps the app and provides color tokens based on current mode.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>('light');

    const value = useMemo(
        () => ({
            mode,
            colors: mode === 'light' ? LightColors : DarkColors,
            toggleTheme: () => setMode(prev => (prev === 'light' ? 'dark' : 'light')),
            isDark: mode === 'dark',
        }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * USE THEME HOOK
 * Access current colors and theme toggle from any component.
 */
export function useTheme() {
    return useContext(ThemeContext);
}

// ─── Default export for backwards compat ─────────────────────────
// Auth screens & existing components import { Colors, ... } from '../../theme'
// This provides Light palette as default for non-context-aware code.
export const Colors = LightColors;
