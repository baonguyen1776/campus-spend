import React from "react";
import {
    View,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import Theme from "../../constants/theme";
import AppText from "../../components/AppText";
import Card from "../../components/Card";
import { formatVND, formatTime } from "../../utils/format";
import { getCategoryConfig } from "../../constants/categoryConfig";

import { useHomeViewModel } from "./useHomeViewModel";
import styles from "./HomeScreen.styles";

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
                            {formatVND(incomeSum)}
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
                            {formatVND(expenseSum)}
                        </AppText>
                    </Card>
                </View>

                <Card style={styles.darkBanner}>
                    <View style={styles.darkBannerIconBox}>
                        <Feather name="alert-triangle" size={16} color={Theme.colors.secondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <AppText size="xs" variant="semiBold" color={Theme.colors.textPrimary}>
                            Cảnh báo vượt hạn mức!
                        </AppText>
                    </View>
                    <TouchableOpacity>
                        <AppText size="xs" variant="bold" color={Theme.colors.secondary}>
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
                            <AppText size="xs" variant="bold" color={Theme.colors.primary} style={{ marginTop: 8 }}>
                                Nhấn nút + ở dưới để thêm giao dịch
                            </AppText>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
