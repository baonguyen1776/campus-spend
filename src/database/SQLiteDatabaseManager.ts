import * as SQLite from "expo-sqlite";

export class SQLiteDatabaseManager {
    private static _instance: SQLiteDatabaseManager | null = null;
    private _db: SQLite.SQLiteDatabase | null = null;
    private _isInitialized = false;

    private constructor() {}

    /**
     * Lấy thực thể Singleton duy nhất của SQLiteDatabaseManager
     */
    public static getInstance(): SQLiteDatabaseManager {
        if (!SQLiteDatabaseManager._instance) {
            SQLiteDatabaseManager._instance = new SQLiteDatabaseManager();
        }
        return SQLiteDatabaseManager._instance;
    }

    /**
     * Mở cơ sở dữ liệu SQLite bất đồng bộ (API Modern của Expo SDK)
     */
    public async getDatabase(): Promise<SQLite.SQLiteDatabase> {
        if (!this._db) {
            this._db = await SQLite.openDatabaseAsync("campus_spend.db");
        }
        return this._db;
    }

    /**
     * Khởi tạo cơ sở dữ liệu: Tạo các bảng và nạp dữ liệu mặc định (Seeding)
     */
    public async initialize(): Promise<void> {
        if (this._isInitialized) return;

        try {
            const db = await this.getDatabase();

            // 1. Tạo các bảng cơ sở dữ liệu theo chuẩn database-design.md
            await db.execAsync(`
                PRAGMA foreign_keys = ON;

                CREATE TABLE IF NOT EXISTS categories (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS accounts (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS jars (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    allocated_amount REAL NOT NULL,
                    current_amount REAL NOT NULL,
                    month TEXT NOT NULL,
                    is_saving_jar INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS transactions (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    amount REAL NOT NULL,
                    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
                    category_id TEXT,
                    account_id TEXT,
                    jar_id TEXT,
                    transaction_date TEXT NOT NULL,
                    note TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (category_id) REFERENCES categories(id),
                    FOREIGN KEY (account_id) REFERENCES accounts(id),
                    FOREIGN KEY (jar_id) REFERENCES jars(id)
                );

                CREATE TABLE IF NOT EXISTS jar_transfers (
                    id TEXT PRIMARY KEY,
                    from_jar_id TEXT NOT NULL,
                    to_jar_id TEXT NOT NULL,
                    amount REAL NOT NULL,
                    reason TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (from_jar_id) REFERENCES jars(id),
                    FOREIGN KEY (to_jar_id) REFERENCES jars(id)
                );
            `);

            // 2. Chạy Seeding Dữ Liệu Mẫu nếu Cơ sở dữ liệu trống
            await this.seedDefaultData(db);

            this._isInitialized = true;
            console.log("[SQLiteDatabaseManager] Database initialized and seeded successfully.");
        } catch (error) {
            console.error("[SQLiteDatabaseManager] Database initialization failed:", error);
            throw error;
        }
    }

    /**
     * Nạp dữ liệu mặc định ban đầu nếu bảng trống (Seeding)
     */
    private async seedDefaultData(db: SQLite.SQLiteDatabase): Promise<void> {
        // A. Seed Bảng Categories (Danh mục)
        const categoriesCount = await db.getFirstAsync<{ count: number }>(
            "SELECT COUNT(*) as count FROM categories;"
        );
        if (categoriesCount && categoriesCount.count === 0) {
            const now = new Date().toISOString();
            await db.runAsync(
                "INSERT INTO categories (id, name, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                ["cat_food", "Ăn uống", "expense", now, now]
            );
            await db.runAsync(
                "INSERT INTO categories (id, name, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                ["cat_shopping", "Mua sắm", "expense", now, now]
            );
            await db.runAsync(
                "INSERT INTO categories (id, name, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                ["cat_salary", "Tiền lương", "income", now, now]
            );
            console.log("[SQLiteDatabaseManager] Categories seeded.");
        }

        // B. Seed Bảng Accounts (Tài khoản)
        const accountsCount = await db.getFirstAsync<{ count: number }>(
            "SELECT COUNT(*) as count FROM accounts;"
        );
        if (accountsCount && accountsCount.count === 0) {
            const now = new Date().toISOString();
            await db.runAsync(
                "INSERT INTO accounts (id, name, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                ["acc_cash", "Tiền mặt", "cash", now, now]
            );
            await db.runAsync(
                "INSERT INTO accounts (id, name, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                ["acc_momo", "Ví Momo", "e-wallet", now, now]
            );
            console.log("[SQLiteDatabaseManager] Accounts seeded.");
        }

        // C. Seed Bảng Jars (Hũ chi tiêu)
        const jarsCount = await db.getFirstAsync<{ count: number }>(
            "SELECT COUNT(*) as count FROM jars;"
        );
        if (jarsCount && jarsCount.count === 0) {
            const now = new Date().toISOString();
            await db.runAsync(
                "INSERT INTO jars (id, name, allocated_amount, current_amount, month, is_saving_jar, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                ["jar1", "Chi tiêu cá nhân", 2500000, 2500000, "2026-05", 0, now, now]
            );
            await db.runAsync(
                "INSERT INTO jars (id, name, allocated_amount, current_amount, month, is_saving_jar, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                ["jar2", "Tiết kiệm", 1000000, 500000, "2026-05", 1, now, now]
            );
            console.log("[SQLiteDatabaseManager] Jars seeded.");
        }

        // D. Seed Bảng Transactions (Giao dịch ban đầu)
        const txsCount = await db.getFirstAsync<{ count: number }>(
            "SELECT COUNT(*) as count FROM transactions;"
        );
        if (txsCount && txsCount.count === 0) {
            const now = new Date().toISOString();
            const date1 = new Date("2026-05-01T00:00:00Z").toISOString();
            const date2 = new Date("2026-05-05T00:00:00Z").toISOString();

            await db.runAsync(
                "INSERT INTO transactions (id, name, amount, type, category_id, account_id, jar_id, transaction_date, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    "trans_001",
                    "Mua giáo trình",
                    100000,
                    "expense",
                    "cat_food",
                    "acc_cash",
                    "jar1",
                    date1,
                    "Mua sách cho môn học",
                    date1,
                    date1,
                ]
            );
            await db.runAsync(
                "INSERT INTO transactions (id, name, amount, type, category_id, account_id, jar_id, transaction_date, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    "trans_002",
                    "Mua trà sữa",
                    50000,
                    "expense",
                    "cat_food",
                    "acc_momo",
                    "jar1",
                    date2,
                    "Mua trà sữa cho buổi học chiều",
                    date2,
                    date2,
                ]
            );
            console.log("[SQLiteDatabaseManager] Transactions seeded.");
        }
    }
}
