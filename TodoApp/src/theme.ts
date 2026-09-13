/**
 * DESIGN SYSTEM — THEME
 * Central design tokens for the entire app.
 * Every screen/component imports from here for consistency.
 */

// ─── Color Palette ───────────────────────────────────────────────
// Deep indigo primary with warm neutrals — professional yet distinctive.
export const Colors = {
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
};

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
    maxFormWidth: 400,          // Max width for auth forms (prevents stretching on web/tablets)
    inputHeight: 52,           // Standard input height for comfortable touch
    buttonHeight: 50,          // Standard button height
    cardPadding: 16,
    headerHeight: 56,
};
