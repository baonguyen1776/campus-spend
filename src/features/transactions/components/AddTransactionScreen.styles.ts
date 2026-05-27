import Theme from "../../../constants/theme";
import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bgBase,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Theme.spacing.base,
        paddingTop: Platform.OS === "ios" ? 20 : 16,
        paddingBottom: Theme.spacing.sm,
        backgroundColor: Theme.colors.bgSurface,
        // Seamless design: no border line at the bottom of the header, just pure white flow
    },
    closeButton: {
        padding: Theme.spacing.xs,
    },
    scrollContent: {
        paddingHorizontal: Theme.spacing.base,
        paddingBottom: 40,
    },
    // Center big display for amount
    amountContainer: {
        alignItems: "center",
        marginTop: Theme.spacing.base,
        marginBottom: Theme.spacing.lg,
    },
    amountLabel: {
        fontSize: Theme.font.size.xs,
        fontFamily: Theme.font.family.medium,
        color: Theme.colors.textSecondary,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: Theme.spacing.xs,
    },
    amountInputRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    amountInput: {
        fontFamily: Theme.font.family.display,
        fontSize: 40,
        fontWeight: "800",
        color: "#7F26FD", // Elegant Indigo purple
        textAlign: "center",
        paddingVertical: Theme.spacing.xs,
        minWidth: 50,
    },
    amountCurrency: {
        fontFamily: Theme.font.family.display,
        fontSize: 40,
        fontWeight: "800",
        color: "#7F26FD",
        marginLeft: Theme.spacing.xs,
    },
    // Floating Pill Toggle (Side-by-side with gap)
    toggleRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: Theme.spacing.base,
        marginBottom: Theme.spacing.lg,
        paddingHorizontal: Theme.spacing.sm,
    },
    togglePillButton: {
        flex: 1,
        maxWidth: Theme.layout.togglePillMaxWidth,
        paddingVertical: Theme.spacing.sm + 2,
        borderRadius: Theme.radius.full,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
    },
    togglePillActive: {
        backgroundColor: "#7F26FD",
        borderColor: "#7F26FD",
    },
    togglePillInactive: {
        backgroundColor: Theme.colors.bgSurface,
        borderColor: "#7F26FD",
    },
    togglePillActiveText: {
        color: Theme.colors.white,
        fontFamily: Theme.font.family.bold,
        fontSize: Theme.font.size.sm,
    },
    togglePillInactiveText: {
        color: "#7F26FD",
        fontFamily: Theme.font.family.bold,
        fontSize: Theme.font.size.sm,
    },
    // Unified outline card selector stack
    formContainer: {
        gap: 12, // Gap between card elements in stack
        marginBottom: Theme.spacing.lg,
    },
    selectorCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Theme.colors.bgSurface,
        borderWidth: 1.5,
        borderColor: "#E2E8F0", // Minimalist light outline border matching reference
        borderRadius: 16,
        padding: 14,
    },
    selectorCardLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    selectorCardIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: "#F3E8FF", // Light purple backdrop
        alignItems: "center",
        justifyContent: "center",
    },
    selectorCardContent: {
        flex: 1,
    },
    selectorCardLabel: {
        fontSize: Theme.font.size.xs - 1,
        fontFamily: Theme.font.family.medium,
        color: Theme.colors.textSecondary,
    },
    selectorCardValue: {
        fontSize: Theme.font.size.sm,
        fontFamily: Theme.font.family.bold,
        color: Theme.colors.textPrimary,
        marginTop: 2,
    },
    selectorCardTextInput: {
        fontSize: Theme.font.size.sm,
        fontFamily: Theme.font.family.bold,
        color: Theme.colors.textPrimary,
        padding: 0,
        margin: 0,
        flex: 1,
    },
    // Submit Button
    submitButton: {
        backgroundColor: "#7F26FD",
        borderRadius: 24,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#7F26FD",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        marginTop: Theme.spacing.base,
    },
    // Bottom Sheet Drawers (Slide-up)
    bottomSheetOverlay: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.4)", // Dark slate semi-transparent backdrop
        justifyContent: "flex-end", // Align at bottom
    },
    bottomSheetContent: {
        backgroundColor: Theme.colors.bgSurface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        paddingBottom: Platform.OS === "ios" ? 40 : 24,
        maxHeight: "75%",
        width: "100%",
    },
    bottomSheetHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    bottomSheetCloseButton: {
        padding: 4,
    },
    bottomSheetCloseText: {
        fontSize: Theme.font.size.sm,
        fontFamily: Theme.font.family.bold,
        color: "#7F26FD",
    },
    bottomSheetList: {
        maxHeight: 280,
    },
    bottomSheetItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    // Textarea inside modal drawer for Note
    noteTextarea: {
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        padding: 12,
        height: 100,
        fontSize: Theme.font.size.sm,
        fontFamily: Theme.font.family.medium,
        color: Theme.colors.textPrimary,
        textAlignVertical: "top",
        marginTop: 8,
        marginBottom: 16,
    },
    noteSaveButton: {
        backgroundColor: "#7F26FD",
        borderRadius: 16,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default styles;