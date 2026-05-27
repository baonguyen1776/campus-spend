export const Colors = {
    // --- Brand ---
    primary: '#00D09E',       // Mint green — main accent
    primaryLight: '#33DBAF',  // Lighter mint
    primaryDim: '#00D09E1A',  // Translucent mint

    secondary: '#F5A623',     // Amber
    secondaryDim: '#F5A6231A',

    danger: '#FF5C5C',        // Red
    dangerDim: '#FF5C5C1A',

    info: '#5B9BF8',          // Blue
    infoDim: '#5B9BF81A',

    // --- Backgrounds ---
    bgBase: '#F8FAFC',        // Slate 50 — Clean premium light background
    bgSurface: '#FFFFFF',     // Pure white card background
    bgElevated: '#FFFFFF',    // Elevated card surface
    bgInput: '#F1F5F9',       // Slate 100 — Input fields background
    bgOverlay: 'rgba(15, 23, 42, 0.4)', // Darker scrim overlay

    // --- Text ---
    textPrimary: '#0F172A',   // Slate 900 — Near-black headings/amounts for high contrast
    textSecondary: '#64748B', // Slate 500 — Muted gray labels/subtext
    textDisabled: '#94A3B8',  // Slate 400 — Disabled state / placeholder
    textInverse: '#FFFFFF',   // White text on primary (mint)

    // --- Borders & Dividers ---
    border: '#E2E8F0',        // Slate 200 — Clean elegant border
    borderFocus: '#00D09E',   // Focused input border

    // --- Semantic aliases (for components) ---
    income: '#00C896',
    expense: '#FF5C5C',
    transfer: '#5B9BF8',
    saving: '#F5A623',

    // --- Utility ---
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;

export const FontFamily = {
    regular: 'Inter-Regular',       // Inter
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    mono: 'JetBrainsMono-Regular',  // JetBrains Mono for numbers alignment
    display: 'SpaceGrotesk-Bold',   // Space Grotesk for big balance display
} as const;


export const FontSize = {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
    display: 38,
} as const;

export const LineHeight = {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
} as const;

export const FontWeight = {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
} as const;

export const Spacing = {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    section: 64,
} as const;

export const Radius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    full: 9999,   // Pills, avatar
} as const;

export const Shadow = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    md: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
    lg: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
        elevation: 12,
    },
    glow: {
        // Mint glow for primary buttons / active elements
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
} as const;

export const IconSize = {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 26,
    xl: 32,
    xxl: 40,
} as const;

export const Layout = {
    screenPadding: Spacing.base,    // Default horizontal padding for screens
    cardPadding: Spacing.lg,        // Padding inside cards
    bottomTabHeight: 72,            // Bottom navigation height
    headerHeight: 56,               // Top header height
    inputHeight: 52,                // Text input height
    buttonHeight: 52,               // Primary button height
    buttonHeightSm: 40,             // Small button height
    avatarSm: 32,
    avatarMd: 44,
    avatarLg: 64,
    fabSize: 56,                    // Floating Action Button standard size
    togglePillMaxWidth: 140,        // Max width for floating pill toggle buttons
} as const;

export const Duration = {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 400,
    verySlow: 600,
} as const;

export const CategoryColors: Record<string, string> = {
    // Expense categories
    food: '#FF8C5A',
    transport: '#5B9BF8',
    shopping: '#C87DFF',
    health: '#FF5C5C',
    entertainment: '#F5A623',
    education: '#00D09E',
    utilities: '#8C95A8',
    other_expense: '#444D60',

    // Income categories
    salary: '#00D09E',
    freelance: '#33DBAF',
    gift: '#F5A623',
    investment: '#5B9BF8',
    other_income: '#8C95A8',
};

export const Gradients = {
    primary: ['#00D09E', '#007A5E'],       // Mint → dark green
    expense: ['#FF5C5C', '#C0392B'],       // Red gradient
    income: ['#00D09E', '#5B9BF8'],        // Mint → blue
    card: ['#161B25', '#1E2636'],          // Surface gradient for cards
    overlay: ['rgba(13,17,23,0)', 'rgba(13,17,23,0.95)'], // Fade overlay
} as const;

export const Theme = {
    colors: Colors,
    font: {
        family: FontFamily,
        size: FontSize,
        weight: FontWeight,
        lineHeight: LineHeight,
    },
    spacing: Spacing,
    radius: Radius,
    shadow: Shadow,
    icon: IconSize,
    layout: Layout,
    duration: Duration,
    categoryColors: CategoryColors,
    gradients: Gradients,
} as const;

export default Theme;