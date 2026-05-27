import { Transaction } from "../../domain/entities/Transaction";

export class TransactionMapper {
    /**
     * Chuyển đổi dòng dữ liệu thô (raw row) từ SQLite truy vấn thành đối tượng Domain Entity giàu logic.
     */
    public static toDomain(row: any): Transaction {
        return new Transaction({
            id: row.id,
            name: row.name,
            amount: row.amount,
            type: row.type as "income" | "expense",
            category_id: row.category_id,
            account_id: row.account_id,
            jar_id: row.jar_id,
            note: row.note,
            transaction_date: new Date(row.transaction_date),
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
        });
    }

    /**
     * Ánh xạ đối tượng Domain Entity thành mảng tham số câu lệnh SQL thô sẵn sàng để lưu trữ.
     */
    public static toDatabaseParams(domain: Transaction): any[] {
        return [
            domain.id,
            domain.name,
            domain.amount,
            domain.type,
            domain.category_id,
            domain.account_id,
            domain.jar_id,
            domain.note,
            domain.transaction_date.toISOString(),
            domain.created_at.toISOString(),
            domain.updated_at.toISOString(),
        ];
    }
}
