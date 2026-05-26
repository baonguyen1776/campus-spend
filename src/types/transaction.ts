import { CategoryType } from "./category";

export interface ITransaction {
    readonly id: string;
    name: string;
    amount: number;
    type: CategoryType;
    category_id: string | null;
    account_id: string;
    jar_id: string | null;
    note: string | null;
    transaction_date: Date;
    readonly created_at: Date;
    readonly updated_at: Date;
}