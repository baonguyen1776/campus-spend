import { IJarRepository } from "../database/repositories/IJarRepository";
import { Jar } from "../domain/entities/Jar";
import { SQLiteJarRepository } from "../database/repositories/SQLiteJarRepository";

export class JarService {
    private _jarRepository: IJarRepository;

    constructor(jarRepository: IJarRepository) {
        this._jarRepository = jarRepository;
    }

    public async getJarsByMonth(month: string): Promise<Jar[]> {
        return this._jarRepository.getJarsByMonth(month);
    }

    public async getJarById(id: string): Promise<Jar | null> {
        return this._jarRepository.getById(id);
    }

    public async saveJar(jar: Jar): Promise<void> {
        return this._jarRepository.save(jar);
    }

    public async deleteJar(id: string): Promise<void> {
        return this._jarRepository.delete(id);
    }

    /**
     * Kiểm tra xem nếu tiêu một số tiền `amount` thì hũ có bị vượt hạn mức không
     */
    public async checkOverspent(jarId: string, amount: number): Promise<{ isOverspent: boolean, exceededAmount: number }> {
        const jar = await this.getJarById(jarId);
        if (!jar) {
            return { isOverspent: false, exceededAmount: 0 };
        }
        const remainingAmount = jar.current_amount - amount;
        return { isOverspent: remainingAmount < 0, exceededAmount: remainingAmount };
    }

    /**
     * Khấu trừ số tiền từ hũ chi tiêu (khi thêm giao dịch chi tiêu)
     */
    public async deductAmount(jarId: string, amount: number): Promise<string> {
        const jar = await this._jarRepository.getById(jarId);
        if (!jar) throw new Error('Không tìm thấy hũ tương ứng');

        const { isOverspent, exceededAmount } = await this.checkOverspent(jarId, amount);
        if (isOverspent) throw new Error(`Số tiền vượt quá hạn mức còn lại trong hũ`)

        jar.updateJar({ current_amount: jar.current_amount - amount });
        await this._jarRepository.save(jar);

        return jar.warning();
    }

    /**
     * Hoàn lại số tiền vào hũ chi tiêu (khi xóa giao dịch chi tiêu)
     */
    public async refundAmount(jarId: string, amount: number): Promise<void> {
        const jar = await this._jarRepository.getById(jarId);
        if (!jar) return; // Không tìm thấy hũ tương ứng

        jar.updateJar({ current_amount: jar.current_amount + amount });
        await this._jarRepository.save(jar);
    }

    /**
     * Update information about jars, caculating save current amount
     */
    public async updateJarLimit(
        jarId: string,
        name: string,
        newAllocated: number,
        isSaving: boolean
    ): Promise<void> {
        const jar = await this.getJarById(jarId);
        if (!jar) {
            throw new Error("Không có hũ cần update");
        }

        const spentAmount = jar.allocated_amount - jar.current_amount;

        // Check: New allowcated must not lower spending amount
        if (newAllocated < spentAmount) {
            throw new Error(`Hạn mức mới không thể nhỏ hơn số đã chi tiêu (${spentAmount.toLocaleString('vi-VN')} đ).`);
        }

        const newCurrent = newAllocated - spentAmount;
        jar.updateJar({
            name,
            allocated_amount: newAllocated,
            current_amount: newCurrent,
            is_saving_jar: isSaving,
        });

        await this.saveJar(jar);
    }
}

export const jarRepository = new SQLiteJarRepository();
export const jarService = new JarService(jarRepository);