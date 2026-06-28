import { Jar } from "../../domain/entities/Jar";

export class JarMapper {
    /**
     * Chuyển đổi dòng dữ liệu thô từ SQLite thành thực thể Domain Jar
     */
    public static toDomain(row: any): Jar {
        return new Jar({
            id: row.id,
            name: row.name,
            allocated_amount: row.allocated_amount,
            current_amount: row.current_amount,
            is_saving_jar: row.is_saving_jar === 1,
            month: row.month,
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
        });
    }

    /**
     * Chuyển thực thể Domain Jar thành mảng tham số để chạy SQL INSERT/UPDATE.
     */
    public static toDatabaseParams(domain: Jar): any[] {
        return [
            domain.id,
            domain.name,
            domain.allocated_amount,
            domain.current_amount,
            domain.month,
            domain.is_saving_jar ? 1 : 0,
            domain.created_at.toISOString(),
            domain.updated_at.toISOString(),
        ];
    }
}