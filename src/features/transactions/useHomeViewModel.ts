import { useState, useEffect, useMemo } from "react";
import { MockTransactionRepository } from "../../database/repositories/MockTransactionRepository";
import { TransactionService } from "../../services/TransactionService";
import { Transaction } from "../../domain/entities/Transaction";
import { MOCK_ACCOUNTS } from "../../constants/mockData";

// Singletons initialized for local in-memory persistence
const transactionRepository = new MockTransactionRepository();
const transactionService = new TransactionService(transactionRepository);

const MONTHS = ["Tháng 3, 2026", "Tháng 4, 2026", "Tháng 5, 2026", "Tháng 6, 2026"];

export function useHomeViewModel() {
    const [selectedMonth, setSelectedMonth] = useState(MONTHS[2]);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        transactionService.getTransactions().then(data => {
            if (isMounted) {
                setTransactions(data);
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const recentTransactions = useMemo(() => {
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
        return 12450000 + incomeSum - expenseSum;
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
