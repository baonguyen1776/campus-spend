export type AccountType = 'cash' | 'bank' | 'card' | 'e-wallet';

export interface IAccount {
    readonly id: string;
    readonly name: string;
    readonly type: AccountType;
    readonly created_at: Date;
    readonly updated_at: Date;
}