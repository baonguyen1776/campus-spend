import { ITransactionRepository } from "../database/repositories/ITransactionRepository";
import { Transaction } from "../domain/entities/Transaction";
import { formatGroupDate } from "../utils/format";

export class TransactionService {
    private _transactionRepository: ITransactionRepository;

    constructor(transactionRepository: ITransactionRepository) {
        this._transactionRepository = transactionRepository;
    }

    public async getTransactions(): Promise<Transaction[]> {
        return this._transactionRepository.getAll();
    }

    public async calculateTotalIncome(transactions: Transaction[]): Promise<number> {
        return transactions
            .filter(t => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
    }

    public async calculateTotalExpense(transactions: Transaction[]): Promise<number> {
        return transactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
    }

    public async calculateCurrentBalance(transactions: Transaction[], baseBalance: number = 0): Promise<number> {
        const income = await this.calculateTotalIncome(transactions);
        const expense = await this.calculateTotalExpense(transactions);
        return baseBalance + income - expense;
    }

    public groupTransactionsByDate(transactions: Transaction[]): Map<string, Transaction[]> {
        const groups: Map<string, Transaction[]> = new Map();

        transactions.forEach(tx => {
            const key = formatGroupDate(tx.transaction_date);
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key)!.push(tx);
        });

        return groups;
    }

    public calculateGroupTotal(group: Transaction[]): number {
        return group.reduce(
            (sum, tx) => sum + (tx.type === "income" ? tx.amount : -tx.amount),
            0
        );
    }

    public async saveTransaction(transaction: Transaction): Promise<void> {
        // Enforce Business Rules (AGENTS.md):
        // 1. Số tiền (amount) phải luôn là số dương.
        // 2. Không lưu giao dịch nếu số tiền bằng 0 hoặc âm.
        if (transaction.amount <= 0) {
            throw new Error("Số tiền giao dịch phải lớn hơn 0!");
        }

        // 3. Nếu là chi tiêu (expense), bắt buộc phải có danh mục chi tiêu.
        if (transaction.type === "expense" && !transaction.category_id) {
            throw new Error("Giao dịch chi tiêu bắt buộc phải có danh mục!");
        }

        await this._transactionRepository.save(transaction);
    }

    public async deleteTransaction(id: string): Promise<void> {
        // Gọi đến repositỏy để thực hiện xóa
        await this._transactionRepository.delete(id);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHƯƠNG ÁN SINGLETON CHO LOCAL DATABASE STATE (OOP CHUẨN SOLID DIP)
// Đảm bảo toàn bộ ứng dụng chỉ sử dụng duy nhất một bộ máy lưu trữ cơ sở dữ liệu SQLite cục bộ
import { SQLiteTransactionRepository } from "../database/repositories/SQLiteTransactionRepository";

export const transactionRepository = new SQLiteTransactionRepository();
export const transactionService = new TransactionService(transactionRepository);
