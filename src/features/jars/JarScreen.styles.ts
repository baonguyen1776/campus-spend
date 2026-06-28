import { StyleSheet } from 'react-native';
import Theme from '../../constants/theme';

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bgBase,
    },

    // ── Header ──────────────────────────────────────────────────────────────
    headerGradient: {
        paddingTop: Theme.layout.headerHeight,
        paddingBottom: 96,
        paddingHorizontal: Theme.layout.screenPadding,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Theme.spacing.xl,
    },
    avatar: {
        width: Theme.layout.avatarMd,
        height: Theme.layout.avatarMd,
        borderRadius: Theme.radius.full,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Theme.spacing.xs + Theme.spacing.xxs, // 6px
        paddingHorizontal: Theme.spacing.base - Theme.spacing.xxs, // 14px
        paddingVertical: Theme.spacing.sm - 1, // 7px
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: Theme.radius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    notificationButton: {
        width: Theme.layout.buttonHeightSm,
        height: Theme.layout.buttonHeightSm,
        borderRadius: Theme.radius.full,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    notificationDot: {
        position: 'absolute',
        top: Theme.spacing.sm,
        right: Theme.spacing.sm,
        width: Theme.spacing.sm,
        height: Theme.spacing.sm,
        borderRadius: Theme.radius.xs, // 4px
        backgroundColor: Theme.colors.danger,
        borderWidth: 1.5,
        borderColor: '#007A5E',
    },
    monthDropdown: {
        position: 'absolute',
        top: 100,
        left: '50%',
        transform: [{ translateX: -65 }],
        backgroundColor: Theme.colors.white,
        borderRadius: Theme.radius.md,
        paddingVertical: Theme.spacing.xs + 2, // 6px
        minWidth: 160,
        ...Theme.shadow.md,
        zIndex: 999,
    },
    monthDropdownItem: {
        paddingHorizontal: Theme.spacing.base,
        paddingVertical: Theme.spacing.sm + 2, // 10px
    },
    monthDropdownItemActive: {
        backgroundColor: '#F0FFF8',
    },
    summaryContainer: {
        alignItems: 'center',
    },
    summaryLabel: {
        color: Theme.colors.white,
        opacity: 0.8,
        letterSpacing: 1,
    },
    summaryAmount: {
        fontSize: Theme.font.size.display,
        color: Theme.colors.white,
        marginTop: Theme.spacing.xs,
    },
    badge: {
        marginTop: Theme.spacing.sm,
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.xs,
        backgroundColor: Theme.colors.bgOverlay,
        borderRadius: Theme.radius.full,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    badgeText: {
        color: Theme.colors.white,
    },

    // ── Body (Nổi đè lên header) ─────────────────────────────────────────────
    contentWrapper: {
        flex: 1,
        backgroundColor: Theme.colors.white,
        borderTopLeftRadius: Theme.radius.xxl,
        borderTopRightRadius: Theme.radius.xxl,
        marginTop: -64, // Overlap
        paddingTop: Theme.spacing.xl,
        shadowColor: Theme.colors.textPrimary,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: Theme.radius.md,
        elevation: 10,
    },

    // ── Month Selector ───────────────────────────────────────────────────────
    monthSelectorWrapper: {
        marginBottom: Theme.spacing.lg,
    },
    monthSelectorContainer: {
        // No margin needed here, using wrapper
    },
    monthButton: {
        paddingHorizontal: Theme.spacing.base,
        paddingVertical: Theme.spacing.sm,
        borderRadius: Theme.radius.xl,
        marginRight: Theme.spacing.sm,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    monthButtonActive: {
        backgroundColor: Theme.colors.primary,
        borderColor: Theme.colors.primary,
        opacity: 1,
    },
    monthButtonInactive: {
        backgroundColor: Theme.colors.bgSurface,
        opacity: 0.6,
    },

    // ── Jar Cards ────────────────────────────────────────────────────────────
    scrollContent: {
        flex: 1,
    },
    jarCard: {
        backgroundColor: Theme.colors.white,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.radius.xl,
        padding: Theme.spacing.base,
        marginBottom: Theme.spacing.base,
        shadowColor: Theme.colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: Theme.radius.sm,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.sm,
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Theme.spacing.md,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: Theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },

    // ── Progress Bar ─────────────────────────────────────────────────────────
    progressTrack: {
        width: '100%',
        height: 18,
        backgroundColor: Theme.colors.bgInput,
        borderRadius: Theme.radius.full,
        overflow: 'hidden',
        justifyContent: 'center',
        marginBottom: Theme.spacing.sm,
    },
    progressFill: {
        height: '100%',
        borderRadius: Theme.radius.full,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    progressLabel: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontSize: Theme.font.size.xs - 2, // 9px
        fontWeight: 'bold',
        color: Theme.colors.textPrimary,
        zIndex: 10,
    },

    // ── Card Footer ──────────────────────────────────────────────────────────
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Theme.spacing.xs,
    },
    topUpButton: {
        paddingHorizontal: Theme.spacing.sm,
        paddingVertical: Theme.spacing.xs,
        backgroundColor: Theme.colors.bgInput,
        borderRadius: Theme.radius.full,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },

    // Jar Form Modal
    jarFormOverlay: {
        flex: 1,
        backgroundColor: Theme.colors.bgOverlay,
        justifyContent: 'flex-end',
        paddingBottom: 80, // Nâng sheet lên khỏi đáy màn hình
    },

    jarFormSheet: {
        backgroundColor: Theme.colors.white,
        borderTopLeftRadius: Theme.radius.xxl,
        borderTopRightRadius: Theme.radius.xxl,
        padding: Theme.spacing.xl,
        paddingBottom: Theme.spacing.xxl,
        gap: Theme.spacing.base,
    },

    jarFormTitle: {
        marginBottom: Theme.spacing.xs,
    },

    jarFormLabel: {
        marginBottom: Theme.spacing.xs,
    },

    jarFormInput: {
        backgroundColor: Theme.colors.bgInput,
        borderRadius: Theme.radius.md,
        paddingHorizontal: Theme.spacing.base - 2,
        paddingVertical: Theme.spacing.md,
        fontSize: Theme.font.size.sm,
        color: Theme.colors.textPrimary,
    },

    jarFormRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    jarFormSubmitButton: {
        backgroundColor: Theme.colors.primary,
        borderRadius: Theme.radius.md,
        paddingVertical: Theme.spacing.base - 2,
        alignItems: 'center',
        marginTop: Theme.spacing.xs,
    },
});

export default styles;
