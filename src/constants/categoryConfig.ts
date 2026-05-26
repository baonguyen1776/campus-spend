// src/constants/categoryConfig.ts

export type CategoryConfig = { bg: string; border: string; icon: string; color: string };

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
    cat_food: { bg: "#FFF4EE", border: "#FFE8D6", icon: "coffee", color: "#FF8C5A" },
    cat_shopping: { bg: "#F6F0FF", border: "#EDE0FF", icon: "shopping-bag", color: "#C87DFF" },
    cat_salary: { bg: "#E8FBF5", border: "#C4F1E3", icon: "trending-up", color: "#00D09E" },
    default: { bg: "#EEF3FF", border: "#D9E5FF", icon: "credit-card", color: "#5B9BF8" },
};

export function getCategoryConfig(categoryId: string | null): CategoryConfig {
    return CATEGORY_CONFIG[categoryId ?? "default"] ?? CATEGORY_CONFIG.default;
}
