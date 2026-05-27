import { useState, useEffect, useMemo } from "react";
import { Transaction } from "../../domain/entities/Transaction";
import { MOCK_ACCOUNTS } from "../../constants/mockData";
import { generateRecentMonths } from "../../utils/format";
import { transactionService } from "../../services/TransactionService";

const MONTHS = generateRecentMonths(4);

export function useHomeViewModel() {
    const [selectedMonth, setSelectedMonth] = useState(MONTHS[MONTHS.length - 1]);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTransactions = () => {
        transactionService.getTransactions().then(data => {
            setTransactions(data);
            setLoading(false);
        });
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    // Điều phối hành động Lưu giao dịch
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
            // Khởi tạo đối tượng Domain Model Rich Entity (Encapsulated Invariant Rules)
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

            // Thực hiện ghi nhận giao dịch thông qua tầng Service
            await transactionService.saveTransaction(newTx);

            // Cập nhật lại danh sách trên Dashboard tức thì!
            loadTransactions();
        } catch (error: any) {
            console.error("Error saving transaction:", error.message);
        }
    };

    const recentTransactions = useMemo(() => {
        // Lấy 4 giao dịch gần đây nhất để hiển thị ở trang chủ
        return transactions.slice(0, 4);
    }, [transactions]);

    const incomeSum = useMemo(() => {
        return transactions
            .filter(t => t.type === "income")
            .reduce((s, t) => s + t.amount, 0);
    }, [transactions]);

    const expenseSum = useMemo(() => {
        return transactions
            .filter(t => t.type === "expense")
            .reduce((s, t) => s + t.amount, 0);
    }, [transactions]);

    const balance = useMemo(() => {
        // Số dư hiện tại = Tổng thu nhập - Tổng chi tiêu (Theo nguyên tắc nghiệp vụ trong AGENTS.md)
        return incomeSum - expenseSum;
    }, [incomeSum, expenseSum]);

    const groupedByDay = useMemo(() => {
        return transactionService.groupTransactionsByDate(recentTransactions);
    }, [recentTransactions]);

    const firstGroupTotal = useMemo(() => {
        const firstGroup = [...groupedByDay.values()][0] ?? [];
        return transactionService.calculateGroupTotal(firstGroup);
    }, [groupedByDay]);

    const getAccountName = (accountId: string | null) => {
        const acc = MOCK_ACCOUNTS.find(a => a.id === accountId);
        return acc?.name ?? "Không rõ";
    };

    return {
        selectedMonth,
        setSelectedMonth,
        showMonthDropdown,
        setShowMonthDropdown,
        showAddModal,
        setShowAddModal,
        handleSaveTransaction,
        balance,
        incomeSum,
        expenseSum,
        groupedByDay,
        firstGroupTotal,
        getAccountName,
        MONTHS,
        loading,
    };
}
