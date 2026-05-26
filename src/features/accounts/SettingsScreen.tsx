import React from 'react';
import { View, StyleSheet } from 'react-native';
import Theme from '../../constants/theme';
import AppText from '../../components/AppText';
import Card from '../../components/Card';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Card>
        <AppText variant="bold" size="lg" color={Theme.colors.primary}>
          Cài Đặt Tài Khoản (Settings Screen)
        </AppText>
        <AppText size="sm" color={Theme.colors.textSecondary} style={{ marginTop: 8 }}>
          Cấu hình thông tin cá nhân và quản lý tài khoản ví.
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
