import React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import Theme from "../../constants/theme";
import AppText from "../../components/AppText";
import Card, { CardVariant } from "../../components/Card";
import { formatVND, formatTime } from "../../utils/format";
import { getCategoryConfig } from "../../constants/categoryConfig";

import { useHomeViewModel } from "./useHomeViewModel";

// ─────────────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
    const {
        selectedMonth,
        setSelectedMonth,
        showMonthDropdown,
        setShowMonthDropdown,
        balance,
        incomeSum,
        expenseSum,
        groupedByDay,
        firstGroupTotal,
        getAccountName,
        MONTHS,
        loading
    } = useHomeViewModel();


    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            bounces
            showsVerticalScrollIndicator={false}
        >
            <LinearGradient
                colors={Theme.gradients.primary as any}
                style={styles.headerGradient}
            >
                {/* Top Navbar: Avatar | Month picker | Bell */}
                <View style={styles.topRow}>
                    {/* TRÁI: Avatar tròn */}
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                        style={styles.avatar}
                    />

                    {/* GIỮA: Nút chọn tháng (Pill) */}
                    <TouchableOpacity
                        style={styles.monthSelector}
                        activeOpacity={0.7}
                        onPress={() => setShowMonthDropdown(!showMonthDropdown)}
                    >
                        <AppText size="sm" color={Theme.colors.white} variant="semiBold">
                            {selectedMonth}
                        </AppText>
                        <Feather name="chevron-down" size={14} color={Theme.colors.white} />
                    </TouchableOpacity>

                    {/* PHẢI: Chuông thông báo với chấm đỏ */}
                    <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
                        <Feather name="bell" size={18} color={Theme.colors.white} />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>

                {/* Dropdown tháng (hiển thị khi bấm Month Selector) */}
                {showMonthDropdown && (
                    <View style={styles.monthDropdown}>
                        {MONTHS.map(m => (
                            <TouchableOpacity
                                key={m}
                                style={[
                                    styles.monthDropdownItem,
                                    m === selectedMonth && styles.monthDropdownItemActive,
                                ]}
                                onPress={() => {
                                    setSelectedMonth(m);
                                    setShowMonthDropdown(false);
                                }}
                            >
                                <AppText
                                    size="xs"
                                    variant="medium"
                                    color={m === selectedMonth ? Theme.colors.primary : '#334155'}
                                >
                                    {m}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Số dư hiện tại — căn giữa to bự */}
                <View style={styles.balanceSection}>
                    <AppText size="xs" color="rgba(240,255,248,0.75)" variant="medium">
                        Số dư hiện tại
                    </AppText>
                    <AppText
                        style={styles.balanceAmount}
                        color={Theme.colors.white}
                    >
                        {formatVND(balance)}
                    </AppText>
                    {/* Badge badge "+X hơn tuần trước" */}
                    <View style={styles.balanceBadge}>
                        <AppText size="xs" variant="semiBold" color="rgba(240,255,248,0.9)">
                            +500.000 ₫ so với tuần trước
                        </AppText>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.body}>

                {/* ── Hàng 2 thẻ: Thu nhập / Chi tiêu ── */}
                <View style={styles.summaryRow}>
                    {/* Thẻ Thu nhập */}
                    <Card style={{ flex: 1, overflow: 'hidden' }}>
                        <View style={styles.summaryCardDecor} />
                        <View style={styles.summaryCardHeader}>
                            <View style={[styles.summaryIconBox, { backgroundColor: '#EEF8FF', borderColor: '#C8E8FF' }]}>
                                <AppText style={styles.summaryEmoji}>💰</AppText>
                            </View>
                            <AppText size="xs" color={Theme.colors.textSecondary} variant="medium">
                                Thu nhập
                            </AppText>
                        </View>
                        <AppText style={styles.summaryAmount} color={Theme.colors.textPrimary}>
                            {formatVND(incomeSum || 4_500_000)}
                        </AppText>
                    </Card>

                    {/* Thẻ Chi tiêu */}
                    <Card style={{ flex: 1, overflow: 'hidden' }}>
                        <View style={[styles.summaryCardDecor, { backgroundColor: 'rgba(255,92,92,0.05)' }]} />
                        <View style={styles.summaryCardHeader}>
                            <View style={[styles.summaryIconBox, { backgroundColor: '#FFF0F0', borderColor: '#FFD6D6' }]}>
                                <AppText style={styles.summaryEmoji}>👛</AppText>
                            </View>
                            <AppText size="xs" color={Theme.colors.textSecondary} variant="medium">
                                Chi tiêu
                            </AppText>
                        </View>
                        <AppText style={styles.summaryAmount} color={Theme.colors.textPrimary}>
                            {formatVND(expenseSum || 1_200_000)}
                        </AppText>
                    </Card>
                </View>

                <Card style={styles.darkBanner} variant={CardVariant.ELEVATED}>
                    <View style={styles.darkBannerIconBox}>
                        <Feather name="zap" size={16} color="#A769FF" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <AppText size="xs" variant="semiBold" color="#E4E4E7">
                            Cảnh báo vượt hạn mức!
                        </AppText>
                    </View>
                    <TouchableOpacity>
                        <AppText size="xs" variant="bold" color="#A769FF">
                            Xem chi tiết ›
                        </AppText>
                    </TouchableOpacity>
                </Card>

                {/* ── Phần Giao dịch ── */}
                <View style={styles.transactionsSection}>
                    {/* Header hàng: "Giao dịch" + Filter + Clock + "Trong kỳ" */}
                    <View style={styles.sectionHeader}>
                        <AppText variant="bold" size="base" color={Theme.colors.textPrimary}>
                            Giao dịch
                        </AppText>
                        <View style={styles.sectionHeaderActions}>
                            <TouchableOpacity style={styles.iconButton}>
                                <Feather name="filter" size={16} color={Theme.colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <Feather name="clock" size={16} color={Theme.colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.periodButton}>
                                <AppText size="xs" variant="bold" color={Theme.colors.primary}>
                                    Trong kỳ
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Nhóm ngày + Tổng */}
                    {groupedByDay.size > 0 && (
                        <>
                            {[...groupedByDay.entries()].map(([dateLabel, txs]) => (
                                <View key={dateLabel}>
                                    <View style={styles.dateGroupHeader}>
                                        <AppText size="xs" variant="bold" color={Theme.colors.textSecondary}>
                                            {dateLabel}
                                        </AppText>
                                        <AppText size="xs" color={Theme.colors.textSecondary}>
                                            {'Tổng '}
                                            <AppText size="xs" variant="bold" color={Theme.colors.textPrimary}>
                                                {formatVND(Math.abs(firstGroupTotal))}
                                            </AppText>
                                        </AppText>
                                    </View>

                                    {/* Danh sách từng giao dịch trong nhóm */}
                                    <View style={styles.txList}>
                                        {txs.map(tx => {
                                            const isExpense = tx.type === 'expense';
                                            const cfg = getCategoryConfig(tx.category_id);
                                            return (
                                                <TouchableOpacity
                                                    key={tx.id}
                                                    style={styles.txItem}
                                                    activeOpacity={0.7}
                                                >
                                                    {/* Icon danh mục */}
                                                    <View style={[
                                                        styles.txIconBox,
                                                        { backgroundColor: cfg.bg, borderColor: cfg.border }
                                                    ]}>
                                                        <Feather name={cfg.icon as any} size={18} color={cfg.color} />
                                                    </View>

                                                    {/* Tên + tài khoản */}
                                                    <View style={styles.txMeta}>
                                                        <AppText variant="semiBold" size="sm" color={Theme.colors.textPrimary}>
                                                            {tx.name}
                                                        </AppText>
                                                        <View style={styles.txSubRow}>
                                                            <View style={[styles.txDot, { backgroundColor: isExpense ? Theme.colors.danger : Theme.colors.primary }]} />
                                                            <AppText size="xs" color={Theme.colors.textSecondary} variant="medium">
                                                                {getAccountName(tx.account_id)}
                                                            </AppText>
                                                            {tx.note ? (
                                                                <AppText size="xs" color={Theme.colors.textSecondary}>
                                                                    {' • '}{tx.note}
                                                                </AppText>
                                                            ) : null}
                                                        </View>
                                                    </View>

                                                    {/* Số tiền + giờ */}
                                                    <View style={styles.txAmountCol}>
                                                        <AppText
                                                            variant="mono"
                                                            size="xs"
                                                            color={isExpense ? Theme.colors.textPrimary : Theme.colors.income}
                                                        >
                                                            {isExpense ? '-' : '+'}{tx.amount.toLocaleString('vi-VN')} ₫
                                                        </AppText>
                                                        <AppText
                                                            variant="mono"
                                                            size="xs"
                                                            color={Theme.colors.textSecondary}
                                                            style={{ marginTop: 4 }}
                                                        >
                                                            {formatTime(tx.transaction_date)}
                                                        </AppText>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            ))}
                        </>
                    )}

                    {/* Empty state — khi chưa có giao dịch nào */}
                    {groupedByDay.size === 0 && (
                        <View style={styles.emptyState}>
                            <Feather name="inbox" size={32} color={Theme.colors.textSecondary} />
                            <AppText
                                size="xs"
                                color={Theme.colors.textSecondary}
                                style={{ marginTop: 8 }}
                            >
                                Chưa có giao dịch nào.
                            </AppText>
                            <TouchableOpacity style={{ marginTop: 8 }}>
                                <AppText size="xs" variant="bold" color={Theme.colors.primary}>
                                    Tạo giao dịch đầu tiên
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

            </View>
        </ScrollView>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bgBase,
    },
    contentContainer: {
        paddingBottom: Theme.layout.bottomTabHeight + 16,
    },

    // ── Header ──────────────────────────────────────────────────────────────
    headerGradient: {
        paddingTop: 52,
        paddingBottom: 72,          // Thêm padding dưới nhiều để body overlap lên
        paddingHorizontal: 20,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 7,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: Theme.radius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    notificationButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    notificationDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5C5C',
        borderWidth: 1.5,
        borderColor: '#007A5E',
    },
    monthDropdown: {
        position: 'absolute',
        top: 100,
        left: '50%',
        transform: [{ translateX: -65 }],
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 6,
        minWidth: 160,
        ...Theme.shadow.md,
        zIndex: 999,
    },
    monthDropdownItem: {
        paddingHorizontal: 16,
        paddingVertical: 10,
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
        marginTop: 4,
        letterSpacing: -0.5,
    },
    balanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 14,
        paddingVertical: 5,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: Theme.radius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },

    // ── Body (nổi đè lên header) ─────────────────────────────────────────────
    body: {
        flex: 1,
        backgroundColor: Theme.colors.bgBase,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -40,             // Overlap effect — giống reference "-mt-10"
        paddingHorizontal: 20,
        paddingTop: 24,
        ...Theme.shadow.lg,
    },

    // ── Thẻ Thu nhập / Chi tiêu ──────────────────────────────────────────────
    summaryRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
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
        gap: 8,
        marginBottom: 12,
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
        fontSize: 17,
        letterSpacing: -0.3,
    },

    // ── Dark Banner (Warning / AI Insight) ──────────────────────────────────
    darkBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#121214',
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#2A2A2E',
        ...Theme.shadow.md,
    },
    darkBannerIconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(167,105,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(167,105,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ── Transactions Section ─────────────────────────────────────────────────
    transactionsSection: {},
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    sectionHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconButton: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: Theme.colors.bgSurface,
    },
    periodButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Theme.colors.primaryDim,
        borderRadius: Theme.radius.full,
    },

    // ── Date Group Header ────────────────────────────────────────────────────
    dateGroupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 2,
    },

    // ── Transaction List & Items ─────────────────────────────────────────────
    txList: {
        gap: 10,
        marginBottom: 16,
    },
    txItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: Theme.colors.bgSurface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        gap: 12,
    },
    txIconBox: {
        width: 44,
        height: 44,
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
        marginTop: 5,
        gap: 4,
    },
    txDot: {
        width: 6,
        height: 6,
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
        borderRadius: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: Theme.colors.border,
        marginTop: 8,
    },
});
