import { Transaction } from "../domain/entities/Transaction";
import { jarService, JarService } from "./JarService";
import { transactionService, TransactionService } from "./TransactionService";

export class FinancialOrchestrator {
    private _txService: TransactionService;
    private _jarService: JarService;

    constructor(txService: TransactionService, jarService: JarService) {
        this._txService = txService;
        this._jarService = jarService;
    }

    /**
     * Hàm điều phối xử lý tự động cập nhật số dư trong hũ khi ta thêm giao dịch
     */
    public async saveTransaction(transaction: Transaction): Promise<void> {
        // 1. Check trường hợp đó là sửa transaction
        const oldTx = await this._txService.getTransactionById(transaction.id);

        if (oldTx) {
            // Nếu là sửa transaction thì cần check
            if (oldTx.type === 'expense' && oldTx.jar_id) {
                await this._jarService.refundAmount(oldTx.jar_id, oldTx.amount);
            }
        }
        try {
            if (transaction.type === 'expense' && transaction.jar_id) {
                await this._jarService.deductAmount(transaction.jar_id, transaction.amount);
            }
            await this._txService.saveTransaction(transaction);
        } catch (error) {
            if (oldTx && oldTx.type === 'expense' && oldTx.jar_id) {
                await this._jarService.deductAmount(oldTx.jar_id, oldTx.amount);
            }
            throw error;
        }
    }

    /**
     * Hàm giúp Xóa giao dịch, hoàn trả lại tiền trong hũ cũ
     */
    public async deleteTransaction(id: string): Promise<void> {
        const tx = await this._txService.getTransactionById(id);
        if (!tx) {
            throw new Error("Không tìm thấy giao dịch cần xóa!");
        }
        if (tx.type === 'expense' && tx.jar_id) {
            await this._jarService.refundAmount(tx.jar_id, tx.amount);
        }
        await this._txService.deleteTransaction(id);
    }
}

export const financialOrchestrator = new FinancialOrchestrator(transactionService, jarService);