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
