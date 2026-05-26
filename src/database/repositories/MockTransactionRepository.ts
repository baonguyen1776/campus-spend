import { ITransactionRepository } from "./ITransactionRepository";
import { Transaction } from "../../domain/entities/Transaction";
import { MOCK_TRANSACTIONS } from "../../constants/mockData";

export class MockTransactionRepository implements ITransactionRepository {
    private _transactions: Transaction[] = [];

    constructor() {
        // Hydrate from initial mock data
        this._transactions = MOCK_TRANSACTIONS.map(tx => new Transaction(tx));
    }

    public async getAll(): Promise<Transaction[]> {
        return [...this._transactions];
    }

    public async getById(id: string): Promise<Transaction | null> {
        const tx = this._transactions.find(t => t.id === id);
        return tx ? tx : null;
    }

    public async save(transaction: Transaction): Promise<void> {
        const index = this._transactions.findIndex(t => t.id === transaction.id);
        if (index >= 0) {
            this._transactions[index] = transaction;
        } else {
            this._transactions.push(transaction);
        }
    }

    public async delete(id: string): Promise<void> {
        this._transactions = this._transactions.filter(t => t.id !== id);
    }
}
