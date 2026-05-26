import React from 'react';
import { View, StyleSheet } from 'react-native';
import Theme from '../../constants/theme';
import AppText from '../../components/AppText';
import Card from '../../components/Card';

export default function PlanScreen() {
    return (
        <View style={styles.container}>
            <Card>
                <AppText variant="bold" size="lg" color={Theme.colors.primary}>
                    Quản Lý Hũ Chi Tiêu (Plan Screen)
                </AppText>
                <AppText size="sm" color={Theme.colors.textSecondary} style={{ marginTop: 8 }}>
                    Nơi chia nhỏ thu nhập vào các hũ và theo dõi hạn mức chi tiêu.
                </AppText>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bgBase, // Nền Dark Navy
        justifyContent: 'center',
        padding: Theme.spacing.base,
    },
});
