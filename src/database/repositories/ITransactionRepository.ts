import { Transaction } from "../../domain/entities/Transaction";

export interface ITransactionRepository {
    getAll(): Promise<Transaction[]>;
    getById(id: string): Promise<Transaction | null>;
    save(transaction: Transaction): Promise<void>;
    delete(id: string): Promise<void>;
}
