import { ITransaction, CategoryType } from "../../types/index";

export class Transaction implements ITransaction {
    readonly id: string;
    private _name: string;
    private _amount: number;
    private _type: CategoryType;
    private _category_id: string | null;
    private _account_id: string;
    private _jar_id: string | null;
    private _note: string | null;
    private _transaction_date: Date;
    private _created_at: Date;
    private _updated_at: Date;

    constructor(data: Omit<ITransaction, 'created_at' | 'updated_at'> & { created_at?: Date, updated_at?: Date }) {
        if (data.amount < 0) throw new Error("Amount must be non-negative");

        this.id = data.id;
        this._name = data.name;
        this._amount = data.amount;
        this._type = data.type;
        this._category_id = data.category_id;
        this._account_id = data.account_id;
        this._jar_id = data.jar_id;
        this._note = data.note;
        this._transaction_date = data.transaction_date;
        this._created_at = data.created_at ?? new Date();
        this._updated_at = data.updated_at ?? new Date();
    }

    get name() { return this._name; }
    get amount() { return this._amount; }
    get type() { return this._type; }
    get category_id() { return this._category_id; }
    get account_id() { return this._account_id; }
    get jar_id() { return this._jar_id; }
    get note() { return this._note; }
    get transaction_date() { return this._transaction_date; }
    get created_at() { return this._created_at; }
    get updated_at() { return this._updated_at; }

    // Method update
    public updateTransaction(updates: Partial<Pick<ITransaction, 'name' | 'amount' | 'type' | 'category_id' | 'account_id' | 'jar_id' | 'note' | 'transaction_date'>>) {
        if (updates.amount !== undefined) {
            if (updates.amount < 0) throw new Error("Amount must be non-negative");
            this._amount = updates.amount;
        }

        if (updates.name !== undefined) this._name = updates.name;
        if (updates.type !== undefined) this._type = updates.type;
        if (updates.category_id !== undefined) this._category_id = updates.category_id;
        if (updates.account_id !== undefined) this._account_id = updates.account_id;
        if (updates.jar_id !== undefined) this._jar_id = updates.jar_id;
        if (updates.note !== undefined) this._note = updates.note;
        if (updates.transaction_date !== undefined) this._transaction_date = updates.transaction_date;

        this._updated_at = new Date();
    }

}