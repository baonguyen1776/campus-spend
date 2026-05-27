// src/utils/format.ts

/**
 * Format currency amount to Vietnamese Dong (VND) representation.
 * @param amount Number value
 * @returns string formatted representation e.g. "1.500.000 ₫"
 */
export function formatVND(amount: number): string {
    return amount.toLocaleString("vi-VN") + " ₫";
}

/**
 * Format date value to hourly representation "HH:MM".
 * @param date Date object
 * @returns string time formatted
 */
export function formatTime(date: Date): string {
    return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

/**
 * Format date representation into localized day labels.
 * @param date Date object
 * @returns string localized date e.g. "Thứ Hai, 05 Tháng 5, 2026"
 */
export function formatGroupDate(date: Date): string {
    return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

/**
 * Generates list of recent months dynamically e.g. ["Tháng 3, 2026", "Tháng 4, 2026", "Tháng 5, 2026", "Tháng 6, 2026"]
 * @param count number of months to generate
 * @returns array of formatted month strings
 */
export function generateRecentMonths(count: number = 4): string[] {
    const months: string[] = [];
    const currentDate = new Date();
    
    // We generate months leading up to the current date
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthNum = d.getMonth() + 1;
        const yearNum = d.getFullYear();
        months.push(`Tháng ${monthNum}, ${yearNum}`);
    }
    return months;
}
