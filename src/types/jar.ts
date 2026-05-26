export interface IJar {
    readonly id: string;
    name: string;
    allocated_amount: number;
    current_amount: number;
    is_saving_jar: boolean;
    month: string; // Format: "YYYY-MM"
    readonly created_at: Date;
    readonly updated_at: Date;
}