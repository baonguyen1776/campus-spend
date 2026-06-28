import React from "react";
import {
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
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
import { Transaction } from "../../domain/entities/Transaction";

interface HomeScreenProps {
    onEditTransaction: (tx: Transaction) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function HomeScreen({ onEditTransaction }: HomeScreenProps) {
    const {
        selectedMonth,
        setSelectedMonth,
        showMonthDropdown,
        setShowMonthDropdown,
        balance,
        incomeSum,
        expenseSum,
        groupedByDay,
        getCategoryName,
        getAccountName,
        getJarName,
        MONTHS,
        loading,
        // Dynamic Categories lookup, totals, and filter states
        categoriesList,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        categoryTotals,
        setShowAllTransactions,
        showAllTransactions,
        handleDeleteTransaction,
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

                {/* ── Khung Danh mục Chi tiêu Độc lập (Phân loại chi tiêu) ── */}
                <View style={styles.categoriesSection}>
                    <View style={styles.categoriesHeader}>
                        <AppText variant="bold" size="base" color={Theme.colors.textPrimary}>
                            Phân loại chi tiêu
                        </AppText>
                        {selectedCategoryFilter && (
                            <TouchableOpacity onPress={() => setSelectedCategoryFilter(null)}>
                                <AppText size="xs" variant="bold" color="#7F26FD">
                                    Tất cả
                                </AppText>
                            </TouchableOpacity>
                        )}
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesScroll}
                    >
                        {categoriesList.filter(c => c.type === "expense").map(cat => {
                            const cfg = getCategoryConfig(cat.id);
                            const spent = categoryTotals[cat.id] || 0;
                            const isSelected = selectedCategoryFilter === cat.id;

                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.categoryChip,
                                        isSelected && styles.categoryChipSelected
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        if (isSelected) {
                                            setSelectedCategoryFilter(null);
                                        } else {
                                            setSelectedCategoryFilter(cat.id);
                                        }
                                    }}
                                >
                                    <View style={[
                                        styles.categoryIconCircle,
                                        { backgroundColor: cfg.bg, borderColor: cfg.border }
                                    ]}>
                                        <Feather name={cfg.icon as any} size={18} color={cfg.color} />
                                    </View>
                                    <AppText
                                        size="xs"
                                        variant="semiBold"
                                        color={Theme.colors.textPrimary}
                                        numberOfLines={1}
                                        style={styles.categoryName}
                                    >
                                        {cat.name}
                                    </AppText>
                                    <AppText
                                        size="xs"
                                        color={Theme.colors.textSecondary}
                                        variant="mono"
                                        style={styles.categorySpent}
                                    >
                                        {formatVND(spent)}
                                    </AppText>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* ── Phần Giao dịch ── */}
                <View style={styles.transactionsSection}>
                    {/* Header hàng: "Giao dịch" + Filter + Clock + "Trong kỳ" */}
                    <View style={styles.sectionHeader}>
                        <AppText variant="bold" size="base" color={Theme.colors.textPrimary}>
                            Giao dịch
                        </AppText>
                        <View style={styles.sectionHeaderActions}>
                            <TouchableOpacity style={styles.periodButton}
                                onPress={() => setShowAllTransactions(!showAllTransactions)}
                                activeOpacity={0.7}
                            >
                                <AppText size="xs" variant="bold" color={Theme.colors.primary}>
                                    {showAllTransactions ? "Tất cả" : "Trong kỳ"}
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Nhóm ngày + Tổng */}
                    {groupedByDay.size > 0 && (
                        <>
                            {[...groupedByDay.entries()].map(([dateLabel, txs]) => {
                                const groupTotal = txs.reduce(
                                    (sum, tx) => sum + (tx.type === "income" ? tx.amount : -tx.amount),
                                    0
                                );
                                return (
                                    <View key={dateLabel}>
                                        <View style={styles.dateGroupHeader}>
                                            <AppText size="xs" variant="bold" color={Theme.colors.textSecondary}>
                                                {dateLabel}
                                            </AppText>
                                            <AppText size="xs" color={Theme.colors.textSecondary}>
                                                {'Tổng '}
                                                <AppText size="xs" variant="bold" color={Theme.colors.textPrimary}>
                                                    {formatVND(Math.abs(groupTotal))}
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
                                                        onPress={() => {
                                                            Alert.alert(
                                                                "Chi tiết giao dịch",
                                                                `• Tên: ${tx.name}\n• Số tiền: ${tx.amount.toLocaleString('vi-VN')} ₫\n• Loại: ${isExpense ? 'Chi tiêu' : 'Thu nhập'}\n• Ghi chú: ${tx.note || 'Không có'}`,
                                                                [
                                                                    {
                                                                        text: "Đóng",
                                                                        style: "cancel"
                                                                    },
                                                                    {
                                                                        text: "Sửa",
                                                                        onPress: () => onEditTransaction(tx)
                                                                    },
                                                                    {
                                                                        text: "Xóa",
                                                                        style: "destructive",
                                                                        onPress: () => {
                                                                            Alert.alert(
                                                                                "Xác nhận xóa",
                                                                                `Bạn có chắc xóa giao dịch "${tx.name}"`,
                                                                                [
                                                                                    { text: "Hủy", style: "cancel" },
                                                                                    {
                                                                                        text: "Xóa",
                                                                                        style: "destructive",
                                                                                        onPress: () => handleDeleteTransaction(tx.id)
                                                                                    }
                                                                                ]
                                                                            );
                                                                        }
                                                                    }
                                                                ]
                                                            );
                                                        }}
                                                    >
                                                        {/* Icon danh mục */}
                                                        <View style={[
                                                            styles.txIconBox,
                                                            { backgroundColor: cfg.bg, borderColor: cfg.border }
                                                        ]}>
                                                            <Feather name={cfg.icon as any} size={18} color={cfg.color} />
                                                        </View>

                                                        {/* Tên + tài khoản*/}
                                                        <View style={styles.txMeta}>
                                                            <AppText variant="semiBold" size="sm" color={Theme.colors.textPrimary} numberOfLines={1}>
                                                                {tx.name}
                                                            </AppText>
                                                            <View style={styles.txSubRow}>
                                                                <View style={[styles.txDot, { backgroundColor: isExpense ? Theme.colors.danger : Theme.colors.primary }]} />
                                                                <AppText size="xs" color={Theme.colors.textSecondary} variant="medium">
                                                                    {getAccountName(tx.account_id)}
                                                                </AppText>
                                                                {tx.note ? (
                                                                    <AppText size="xs" color={Theme.colors.textSecondary} numberOfLines={1} style={{ flex: 1 }}>
                                                                        {' • '}{tx.note}
                                                                    </AppText>
                                                                ) : null}
                                                            </View>
                                                        </View>

                                                        {/* số tiền + giờ*/}
                                                        <View style={styles.txAmountCol}>
                                                            <AppText variant="semiBold" color={isExpense ? Theme.colors.danger : Theme.colors.primary}>
                                                                {isExpense ? '-' : '+'} {tx.amount.toLocaleString('vi-VN')} ₫
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
                                );
                            })}
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
        </ScrollView>
    );
}
