import { IJar } from "../../types/index";

export class Jar implements IJar {
    readonly id: string;
    private _name: string;
    private _allocated_amount: number;
    private _current_amount: number;
    private _is_saving_jar: boolean;
    private _month: string;
    private _created_at: Date;
    private _updated_at: Date;
    private _warning_threshold_percent: number; // Configurable threshold (e.g., 10 for 10%)

    constructor(
        data: Omit<IJar, "created_at" | "updated_at"> & {
            created_at?: Date;
            updated_at?: Date;
            warning_threshold_percent?: number;
        }
    ) {
        if (data.allocated_amount < 0) throw new Error("Allocated amount must be non-negative");
        if (data.current_amount < 0) throw new Error("Current amount must be non-negative");

        this.id = data.id;
        this._name = data.name;
        this._allocated_amount = data.allocated_amount;
        this._current_amount = data.current_amount;
        this._is_saving_jar = data.is_saving_jar;
        this._month = data.month;
        this._created_at = data.created_at ?? new Date();
        this._updated_at = data.updated_at ?? new Date();
        this._warning_threshold_percent = data.warning_threshold_percent ?? 10;
    }

    get name() { return this._name; }
    get allocated_amount() { return this._allocated_amount; }
    get current_amount() { return this._current_amount; }
    get is_saving_jar() { return this._is_saving_jar; }
    get month() { return this._month; }
    get created_at() { return this._created_at; }
    get updated_at() { return this._updated_at; }
    get warning_threshold_percent() { return this._warning_threshold_percent; }

    set warning_threshold_percent(value: number) {
        if (value < 0 || value > 100) {
            throw new Error("Warning threshold percent must be between 0 and 100");
        }
        this._warning_threshold_percent = value;
        this._updated_at = new Date();
    }

    public updateJar(
        updates: Partial<Pick<IJar, "name" | "allocated_amount" | "current_amount" | "is_saving_jar" | "month">> & {
            warning_threshold_percent?: number;
        }
    ) {
        if (updates.allocated_amount !== undefined) {
            if (updates.allocated_amount < 0) throw new Error("Allocated amount must be non-negative");
            this._allocated_amount = updates.allocated_amount;
        }
        if (updates.current_amount !== undefined) {
            if (updates.current_amount < 0) throw new Error("Current amount must be non-negative");
            this._current_amount = updates.current_amount;
        }
        if (updates.name !== undefined) this._name = updates.name;
        if (updates.is_saving_jar !== undefined) this._is_saving_jar = updates.is_saving_jar;
        if (updates.month !== undefined) this._month = updates.month;
        
        if (updates.warning_threshold_percent !== undefined) {
            if (updates.warning_threshold_percent < 0 || updates.warning_threshold_percent > 100) {
                throw new Error("Warning threshold percent must be between 0 and 100");
            }
            this._warning_threshold_percent = updates.warning_threshold_percent;
        }
        
        this._updated_at = new Date();
    }

    public warning(): string {
        const remaining = this._current_amount;
        const allocated = this._allocated_amount;
        if (allocated <= 0) return "";

        const thresholdAmount = (allocated * this._warning_threshold_percent) / 100;
        
        if (remaining <= 0) {
            return "Hũ này đã cạn kiệt hoặc âm tiền!";
        } else if (remaining < thresholdAmount) {
            return `Hũ này gần hết tiền rồi (dưới ${this._warning_threshold_percent}%). Hãy cẩn thận nhé!`;
        } else if (this._is_saving_jar && remaining === allocated) {
            return "Hũ này chưa có tiền";
        } else {
            return "";
        }
    }
}
