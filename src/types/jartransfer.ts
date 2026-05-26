export interface IJarTransfer {
    readonly id: string; // Mã giao dịch
    from_jar_id: string // ID hũ chuyển tiền
    to_jar_id: string; // ID hũ nhận tiền
    amount: number;
    reason: string | null; // Lý do chuyển tiền từ hũ A sang B
    readonly created_at: Date;
}