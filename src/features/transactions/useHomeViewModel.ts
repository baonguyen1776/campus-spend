import { useState, useEffect, useMemo } from "react";
import { Transaction } from "../../domain/entities/Transaction";
import { generateRecentMonths } from "../../utils/format";
import { transactionService } from "../../services/TransactionService";
import { SQLiteDatabaseManager } from "../../database/SQLiteDatabaseManager";
import { financialOrchestrator } from "../../services/FinancialOrchestrator";
import { Alert } from "react-native";

const MONTHS = generateRecentMonths(4);

export function useHomeViewModel() {
    const [selectedMonth, setSelectedMonth] = useState(MONTHS[MONTHS.length - 1]);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Dynamic local states loaded from SQLite
    const [categories, setCategories] = useState<{ id: string; name: string; type: string }[]>([]);
    const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);
    const [jars, setJars] = useState<{ id: string; name: string }[]>([]);

    // Interactive Category Filter State
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

    const [showAllTransactions, setShowAllTransactions] = useState(false);

    const [loading, setLoading] = useState(true);

    const dbManager = SQLiteDatabaseManager.getInstance();

    // Query all data dynamically from SQLite
    const loadAllData = async () => {
        try {
            const txs = await transactionService.getTransactions();
            setTransactions(txs);

            const db = await dbManager.getDatabase();

            const cats = await db.getAllAsync<{ id: string; name: string; type: string }>(
                "SELECT id, name, type FROM categories;"
            );
            setCategories(cats);

            const accs = await db.getAllAsync<{ id: string; name: string }>(
                "SELECT id, name FROM accounts;"
            );
            setAccounts(accs);

            const jrs = await db.getAllAsync<{ id: string; name: string }>(
                "SELECT id, name FROM jars;"
            );
            setJars(jrs);

            setLoading(false);
        } catch (error) {
            console.error("[useHomeViewModel] Error loading dynamic SQLite data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, []);

    const loadTransactions = () => {
        loadAllData();
    };

    // Dynamic Lookups
    const getCategoryName = (categoryId: string | null) => {
        if (!categoryId) return "Chưa phân loại";
        return categories.find(c => c.id === categoryId)?.name ?? "Chưa phân loại";
    };

    const getAccountName = (accountId: string | null) => {
        if (!accountId) return "Không rõ";
        return accounts.find(a => a.id === accountId)?.name ?? "Không rõ";
    };

    const getJarName = (jarId: string | null) => {
        if (!jarId) return null;
        return jars.find(j => j.id === jarId)?.name ?? null;
    };

    const transactionOfSelectedMonth = useMemo(() => {
        return transactions.filter(t => {
            const date = t.transaction_date;
            const month = `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`
            return month === selectedMonth;
        });
    }, [transactions, selectedMonth]);

    // Calculate sum of spent amount for each expense category
    const categoryTotals = useMemo(() => {
        const totals: Record<string, number> = {};
        transactionOfSelectedMonth.forEach(t => {
            if (t.type === "expense" && t.category_id) {
                totals[t.category_id] = (totals[t.category_id] || 0) + t.amount;
            }
        });
        return totals;
    }, [transactionOfSelectedMonth]);

    // Handle dynamic save
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

            await financialOrchestrator.saveTransaction(newTx);
            loadTransactions();
        } catch (error: any) {
            console.error("Error saving transaction:", error.message);
            Alert.alert("Cannot save", error.message);
        }
    };

    // Apply interactive category filter to list
    const filteredTransactions = useMemo(() => {
        if (!selectedCategoryFilter) return transactionOfSelectedMonth;
        return transactionOfSelectedMonth.filter(t => t.category_id === selectedCategoryFilter);
    }, [transactionOfSelectedMonth, selectedCategoryFilter]);

    const recentTransactions = useMemo(() => {
        if (showAllTransactions) { return filteredTransactions; }
        return filteredTransactions.slice(0, 4);
    }, [filteredTransactions, showAllTransactions]);

    const incomeSum = useMemo(() => {
        return transactionOfSelectedMonth
            .filter(t => t.type === "income")
            .reduce((s, t) => s + t.amount, 0);
    }, [transactionOfSelectedMonth]);

    const expenseSum = useMemo(() => {
        return transactionOfSelectedMonth
            .filter(t => t.type === "expense")
            .reduce((s, t) => s + t.amount, 0);
    }, [transactionOfSelectedMonth]);

    const balance = useMemo(() => {
        return incomeSum - expenseSum;
    }, [incomeSum, expenseSum]);

    const groupedByDay = useMemo(() => {
        return transactionService.groupTransactionsByDate(recentTransactions);
    }, [recentTransactions]);

    const firstGroupTotal = useMemo(() => {
        const firstGroup = [...groupedByDay.values()][0] ?? [];
        return transactionService.calculateGroupTotal(firstGroup);
    }, [groupedByDay]);

    // Handle delete transaction
    const handleDeleteTransaction = async (id: string) => {
        try {
            await financialOrchestrator.deleteTransaction(id);
            loadTransactions();
        } catch (error: any) {
            console.error("Error deleting transaction:", error.message);
        }
    };

    return {
        selectedMonth,
        setSelectedMonth,
        showMonthDropdown,
        setShowMonthDropdown,
        showAddModal,
        setShowAddModal,
        handleSaveTransaction,
        handleDeleteTransaction,
        balance,
        incomeSum,
        expenseSum,
        groupedByDay,
        firstGroupTotal,
        getCategoryName,
        getAccountName,
        getJarName,
        MONTHS,
        loading,
        // Category section lookups & states
        categoriesList: categories,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        categoryTotals,
        showAllTransactions,
        setShowAllTransactions,
    };
}
