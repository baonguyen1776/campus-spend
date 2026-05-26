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

    public async calculateCurrentBalance(transactions: Transaction[], baseBalance: number = 12450000): Promise<number> {
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
}
