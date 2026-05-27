import React, { useState } from "react";
import {
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Theme from "../../../constants/theme";
import AppText from "../../../components/AppText";
import { MOCK_CATEGORIES, MOCK_ACCOUNTS, MOCK_JARS } from "../../../constants/mockData";
import { formatVND } from "../../../utils/format";
import styles from "./AddTransactionScreen.styles";

interface AddTransactionScreenProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: {
        name: string;
        amount: number;
        type: "income" | "expense";
        category_id: string | null;
        account_id: string;
        jar_id: string | null;
        note: string | null;
        transaction_date: Date;
    }) => void;
}

export default function AddTransactionScreen({ visible, onClose, onSave }: AddTransactionScreenProps) {
    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState<"income" | "expense">("expense");
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [accountId, setAccountId] = useState<string>(MOCK_ACCOUNTS[0]?.id || "");
    const [jarId, setJarId] = useState<string | null>(null);
    const [note, setNote] = useState("");
    const [dateOption, setDateOption] = useState<"today" | "yesterday">("today");

    const [activePicker, setActivePicker] = useState<"category" | "account" | "jar" | "date" | "note_sheet" | null>(null);

    const categories = MOCK_CATEGORIES.filter(c => c.type === type);

    const handleSubmit = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ lớn hơn 0!");
            return;
        }

        if (!name.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập tên giao dịch!");
            return;
        }

        if (!accountId) {
            Alert.alert("Lỗi", "Vui lòng chọn tài khoản thanh toán!");
            return;
        }

        const transactionDate = new Date();
        if (dateOption === "yesterday") {
            transactionDate.setDate(transactionDate.getDate() - 1);
        }

        onSave({
            name: name.trim(),
            amount: numericAmount,
            type,
            category_id: categoryId,
            account_id: accountId,
            jar_id: jarId,
            note: note.trim() || null,
            transaction_date: transactionDate,
        });

        setAmount("");
        setName("");
        setType("expense");
        setCategoryId(null);
        setAccountId(MOCK_ACCOUNTS[0]?.id || "");
        setJarId(null);
        setNote("");
        setDateOption("today");
        onClose();
    };

    const getCategoryName = () => {
        if (!categoryId) return "Chọn danh mục";
        return MOCK_CATEGORIES.find(c => c.id === categoryId)?.name || "Chọn danh mục";
    };

    const getAccountName = () => {
        return MOCK_ACCOUNTS.find(a => a.id === accountId)?.name || "Chọn tài khoản";
    };

    const getJarName = () => {
        if (!jarId) return "Không phân bổ vào hũ";
        return MOCK_JARS.find(j => j.id === jarId)?.name || "Không phân bổ vào hũ";
    };

    const getDateLabel = () => {
        return dateOption === "today" ? "Hôm nay" : "Hôm qua";
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton} aria-label="Close transaction creator">
                        <Feather name="x" size={24} color={Theme.colors.textPrimary} />
                    </TouchableOpacity>
                    <AppText variant="bold" size="lg">Thêm giao dịch</AppText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.amountContainer}>
                        <AppText style={styles.amountLabel}>
                            {type === "expense" ? "Số tiền chi tiêu" : "Số tiền thu nhập"}
                        </AppText>
                        
                        <View style={styles.amountInputRow}>
                            <TextInput
                                style={styles.amountInput}
                                keyboardType="number-pad"
                                value={amount}
                                placeholder="0"
                                placeholderTextColor={Theme.colors.textDisabled}
                                onChangeText={(text) => {
                                    const clean = text.replace(/[^0-9]/g, "");
                                    setAmount(clean);
                                }}
                                autoFocus
                            />
                            <AppText style={styles.amountCurrency}> ₫</AppText>
                        </View>

                        {amount ? (
                            <AppText size="xs" color={Theme.colors.textSecondary} variant="medium" style={{ marginTop: 4 }}>
                                = {formatVND(parseInt(amount || "0"))}
                            </AppText>
                        ) : null}
                    </View>

                    <View style={styles.toggleRow}>
                        <TouchableOpacity
                            style={[
                                styles.togglePillButton,
                                type === "expense" ? styles.togglePillActive : styles.togglePillInactive,
                            ]}
                            onPress={() => {
                                setType("expense");
                                setCategoryId(null);
                            }}
                        >
                            <AppText
                                style={type === "expense" ? styles.togglePillActiveText : styles.togglePillInactiveText}
                            >
                                Chi tiêu
                            </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.togglePillButton,
                                type === "income" ? styles.togglePillActive : styles.togglePillInactive,
                            ]}
                            onPress={() => {
                                setType("income");
                                setCategoryId(null);
                                setJarId(null);
                            }}
                        >
                            <AppText
                                style={type === "income" ? styles.togglePillActiveText : styles.togglePillInactiveText}
                            >
                                Thu nhập
                            </AppText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.selectorCard}>
                            <View style={styles.selectorCardLeft}>
                                <View style={styles.selectorCardIconContainer}>
                                    <Feather name="edit-3" size={18} color="#7F26FD" />
                                </View>
                                <View style={styles.selectorCardContent}>
                                    <AppText style={styles.selectorCardLabel}>Tên giao dịch</AppText>
                                    <TextInput
                                        style={styles.selectorCardTextInput}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Ví dụ: Mua sắm, tiền điện..."
                                        placeholderTextColor={Theme.colors.textDisabled}
                                    />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.selectorCard} onPress={() => setActivePicker("category")}>
                            <View style={styles.selectorCardLeft}>
                                <View style={styles.selectorCardIconContainer}>
                                    <Feather name="tag" size={18} color="#7F26FD" />
                                </View>
                                <View style={styles.selectorCardContent}>
                                    <AppText style={styles.selectorCardLabel}>Danh mục</AppText>
                                    <AppText style={styles.selectorCardValue}>{getCategoryName()}</AppText>
                                </View>
                            </View>
                            <Feather name="chevron-right" size={18} color="#cbd5e1" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.selectorCard} onPress={() => setActivePicker("account")}>
                            <View style={styles.selectorCardLeft}>
                                <View style={styles.selectorCardIconContainer}>
                                    <Feather name="credit-card" size={18} color="#7F26FD" />
                                </View>
                                <View style={styles.selectorCardContent}>
                                    <AppText style={styles.selectorCardLabel}>Tài khoản thanh toán</AppText>
                                    <AppText style={styles.selectorCardValue}>{getAccountName()}</AppText>
                                </View>
                            </View>
                            <Feather name="chevron-right" size={18} color="#cbd5e1" />
                        </TouchableOpacity>

                        {type === "expense" && (
                            <TouchableOpacity style={styles.selectorCard} onPress={() => setActivePicker("jar")}>
                                <View style={styles.selectorCardLeft}>
                                    <View style={styles.selectorCardIconContainer}>
                                        <Feather name="pie-chart" size={18} color="#7F26FD" />
                                    </View>
                                    <View style={styles.selectorCardContent}>
                                        <AppText style={styles.selectorCardLabel}>Phân bổ vào Hũ</AppText>
                                        <AppText style={styles.selectorCardValue}>{getJarName()}</AppText>
                                    </View>
                                </View>
                                <Feather name="chevron-right" size={18} color="#cbd5e1" />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.selectorCard} onPress={() => setActivePicker("date")}>
                            <View style={styles.selectorCardLeft}>
                                <View style={styles.selectorCardIconContainer}>
                                    <Feather name="calendar" size={18} color="#7F26FD" />
                                </View>
                                <View style={styles.selectorCardContent}>
                                    <AppText style={styles.selectorCardLabel}>Ngày thực hiện</AppText>
                                    <AppText style={styles.selectorCardValue}>{getDateLabel()}</AppText>
                                </View>
                            </View>
                            <Feather name="chevron-right" size={18} color="#cbd5e1" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.selectorCard} onPress={() => setActivePicker("note_sheet")}>
                            <View style={styles.selectorCardLeft}>
                                <View style={styles.selectorCardIconContainer}>
                                    <Feather name="file-text" size={18} color="#7F26FD" />
                                </View>
                                <View style={styles.selectorCardContent}>
                                    <AppText style={styles.selectorCardLabel}>Ghi chú thêm</AppText>
                                    <AppText style={styles.selectorCardValue} numberOfLines={1}>
                                        {note ? note : "Thêm ghi chú..."}
                                    </AppText>
                                </View>
                            </View>
                            <Feather name="chevron-right" size={18} color="#cbd5e1" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <AppText variant="bold" color={Theme.colors.white}>
                            Lưu giao dịch
                        </AppText>
                    </TouchableOpacity>
                </ScrollView>

                <Modal visible={activePicker === "category"} transparent animationType="slide" onRequestClose={() => setActivePicker(null)}>
                    <TouchableOpacity style={styles.bottomSheetOverlay} activeOpacity={1} onPress={() => setActivePicker(null)}>
                        <TouchableOpacity style={styles.bottomSheetContent} activeOpacity={1}>
                            <View style={styles.bottomSheetHeader}>
                                <AppText variant="bold" size="base">Chọn danh mục</AppText>
                                <TouchableOpacity onPress={() => setActivePicker(null)} style={styles.bottomSheetCloseButton}>
                                    <AppText style={styles.bottomSheetCloseText}>Đóng</AppText>
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.bottomSheetList} showsVerticalScrollIndicator={false}>
                                {categories.map(c => (
                                    <TouchableOpacity
                                        key={c.id}
                                        style={styles.bottomSheetItem}
                                        onPress={() => {
                                            setCategoryId(c.id);
                                            setActivePicker(null);
                                        }}
                                    >
                                        <AppText variant={categoryId === c.id ? "semiBold" : "regular"}>
                                            {c.name}
                                        </AppText>
                                        {categoryId === c.id && <Feather name="check" size={16} color="#7F26FD" />}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>

                <Modal visible={activePicker === "account"} transparent animationType="slide" onRequestClose={() => setActivePicker(null)}>
                    <TouchableOpacity style={styles.bottomSheetOverlay} activeOpacity={1} onPress={() => setActivePicker(null)}>
                        <TouchableOpacity style={styles.bottomSheetContent} activeOpacity={1}>
                            <View style={styles.bottomSheetHeader}>
                                <AppText variant="bold" size="base">Chọn phương thức thanh toán</AppText>
                                <TouchableOpacity onPress={() => setActivePicker(null)} style={styles.bottomSheetCloseButton}>
                                    <AppText style={styles.bottomSheetCloseText}>Đóng</AppText>
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.bottomSheetList} showsVerticalScrollIndicator={false}>
                                {MOCK_ACCOUNTS.map(a => (
                                    <TouchableOpacity
                                        key={a.id}
                                        style={styles.bottomSheetItem}
                                        onPress={() => {
                                            setAccountId(a.id);
                                            setActivePicker(null);
                                        }}
                                    >
                                        <AppText variant={accountId === a.id ? "semiBold" : "regular"}>
                                            {a.name}
                                        </AppText>
                                        {accountId === a.id && <Feather name="check" size={16} color="#7F26FD" />}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>

                <Modal visible={activePicker === "jar"} transparent animationType="slide" onRequestClose={() => setActivePicker(null)}>
                    <TouchableOpacity style={styles.bottomSheetOverlay} activeOpacity={1} onPress={() => setActivePicker(null)}>
                        <TouchableOpacity style={styles.bottomSheetContent} activeOpacity={1}>
                            <View style={styles.bottomSheetHeader}>
                                <AppText variant="bold" size="base">Phân bổ vào hũ chi tiêu</AppText>
                                <TouchableOpacity onPress={() => setActivePicker(null)} style={styles.bottomSheetCloseButton}>
                                    <AppText style={styles.bottomSheetCloseText}>Đóng</AppText>
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.bottomSheetList} showsVerticalScrollIndicator={false}>
                                <TouchableOpacity
                                    style={styles.bottomSheetItem}
                                    onPress={() => {
                                        setJarId(null);
                                        setActivePicker(null);
                                    }}
                                >
                                    <AppText color={Theme.colors.textSecondary}>Không phân bổ vào hũ</AppText>
                                    {jarId === null && <Feather name="check" size={16} color="#7F26FD" />}
                                </TouchableOpacity>
                                {MOCK_JARS.map(j => (
                                    <TouchableOpacity
                                        key={j.id}
                                        style={styles.bottomSheetItem}
                                        onPress={() => {
                                            setJarId(j.id);
                                            setActivePicker(null);
                                        }}
                                    >
                                        <AppText variant={jarId === j.id ? "semiBold" : "regular"}>
                                            {j.name} ({formatVND(j.current_amount)})
                                        </AppText>
                                        {jarId === j.id && <Feather name="check" size={16} color="#7F26FD" />}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>

                <Modal visible={activePicker === "date"} transparent animationType="slide" onRequestClose={() => setActivePicker(null)}>
                    <TouchableOpacity style={styles.bottomSheetOverlay} activeOpacity={1} onPress={() => setActivePicker(null)}>
                        <TouchableOpacity style={styles.bottomSheetContent} activeOpacity={1}>
                            <View style={styles.bottomSheetHeader}>
                                <AppText variant="bold" size="base">Chọn ngày thực hiện</AppText>
                                <TouchableOpacity onPress={() => setActivePicker(null)} style={styles.bottomSheetCloseButton}>
                                    <AppText style={styles.bottomSheetCloseText}>Đóng</AppText>
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.bottomSheetList} showsVerticalScrollIndicator={false}>
                                <TouchableOpacity
                                    style={styles.bottomSheetItem}
                                    onPress={() => {
                                        setDateOption("today");
                                        setActivePicker(null);
                                    }}
                                >
                                    <AppText variant={dateOption === "today" ? "semiBold" : "regular"}>Hôm nay</AppText>
                                    {dateOption === "today" && <Feather name="check" size={16} color="#7F26FD" />}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.bottomSheetItem}
                                    onPress={() => {
                                        setDateOption("yesterday");
                                        setActivePicker(null);
                                    }}
                                >
                                    <AppText variant={dateOption === "yesterday" ? "semiBold" : "regular"}>Hôm qua</AppText>
                                    {dateOption === "yesterday" && <Feather name="check" size={16} color="#7F26FD" />}
                                </TouchableOpacity>
                            </ScrollView>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>

                <Modal visible={activePicker === "note_sheet"} transparent animationType="slide" onRequestClose={() => setActivePicker(null)}>
                    <TouchableOpacity style={styles.bottomSheetOverlay} activeOpacity={1} onPress={() => setActivePicker(null)}>
                        <TouchableOpacity style={styles.bottomSheetContent} activeOpacity={1}>
                            <View style={styles.bottomSheetHeader}>
                                <AppText variant="bold" size="base">Ghi chú giao dịch</AppText>
                                <TouchableOpacity onPress={() => setActivePicker(null)} style={styles.bottomSheetCloseButton}>
                                    <AppText style={styles.bottomSheetCloseText}>Đóng</AppText>
                                </TouchableOpacity>
                            </View>
                            
                            <TextInput
                                style={styles.noteTextarea}
                                value={note}
                                onChangeText={setNote}
                                placeholder="Ví dụ: Mua sắm đồ dùng học tập, ăn tối..."
                                placeholderTextColor={Theme.colors.textDisabled}
                                multiline
                                numberOfLines={4}
                                autoFocus
                            />
                            
                            <TouchableOpacity style={styles.noteSaveButton} onPress={() => setActivePicker(null)}>
                                <AppText variant="bold" color={Theme.colors.white}>
                                    Lưu ghi chú
                                </AppText>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            </View>
        </Modal>
    );
}


