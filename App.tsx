import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';

import HomeScreen from './src/features/transactions/HomeScreen';
import PlanScreen from './src/features/jars/PlanScreen';
import ReportScreen from './src/features/reports/ReportScreen';
import SettingsScreen from './src/features/accounts/SettingsScreen';

import Theme from './src/constants/theme';
import AppText from './src/components/AppText';

type TabType = 'home' | 'plan' | 'report' | 'settings';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
    'JetBrainsMono-Regular': JetBrainsMono_400Regular,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><AppText>Loading...</AppText></View>;
  }

  // Đa hình Registry Map (SOLID OCP): Ánh xạ từ TabType sang Component màn hình tương ứng
  const screensRegistry: Record<TabType, React.ReactNode> = {
    home: <HomeScreen />,
    plan: <PlanScreen />,
    report: <ReportScreen />,
    settings: <SettingsScreen />,
  };

  // Hàm phụ trợ để render nhanh từng nút bấm trên Tab Bar (giảm lặp code)
  const renderTabButton = (tab: TabType, iconName: any, label: string) => {
    const isActive = currentTab === tab; // Kiểm tra xem tab này có đang được chọn hay không
    // Quyết định màu sắc: Nếu active thì tô màu xanh Mint sáng, ngược lại màu xám muted
    const activeColor = isActive ? Theme.colors.primary : Theme.colors.textSecondary;

    return (
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => setCurrentTab(tab)} // Khi nhấn nút, cập nhật ngay Tab hiện tại!
        activeOpacity={0.7}
      >
        <Feather name={iconName} size={22} color={activeColor} />
        <AppText
          variant={isActive ? "semiBold" : "regular"}
          size="xs"
          color={activeColor}
          style={{ marginTop: 4 }}
        >
          {label}
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.bgBase} />

      {/* 1. HIỂN THỊ NỘI DUNG MÀN HÌNH TƯƠNG ỨNG (Lấy từ Registry Map) */}
      <View style={styles.screenContainer}>
        {screensRegistry[currentTab]}
      </View>

      {/* 2. THANH ĐIỀU HƯỚNG BOTTOM TAB BAR DƯỚI ĐÁY */}
      <View style={styles.tabBar}>
        {renderTabButton('home', 'home', 'Trang chủ')}
        {renderTabButton('plan', 'pie-chart', 'Hũ chi tiêu')}
        {renderTabButton('report', 'trending-up', 'Báo cáo')}
        {renderTabButton('settings', 'settings', 'Cài đặt')}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  screenContainer: {
    flex: 1, // Chiếm trọn không gian phía trên thanh Tab Bar
  },

  tabBar: {
    flexDirection: 'row',            // Xếp các nút theo chiều ngang
    height: Theme.layout.bottomTabHeight, // Độ cao của thanh Tab (lấy từ theme.ts: 72px)
    backgroundColor: Theme.colors.bgSurface,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: "space-around",
  },
  tabButton: {
    flex: 1,                         // Mỗi nút chiếm không gian đều nhau
    justifyContent: "center",
    alignItems: "center",

  },
});
