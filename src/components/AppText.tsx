import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import Theme from '../constants/theme';

// Định nghĩa kiểu dữ liệu (Type/Interface) cho các tham số truyền vào hàm AppText
// AppTextProps kế thừa toàn bộ thuộc tính mặc định của TextProps (giống kế thừa class trong C++)
interface AppTextProps extends TextProps {
    children: React.ReactNode; // Nội dung chữ nằm giữa thẻ mở và thẻ đóng <AppText>chữ ở đây</AppText>
    variant?: keyof typeof Theme.font.family; // Các kiểu font chữ (optional, có dấu ?)
    size?: keyof typeof Theme.font.size; // Kích thước chữ (optional)
    color?: string; // Màu chữ (optional)
}

// Đây là hàm Component chính
export default function AppText({
    children,
    variant = 'regular', // Giá trị mặc định nếu người dùng không truyền vào (Default Parameter giống C++/Python)
    size = 'base',
    color = Theme.colors.textPrimary, // Mặc định lấy màu chữ trắng/sáng từ Theme
    style, // style tùy biến thêm từ bên ngoài nếu có
    ...props // gom toàn bộ các thuộc tính còn lại (như onPress...) vào một biến props
}: AppTextProps) {
    return (
        <Text
            style={[
                styles.text, // Style cơ sở định nghĩa bên dưới
                {
                    fontFamily: Theme.font.family[variant], // Lấy font tương ứng từ Theme
                    fontSize: Theme.font.size[size],       // Lấy kích thước tương ứng từ Theme
                    color: color,                          // Màu chữ
                },
                style, // Nếu bên ngoài truyền thêm style riêng thì đè lên sau cùng
            ]}
            {...props} // Rải toàn bộ các thuộc tính mặc định vào thẻ Text
        >
            {children}
        </Text>
    );
}

// Khởi tạo các thuộc tính đồ họa tĩnh (StyleSheet) giống như tạo một Struct chứa thuộc tính vẽ
const styles = StyleSheet.create({
    text: {
        // Reset padding của hệ thống để chữ không bị lệch dòng trên iOS/Android
        padding: 0,
        margin: 0,
        includeFontPadding: false, // Tối ưu hiển thị phông chữ trên Android
        textAlignVertical: 'center',
    },
});
