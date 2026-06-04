import React, { useState, useEffect } from "react";
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
import { SQLiteDatabaseManager } from "../../../database/SQLiteDatabaseManager";
import { formatVND } from "../../../utils/format";
import styles from "./AddTransactionScreen.styles";
import { Transaction } from "../../../domain/entities/Transaction";

interface AddTransactionScreenProps {
    visible: boolean;
    onClose: () => void;
    editingData?: Transaction | null;
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

export default function AddTransactionScreen({
    visible,
    onClose,
    onSave,
    editingData
}: AddTransactionScreenProps) {
    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState<"income" | "expense">("expense");

    const [categoriesList, setCategoriesList] = useState<{ id: string; name: string; type: string }[]>([]);
    const [accountsList, setAccountsList] = useState<{ id: string; name: string; type: string }[]>([]);
    const [jarsList, setJarsList] = useState<{ id: string; name: string; current_amount: number }[]>([]);

    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [accountId, setAccountId] = useState<string>("");
    const [jarId, setJarId] = useState<string | null>(null);
    const [note, setNote] = useState("");
    const [dateOption, setDateOption] = useState<"today" | "yesterday" | "other">("today");

    const [newCategoryName, setNewCategoryName] = useState("");
    const [activePicker, setActivePicker] = useState<"category" | "account" | "jar" | "date" | "note_sheet" | null>(null);

    const dbManager = SQLiteDatabaseManager.getInstance();

    const loadSQLiteData = async () => {
        try {
            const db = await dbManager.getDatabase();

            const cats = await db.getAllAsync<{ id: string; name: string; type: string }>(
                "SELECT * FROM categories;"
            );
            setCategoriesList(cats);

            const accs = await db.getAllAsync<{ id: string; name: string; type: string }>(
                "SELECT * FROM accounts;"
            );
            setAccountsList(accs);

            const jrs = await db.getAllAsync<{ id: string; name: string; current_amount: number }>(
                "SELECT * FROM jars;"
            );
            setJarsList(jrs);

            if (accs.length > 0 && !accountId) {
                setAccountId(accs[0].id);
            }
        } catch (error) {
            console.error("[AddTransactionScreen] Error loading SQLite data:", error);
        }
    };

    useEffect(() => {
        if (visible) {
            loadSQLiteData();

            if (editingData) {
                setAmount(editingData.amount.toString());
                setName(editingData.name);
                setType(editingData.type);
                setCategoryId(editingData.category_id);
                setAccountId(editingData.account_id);
                setJarId(editingData.jar_id);
                setNote(editingData.note || "");

                const today = new Date();
                const txDate = editingData.transaction_date;

                const isSameDate = txDate.getDate() === today.getDate() &&
                    txDate.getMonth() === today.getMonth() &&
                    txDate.getFullYear() === today.getFullYear();

                const isYesterday = txDate.getDate() === today.getDate() - 1 &&
                    txDate.getMonth() === today.getMonth() &&
                    txDate.getFullYear() === today.getFullYear();

                if (isSameDate) {
                    setDateOption("today");
                } else if (isYesterday) {
                    setDateOption("yesterday");
                } else {
                    setDateOption("other");
                }
            } else {
                setAmount("");
                setName("");
                setType("expense");
                setCategoryId(null);
                setAccountId("");
                setJarId(null);
                setNote("");
                setDateOption("today");
            }
        }
    }, [visible, editingData]);

    const categories = categoriesList.filter(c => c.type === type);

    const handleCreateCategory = async () => {
        const trimmedName = newCategoryName.trim();
        if (!trimmedName) {
            Alert.alert("Lỗi", "Vui lòng nhập tên danh mục!");
            return;
        }

        const isDuplicate = categories.some(
            c => c.name.toLowerCase() === trimmedName.toLowerCase()
        );
        if (isDuplicate) {
            Alert.alert("Lỗi", "Danh mục này đã tồn tại!");
            return;
        }

        try {
            const db = await dbManager.getDatabase();
            const newId = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
            const nowStr = new Date().toISOString();

            await db.runAsync(
                "INSERT INTO categories (id, name, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                [newId, trimmedName, type, nowStr, nowStr]
            );

            const cats = await db.getAllAsync<{ id: string; name: string; type: string }>(
                "SELECT * FROM categories;"
            );
            setCategoriesList(cats);

            setCategoryId(newId);
            setNewCategoryName("");
            Alert.alert("Thành công", `Đã tạo danh mục "${trimmedName}"!`);
        } catch (error) {
            console.error("[AddTransactionScreen] Error creating category:", error);
            Alert.alert("Lỗi", "Không thể lưu danh mục vào cơ sở dữ liệu.");
        }
    };

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

        if (type === "expense" && !categoryId) {
            Alert.alert("Lỗi", "Vui lòng chọn danh mục chi tiêu!");
            return;
        }

        if (!accountId) {
            Alert.alert("Lỗi", "Vui lòng chọn tài khoản thanh toán!");
            return;
        }

        let transactionDate = editingData ? new Date(editingData.transaction_date) : new Date()

        if (dateOption === "today") {
            transactionDate = new Date()
        } else if (dateOption === "yesterday") {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            transactionDate = yesterday;
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
        setJarId(null);
        setNote("");
        setDateOption("today");
        onClose();
    };

    const getCategoryName = () => {
        if (!categoryId) return "Chọn danh mục";
        return categoriesList.find(c => c.id === categoryId)?.name || "Chọn danh mục";
    };

    const getAccountName = () => {
        return accountsList.find(a => a.id === accountId)?.name || "Chọn tài khoản";
    };

    const getJarName = () => {
        if (!jarId) return "Không phân bổ vào hũ";
        return jarsList.find(j => j.id === jarId)?.name || "Không phân bổ vào hũ";
    };

    const getDateLabel = () => {
        if (dateOption === "today") return "Hôm nay";
        if (dateOption === "yesterday") return "Hôm qua";

        if (editingData) {
            return editingData.transaction_date.toLocaleDateString("vi-VN");
        }
        return "Hôm nay";
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton} aria-label="Close transaction creator">
                        <Feather name="x" size={24} color={Theme.colors.textPrimary} />
                    </TouchableOpacity>
                    <AppText variant="bold" size="lg">
                        {editingData ? "Chỉnh sửa" : "Thêm mới"}
                    </AppText>
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
                            {editingData ? "Cập nhật" : "Lưu"}
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

                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        backgroundColor: "#F1F5F9",
                                        borderRadius: 12,
                                        paddingHorizontal: 12,
                                        height: 40,
                                        fontSize: 14,
                                        fontFamily: Theme.font.family.medium,
                                        color: Theme.colors.textPrimary,
                                    }}
                                    value={newCategoryName}
                                    onChangeText={setNewCategoryName}
                                    placeholder="+ Tạo danh mục mới (Ví dụ: Học tập, nhà trọ...)"
                                    placeholderTextColor={Theme.colors.textDisabled}
                                />
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#7F26FD",
                                        borderRadius: 12,
                                        paddingHorizontal: 16,
                                        height: 40,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    onPress={handleCreateCategory}
                                >
                                    <AppText variant="bold" color={Theme.colors.white} size="sm">Thêm</AppText>
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
                                {accountsList.map(a => (
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
                                {jarsList.map(j => (
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
