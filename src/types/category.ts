export type CategoryType = 'expense' | 'income';

export interface ICategory {
    readonly id: string;
    readonly name: string;
    readonly type: CategoryType;
    readonly created_at: Date;
    readonly updated_at: Date;
}