import { IJarRepository } from "./IJarRepository";
import { Jar } from "../../domain/entities/Jar";
import { SQLiteDatabaseManager } from "../SQLiteDatabaseManager";
import { JarMapper } from "../mappers/JarMapper";

export class SQLiteJarRepository implements IJarRepository {
    private _dbManager: SQLiteDatabaseManager;

    constructor() {
        this._dbManager = SQLiteDatabaseManager.getInstance();
    }

    /**
     * Lấy tất cả các hũ của một tháng cụ thể
     */
    public async getJarsByMonth(month: string): Promise<Jar[]> {
        const db = await this._dbManager.getDatabase();
        await this._dbManager.initialize();

        const rows = await db.getAllAsync<any>(
            "SELECT * FROM jars WHERE month = ? ORDER BY created_at DESC;",
            [month]
        );

        return rows.map(row => JarMapper.toDomain(row));
    }

    /**
     * Lấy hũ theo ID
     */
    public async getById(id: string): Promise<Jar | null> {
        const db = await this._dbManager.getDatabase();
        await this._dbManager.initialize();

        const row = await db.getFirstAsync<any>(
            "SELECT * FROM jars WHERE id = ?;",
            [id]
        );

        return row ? JarMapper.toDomain(row) : null;
    }

    /**
     * Lưu hũ mới hoặc ghi đè hũ hiện có
     */
    public async save(jar: Jar): Promise<void> {
        const db = await this._dbManager.getDatabase();
        await this._dbManager.initialize();

        const params = JarMapper.toDatabaseParams(jar);

        await db.runAsync(
            `INSERT OR REPLACE INTO jars (
                id, name, allocated_amount, current_amount, month, is_saving_jar, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            params
        );
    }

    /**
     * Xóa hũ theo ID
     */
    public async delete(id: string): Promise<void> {
        const db = await this._dbManager.getDatabase();
        await this._dbManager.initialize();

        // 1. Cập nhật các giao dịch có liên kết với hũ về NULL 
        await db.runAsync(
            "UPDATE transactions SET jar_id = NULL WHERE jar_id = ?;",
            [id]
        );


        // 2. Xoá lịch sử chuyển tiền liên quan đến hũ (nếu có)
        await db.runAsync(
            "DELETE FROM jar_transfers WHERE from_jar_id = ? OR to_jar_id = ?;",
            [id, id]
        );

        // 3. Tiến hành xóa hũ
        await db.runAsync(
            "DELETE FROM jars WHERE id = ?;",
            [id]
        );
    }
}
