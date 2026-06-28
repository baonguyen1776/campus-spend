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
import JarScreen from './src/features/jars/JarScreen';
import ReportScreen from './src/features/reports/ReportScreen';
import SettingsScreen from './src/features/accounts/SettingsScreen';

import Theme from './src/constants/theme';
import AppText from './src/components/AppText';

import AddTransactionScreen from './src/features/transactions/components/AddTransactionScreen';
import { Transaction } from './src/domain/entities/Transaction';
import { transactionService } from './src/services/TransactionService';

type TabType = 'home' | 'jar' | 'report' | 'settings';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Trigger reload danh sách khi có giao dịch mới
  const [editingData, setEditingData] = useState<Transaction | null>(null);

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

  // Điều phối hành động Lưu giao dịch mới ở cấp ứng dụng trung tâm
  const handleSaveTransaction = async (data: {
    name: string;
    amount: number;
    type: "income" | "expense";
    category_id: string | null;
    account_id: string;
    jar_id: string | null;
    note: string | null;
    transaction_date: Date;
  }) => {
    try {
      if (editingData) {
        editingData.updateTransaction({
          name: data.name,
          amount: data.amount,
          type: data.type,
          category_id: data.category_id,
          account_id: data.account_id,
          jar_id: data.jar_id,
          note: data.note,
          transaction_date: data.transaction_date,
        });

        await transactionService.saveTransaction(editingData);
      } else {
        const newTx = new Transaction({
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          name: data.name,
          amount: data.amount,
          type: data.type,
          category_id: data.category_id || "",
          account_id: data.account_id,
          jar_id: data.jar_id,
          note: data.note,
          transaction_date: data.transaction_date,
        });

        // Lưu giao dịch qua Service Singleton
        await transactionService.saveTransaction(newTx);
      }

      // Tăng refreshKey để kích hoạt re-mount màn hình HomeScreen đồng bộ tức thì
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      console.error("Error saving transaction at App level:", error.message);
    }
  };

  // Registry Map kết hợp refreshKey động để làm mới màn hình HomeScreen
  const screensRegistry: Record<TabType, React.ReactNode> = {
    home: <HomeScreen
      key={refreshKey}
      onEditTransaction={(tx) => {
        setEditingData(tx);
        setShowAddTransaction(true);
      }}
    />,
    jar: <JarScreen />,
    report: <ReportScreen />,
    settings: <SettingsScreen />,
  };

  // Hàm phụ trợ để render các nút bấm trên Tab Bar
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
        <Feather name={iconName} size={20} color={activeColor} />
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

      {/* 1. HIỂN THỊ NỘI DUNG MÀN HÌNH TƯƠNG ỨNG */}
      <View style={styles.screenContainer}>
        {screensRegistry[currentTab]}
      </View>

      {/* 2. THANH ĐIỀU HƯỚNG BOTTOM TAB BAR DƯỚI ĐÁY VỚI NÚT PLUS NỔI CHÍNH GIỮA */}
      <View style={styles.tabBar}>
        {renderTabButton('home', 'home', 'Trang chủ')}
        {renderTabButton('report', 'bar-chart-2', 'Báo cáo')}

        {/* Nút Plus nổi chính giữa thanh điều hướng */}
        <View style={styles.fabWrapper}>
          <TouchableOpacity
            style={styles.fabButton}
            activeOpacity={0.85}
            onPress={() => setShowAddTransaction(true)}
          >
            <Feather name="plus" size={26} color={Theme.colors.white} />
          </TouchableOpacity>
        </View>

        {renderTabButton('jar', 'credit-card', 'Hũ chi tiêu')}
        {renderTabButton('settings', 'settings', 'Cài đặt')}
      </View>

      {/* 3. MODAL NHẬP GIAO DỊCH MỚI TRUNG TÂM */}
      <AddTransactionScreen
        visible={showAddTransaction}
        editingData={editingData}
        onClose={() => {
          setShowAddTransaction(false);
          setEditingData(null);
        }}
        onSave={handleSaveTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: Theme.layout.bottomTabHeight,
    backgroundColor: Theme.colors.bgSurface,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: "space-around",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  fabButton: {
    width: 52, // Thiết kế thu gọn 52px cực kỳ tinh tế giống bản mẫu
    height: 52,
    borderRadius: 26, // Bo tròn tuyệt đối (52 / 2)
    backgroundColor: '#7F26FD', // Sắc tím Indigo sang trọng nổi bật từ bản mẫu
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -8, // Chỉ nhô lên một đoạn rất nhỏ (8px) so với mép trên của Tab Bar

    // Quầng bóng đổ màu tím lan tỏa sâu, mềm mại (iOS)
    shadowColor: '#7F26FD',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,

    // Bóng đổ trên Android
    elevation: 8,
    zIndex: 999,
  },
});
