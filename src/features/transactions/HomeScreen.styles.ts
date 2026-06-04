import Theme from "../../constants/theme";
import { StyleSheet } from "react-native";

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bgBase,
    },
    contentContainer: {
        paddingBottom: Theme.layout.bottomTabHeight + Theme.spacing.base,
    },

    // ── Header ──────────────────────────────────────────────────────────────
    headerGradient: {
        paddingTop: Theme.layout.headerHeight,
        paddingBottom: Theme.layout.bottomTabHeight,          // Thêm padding dưới nhiều để body overlap lên
        paddingHorizontal: Theme.spacing.lg,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Theme.spacing.xl,
    },
    avatar: {
        width: Theme.layout.avatarMd, // Sử dụng kích thước MD chuẩn của avatar (44px)
        height: Theme.layout.avatarMd,
        borderRadius: Theme.radius.full, // Bo tròn hoàn hảo linh hoạt
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
        width: Theme.layout.buttonHeightSm, // Sử dụng kích thước nút bấm nhỏ chuẩn (40px)
        height: Theme.layout.buttonHeightSm,
        borderRadius: Theme.radius.full, // Bo tròn hoàn hảo linh hoạt
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

    // ── Balance ─────────────────────────────────────────────────────────────
    balanceSection: {
        alignItems: 'center',
    },
    balanceAmount: {
        fontFamily: Theme.font.family.display,
        fontSize: 34,
        color: Theme.colors.white,
        marginTop: Theme.spacing.xs,
        letterSpacing: -0.5,
    },
    balanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Theme.spacing.sm + 2, // 10px
        paddingHorizontal: Theme.spacing.base - Theme.spacing.xxs, // 14px
        paddingVertical: Theme.spacing.xs + 1, // 5px
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: Theme.radius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },

    // ── Body (nổi đè lên header) ─────────────────────────────────────────────
    body: {
        flex: 1,
        backgroundColor: Theme.colors.bgBase,
        borderTopLeftRadius: Theme.spacing.xxl, // 32px bo góc lớn cho phần body nổi
        borderTopRightRadius: Theme.spacing.xxl,
        marginTop: -40,             // Overlap effect — giống reference "-mt-10"
        paddingHorizontal: Theme.spacing.lg,
        paddingTop: Theme.spacing.xl,
        ...Theme.shadow.lg,
    },

    // ── Thẻ Thu nhập / Chi tiêu ──────────────────────────────────────────────
    summaryRow: {
        flexDirection: 'row',
        gap: Theme.spacing.base,
        marginBottom: Theme.spacing.lg,
    },
    summaryCardDecor: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,208,158,0.05)',
    },
    summaryCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Theme.spacing.sm,
        marginBottom: Theme.spacing.md,
    },
    summaryIconBox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    summaryEmoji: {
        fontSize: 13,
    },
    summaryAmount: {
        fontFamily: Theme.font.family.bold,
        fontSize: Theme.font.size.md, // 17px
        letterSpacing: -0.3,
    },

    // ── Dark Banner (Warning / AI Insight) ──────────────────────────────────
    darkBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: Theme.spacing.md,
        backgroundColor: "rgba(245, 166, 35, 0.06)", // Soft warning translucent amber
        borderRadius: Theme.radius.xl, // 20px
        paddingVertical: Theme.spacing.base - 2, // 14px
        paddingHorizontal: Theme.spacing.base,
        marginBottom: Theme.spacing.xl,
        borderWidth: 1,
        borderColor: "rgba(245, 166, 35, 0.18)", // Soft translucent amber border
    },
    darkBannerIconBox: {
        width: 32,
        height: 32,
        borderRadius: Theme.radius.lg, // 16px
        backgroundColor: "rgba(245, 166, 35, 0.12)", // Translucent amber for icon background
        borderWidth: 1,
        borderColor: "rgba(245, 166, 35, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },

    // ── Transactions Section ─────────────────────────────────────────────────
    transactionsSection: {},
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Theme.spacing.base,
    },
    sectionHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Theme.spacing.sm,
    },
    iconButton: {
        padding: Theme.spacing.sm,
        borderRadius: 10,
        backgroundColor: Theme.colors.bgSurface,
    },
    periodButton: {
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.sm - 2, // 6px
        backgroundColor: Theme.colors.primaryDim,
        borderRadius: Theme.radius.full,
    },

    // ── Date Group Header ────────────────────────────────────────────────────
    dateGroupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.sm + 2, // 10px
        paddingHorizontal: Theme.spacing.xxs,
    },

    // ── Transaction List & Items ─────────────────────────────────────────────
    txList: {
        gap: Theme.spacing.sm + 2, // 10px
        marginBottom: Theme.spacing.base,
    },
    txItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Theme.spacing.base - 2, // 14px
        backgroundColor: Theme.colors.bgSurface,
        borderRadius: Theme.radius.xl, // 20px bo góc mềm mại cao cấp
        borderWidth: 1,
        borderColor: Theme.colors.border,
        gap: Theme.spacing.md,
    },
    txIconBox: {
        width: Theme.layout.avatarMd, // 44px
        height: Theme.layout.avatarMd,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    txMeta: {
        flex: 1,
    },
    txSubRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Theme.spacing.xs + 1, // 5px
        gap: Theme.spacing.xs,
    },
    txDot: {
        width: Theme.spacing.sm - 2, // 6px
        height: Theme.spacing.sm - 2,
        borderRadius: 3,
    },
    txAmountCol: {
        alignItems: 'flex-end',
    },

    // ── Empty State ──────────────────────────────────────────────────────────
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        borderRadius: Theme.radius.xl, // 20px
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: Theme.colors.border,
        marginTop: Theme.spacing.sm,
    },

    // ── Dedicated Categories Horizontal Section Widget ────────────────────────
    categoriesSection: {
        marginBottom: Theme.spacing.xl,
    },
    categoriesHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: Theme.spacing.xxs,
        marginBottom: Theme.spacing.md,
    },
    categoriesScroll: {
        paddingRight: Theme.spacing.base,
    },
    categoryChip: {
        width: 92,
        paddingVertical: Theme.spacing.sm + 2,
        paddingHorizontal: Theme.spacing.xs,
        backgroundColor: Theme.colors.bgSurface,
        borderWidth: 1.5,
        borderColor: "#E2E8F0",
        borderRadius: 16,
        alignItems: "center",
        marginRight: 10,
    },
    categoryChipSelected: {
        borderColor: "#7F26FD",
        backgroundColor: "#F9F5FF",
    },
    categoryIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },
    categoryName: {
        fontSize: 11,
        fontFamily: Theme.font.family.bold,
        marginTop: Theme.spacing.sm,
        textAlign: "center",
        width: "100%",
    },
    categorySpent: {
        fontSize: 9,
        marginTop: 2,
        textAlign: "center",
    },
});

export default styles;
