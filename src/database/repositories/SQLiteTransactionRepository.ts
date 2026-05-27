import { ITransactionRepository } from "./ITransactionRepository";
import { Transaction } from "../../domain/entities/Transaction";
import { SQLiteDatabaseManager } from "../SQLiteDatabaseManager";
import { TransactionMapper } from "../mappers/TransactionMapper";

export class SQLiteTransactionRepository implements ITransactionRepository {
    private _dbManager: SQLiteDatabaseManager;

    constructor() {
        this._dbManager = SQLiteDatabaseManager.getInstance();
    }

    public async getAll(): Promise<Transaction[]> {
        const db = await this._dbManager.getDatabase();
        
        // Đảm bảo Database đã được tạo bảng và seed dữ liệu trước khi truy vấn
        await this._dbManager.initialize();

        const rows = await db.getAllAsync<any>(
            "SELECT * FROM transactions ORDER BY transaction_date DESC;"
        );
        
        // Sử dụng Mapper để trả về danh sách các đối tượng Domain Entity giàu logic
        return rows.map(row => TransactionMapper.toDomain(row));
    }

    public async getById(id: string): Promise<Transaction | null> {
        const db = await this._dbManager.getDatabase();
        await this._dbManager.initialize();

        const row = await db.getFirstAsync<any>(
            "SELECT * FROM transactions WHERE id = ?;",
            [id]
        );

        return row ? TransactionMapper.toDomain(row) : null;
    }

    public async save(transaction: Transaction): Promise<void> {
        const db = await this._dbManager.getDatabase();
        await this._dbManager.initialize();

        const params = TransactionMapper.toDatabaseParams(transaction);
        
        // Sử dụng INSERT OR REPLACE làm cơ chế Upsert nguyên tử an toàn
        await db.runAsync(
            `INSERT OR REPLACE INTO transactions (
                id, name, amount, type, category_id, account_id, jar_id, note, transaction_date, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            params
        );
    }

    public async delete(id: string): Promise<void> {
        const db = await this._dbManager.getDatabase();
        await this._dbManager.initialize();

        await db.runAsync(
            "DELETE FROM transactions WHERE id = ?;",
            [id]
        );
    }
}
