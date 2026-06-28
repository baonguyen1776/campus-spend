import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, Image, Alert, Modal, TextInput, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import Theme from '../../constants/theme';
import AppText from '../../components/AppText';
import { useJarViewModel } from './useJarViewModel';
import styles from './JarScreen.styles';
import App from '../../../App';

export default function JarScreen() {
    const {
        jars,
        selectedMonth,
        MONTHS,
        setSelectedMonth,
        totalAllocated,
        totalRemaining,
        showAddJarModal,
        setShowAddJarModal,
        showEditJarModal,
        setShowEditJarModal,
        editingJar,
        setEditingJar,
        handleCreateJar,
        handleDeleteJar,
        handleUpdateJar,
    } = useJarViewModel();

    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [jarFormName, setJarFormName] = useState('');
    const [jarFormAmount, setJarFormAmount] = useState('');
    const [jarFormIsSaving, setJarFormIsSaving] = useState(false);

    useEffect(() => {
        if (showEditJarModal && editingJar) {
            setJarFormName(editingJar.name);
            setJarFormAmount(editingJar.allocated_amount.toString());
            setJarFormIsSaving(editingJar.is_saving_jar);
        }
        if (!showEditJarModal && !showAddJarModal) {
            setJarFormAmount('');
            setJarFormName('');
            setJarFormIsSaving(false);
        }
    }, [showEditJarModal, showAddJarModal]);

    const formatDisplayMonth = (monthStr: string) => {
        if (!monthStr || !monthStr.includes('-'))
            return monthStr;
        const [year, month] = monthStr.split('-');
        return `Tháng ${parseInt(month, 10)}, ${year}`;
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.container}
            bounces
            showsVerticalScrollIndicator={false}
        >
            <LinearGradient
                colors={Theme.gradients.primary as any}
                style={styles.headerGradient}
            >
                {/* Top Navbar: Avatar | Month picker | Bell */}
                <View style={styles.topRow}>
                    {/** LEFT: Circle avatar */}
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                        style={styles.avatar}
                    />

                    {/** CENTRAL: Select month (Pill) */}
                    <TouchableOpacity
                        style={styles.monthSelector}
                        activeOpacity={0.7}
                        onPress={() => setShowMonthDropdown(!showMonthDropdown)}
                    >
                        <AppText size="sm" color={Theme.colors.white} variant="semiBold">
                            {formatDisplayMonth(selectedMonth)}
                        </AppText>
                        <Feather name="chevron-down" size={14} color={Theme.colors.white} />
                    </TouchableOpacity>

                    {/** RIGHT: Bell have a red points */}
                    <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
                        <Feather name='bell' size={18} color={Theme.colors.white}></Feather>
                        <View style={styles.notificationDot}></View>
                    </TouchableOpacity>
                </View>

                {/** Total money in all jar */}
                <View style={styles.summaryContainer}>
                    <AppText size="xs" variant='semiBold' style={styles.summaryLabel}>
                        TỔNG HẠN MỨC CÒN LẠI
                    </AppText>
                    <AppText variant='bold' style={styles.summaryAmount}>
                        {totalRemaining.toLocaleString('vi-VN')}
                    </AppText>
                </View>

            </LinearGradient>

            {/** Container contains list of Jars */}
            <View style={styles.contentWrapper}>
                <View style={{ paddingHorizontal: Theme.layout.screenPadding }}>
                    {/** Adding header row */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <AppText variant='bold' size="base" color={Theme.colors.textPrimary}>
                            Danh sách các hũ
                        </AppText>
                        <TouchableOpacity
                            onPress={() => setShowAddJarModal(true)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                backgroundColor: Theme.colors.primaryDim,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: Theme.radius.full
                            }}
                            activeOpacity={0.7}
                        >
                            <Feather name="plus" size={14} color={Theme.colors.primary} />
                            <AppText size='xs' variant='semiBold' color={Theme.colors.primary}>
                                Thêm hũ
                            </AppText>
                        </TouchableOpacity>
                    </View>

                    {/** Checking jars in month */}
                    {jars.length === 0 ? (
                        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                            <Feather name='folder-minus' size={40} color={Theme.colors.textSecondary} style={{ opacity: 0.5 }} />
                            <AppText size='sm' color={Theme.colors.textSecondary} style={{ marginTop: 12 }}>
                                Tháng này chưa có hũ chi tiêu nào.
                            </AppText>
                        </View>
                    ) : (
                        // Ở đây chúng ta sẽ duyệt qua danh sách jars để hiển thị
                        jars.map((jar) => {
                            const spentAmount = jar.allocated_amount - jar.current_amount;
                            const spentPercent = jar.allocated_amount > 0
                                ? Math.min((spentAmount / jar.allocated_amount) * 100, 100)
                                : 0;

                            return (
                                <View key={jar.id} style={styles.jarCard}>
                                    {/* Đầu Card: Tên hũ */}
                                    <View style={styles.cardHeader}>
                                        <View style={styles.cardHeaderLeft}>
                                            <View style={[styles.iconContainer, { backgroundColor: '#EEF2F6', borderColor: Theme.colors.border }]}>
                                                <Feather
                                                    name={jar.is_saving_jar ? "shield" : "shopping-bag"}
                                                    size={16}
                                                    color={jar.is_saving_jar ? Theme.colors.primary : Theme.colors.textPrimary}
                                                />
                                            </View>
                                            <View>
                                                <AppText variant="semiBold" size="sm">{jar.name}</AppText>
                                                <AppText size="xs" color={Theme.colors.textSecondary}>
                                                    {jar.is_saving_jar ? 'Hũ tích lũy' : 'Hũ chi tiêu'}
                                                </AppText>
                                            </View>
                                        </View>

                                        {/** Fix and delete jars */}
                                        <View style={{
                                            flexDirection: 'row',
                                            gap: 4
                                        }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setEditingJar(jar);
                                                    setShowEditJarModal(true);
                                                }}
                                                style={{ padding: 6 }}
                                                activeOpacity={0.7}
                                            >
                                                <Feather name="edit-2" size={15} color={Theme.colors.textSecondary} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    Alert.alert(
                                                        "Xoá hũ",
                                                        `Bạn có chắc muốn xoá hũ "${jar.name}"`,
                                                        [
                                                            { text: "Huỷ", style: "cancel" },
                                                            { text: "Xoá", style: "destructive", onPress: () => handleDeleteJar(jar.id) }
                                                        ]
                                                    );
                                                }}
                                                style={{ padding: 6 }}
                                                activeOpacity={0.7}
                                            >
                                                <Feather name='trash-2' size={15} color={Theme.colors.danger} />
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                    {/* Thanh tiến trình */}
                                    <View style={styles.progressTrack}>
                                        <View style={[
                                            styles.progressFill,
                                            {
                                                width: `${spentPercent}%`,
                                                backgroundColor: spentPercent >= 90 ? Theme.colors.danger : Theme.colors.primary
                                            }
                                        ]} />
                                        <AppText style={styles.progressLabel}>
                                            Đã dùng {Math.round(spentPercent)}%
                                        </AppText>
                                    </View>

                                    {/* Số tiền còn lại & hạn mức */}
                                    <View style={styles.cardFooter}>
                                        <View>
                                            <AppText size="xs" color={Theme.colors.textSecondary}>Còn lại</AppText>
                                            <AppText variant="bold" size="sm" color={Theme.colors.primary}>
                                                {jar.current_amount.toLocaleString('vi-VN')} đ
                                            </AppText>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <AppText size="xs" color={Theme.colors.textSecondary}>Hạn mức</AppText>
                                            <AppText variant="medium" size="sm">
                                                {jar.allocated_amount.toLocaleString('vi-VN')} đ
                                            </AppText>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </View>

            {/** Dropdown month */}
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
                                size='xs'
                                variant='medium'
                                color={m === selectedMonth ? Theme.colors.primary : '#334155'}
                            >
                                {formatDisplayMonth(m)}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/** JarFormModal - Use for Add and Edit Jar */}
            <Modal
                visible={showAddJarModal || showEditJarModal}
                transparent
                animationType='slide'
                onRequestClose={() => {
                    setShowAddJarModal(false);
                    setShowEditJarModal(false);
                    setEditingJar(null);
                }}
            >
                <TouchableOpacity
                    style={styles.jarFormOverlay}
                    activeOpacity={1}
                    onPress={() => {
                        setShowAddJarModal(false);
                        setShowEditJarModal(false);
                        setEditingJar(null);
                    }}
                >
                    <TouchableOpacity
                        style={styles.jarFormSheet}
                        activeOpacity={1}
                    >
                        {/** Titile */}
                        <AppText
                            style={styles.jarFormTitle}
                            variant='bold'
                            size='lg'
                        >
                            {showEditJarModal ? 'Chỉnh sửa' : 'Thêm'}
                        </AppText>

                        {/** Name Jar */}
                        <View>
                            <AppText
                                size='xs'
                                color={Theme.colors.textSecondary}
                                variant='medium'
                                style={styles.jarFormLabel}
                            >
                                Tên hũ
                            </AppText>
                            <TextInput
                                value={jarFormName}
                                onChangeText={setJarFormName}
                                placeholder='Ví dụ: Ăn uống, Tiết kiệm...'
                                placeholderTextColor={Theme.colors.textDisabled}
                                style={styles.jarFormInput}
                            />
                        </View>

                        {/** Allocated */}
                        <View>
                            <AppText
                                size='xs'
                                color={Theme.colors.textSecondary}
                                variant='medium'
                                style={styles.jarFormLabel}
                            >
                                Hạn mức (₫)
                            </AppText>
                            <TextInput
                                value={jarFormAmount}
                                onChangeText={(text) => setJarFormAmount(text.replace(/[^0-9]/g, ''))}
                                placeholder='Ví dụ: 20.000.000'
                                keyboardType='number-pad'
                                placeholderTextColor={Theme.colors.textDisabled}
                                style={styles.jarFormInput}
                            />
                        </View>

                        {/** Toggle */}
                        <View style={styles.jarFormRow}>
                            <AppText
                                size='sm'
                                variant='medium'
                                color={Theme.colors.textPrimary}
                            >
                                Hũ tích luỹ
                            </AppText>
                            <Switch
                                value={jarFormIsSaving}
                                onValueChange={setJarFormIsSaving}
                                trackColor={{
                                    false: Theme.colors.bgInput,
                                    true: Theme.colors.primaryDim
                                }}
                                thumbColor={jarFormIsSaving ? Theme.colors.primary : Theme.colors.textDisabled}
                            />
                        </View>

                        {/** Save Button */}
                        <TouchableOpacity
                            style={styles.jarFormSubmitButton}
                            activeOpacity={0.85}
                            onPress={async () => {
                                const trimmedName = jarFormName.trim();
                                const amount = parseFloat(jarFormAmount);
                                if (!trimmedName) {
                                    Alert.alert('Lỗi', 'Vui lòng nhập tên hũ!');
                                    return;
                                }
                                if (isNaN(amount) || amount <= 0) {
                                    Alert.alert('Lỗi', 'Vui lòng nhập hạn mức hợp lệ lớn hơn 0!');
                                    return;
                                }
                                try {
                                    if (showEditJarModal && editingJar) {
                                        await handleUpdateJar(editingJar.id, trimmedName, amount, jarFormIsSaving);
                                    } else {
                                        await handleCreateJar(trimmedName, amount, jarFormIsSaving);
                                    }
                                } catch (error: any) {
                                    Alert.alert('Lỗi', error.message);
                                }
                            }}
                        >
                            <AppText variant='bold' color={Theme.colors.white}>
                                {showEditJarModal ? 'Cập nhật' : 'Lưu'}
                            </AppText>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </ScrollView >
    );
}