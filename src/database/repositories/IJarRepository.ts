import { Jar } from "../../domain/entities/Jar";

export interface IJarRepository {
    /**
     * Lấy tất cả các hũ chi tiêu thuộc về một tháng cụ thể (Định dạng tháng: "YYYY-MM")
     */
    getJarsByMonth(month: string): Promise<Jar[]>;

    /**
     * Lưu hũ mới hoặc cập nhật một hũ hiện có
     */
    save(jar: Jar): Promise<void>;

    /**
     * Tìm kiếm một hũ dựa trên ID
     */
    getById(id: string): Promise<Jar | null>;

    /**
     * Xóa một hũ khỏi hệ thống theo ID
     */
    delete(id: string): Promise<void>;
}
