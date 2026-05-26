import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Theme from '../constants/theme';

// 1. ĐỊNH NGHĨA ENUM CHO BIẾN THỂ CARD (CHUẨN OOP TĨNH)
// Đóng gói các nhãn biến thể, tránh lỗi gõ sai chuỗi (Magic Strings)
export enum CardVariant {
    DEFAULT = 'default',
    ELEVATED = 'elevated',
    OUTLINED = 'outlined',
}

// 2. ĐỊNH NGHĨA THAM SỐ ĐẦU VÀO (PROPS INTERFACE)
interface CardProps extends ViewProps {
    children: React.ReactNode;
    variant?: CardVariant;
}

// 3. KHAI BÁO COMPONENT CHÍNH
export default function Card({
    children,
    variant = CardVariant.DEFAULT,
    style,
    ...props
}: CardProps) {
    // Lấy trực tiếp style tương ứng từ Polymorphic Map tĩnh ở dưới (O(1) complexity, không dùng switch-case)
    const cardStyle = variantStyles[variant];

    return (
        <View style={[styles.baseCard, cardStyle, style]} {...props}>
            {children}
        </View>
    );
}

// 4. THIẾT KẾ ĐỒ HỌA NỘI BỘ (STYLE SHEET)
const styles = StyleSheet.create({
    // Style cơ sở chung cho tất cả các Card
    baseCard: {
        borderRadius: Theme.radius.lg,      // Sử dụng token bo góc 16px từ theme.ts
        padding: Theme.layout.cardPadding,   // Sử dụng token padding 20px từ theme.ts
    },

    defaultCard: {
        backgroundColor: Theme.colors.bgSurface, // Màu nền Navy Surface (#161B25)
        borderWidth: 1,                          // Đường viền mảnh 1px
        borderColor: Theme.colors.border,        // Màu viền mờ (#242E42)
    },

    elevatedCard: {
        backgroundColor: Theme.colors.bgElevated, // Màu nền Navy Elevated (#1E2636)
        ...Theme.shadow.sm,                      // Trải bóng đổ tĩnh từ theme.ts
    },

    outlinedCard: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
});

// 5. POLYMORPHIC REGISTRY MAP (BẢN ĐỒ ÁNH XẠ ĐA HÌNH)
// Ánh xạ trực tiếp từ Enum sang style tương ứng, tuân thủ nguyên lý SOLID OCP (dễ dàng mở rộng)
const variantStyles: Record<CardVariant, any> = {
    [CardVariant.DEFAULT]: styles.defaultCard,
    [CardVariant.ELEVATED]: styles.elevatedCard,
    [CardVariant.OUTLINED]: styles.outlinedCard,
};
