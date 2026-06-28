import { useState, useEffect, useMemo } from "react";
import { jarService, JarService } from "../../services/JarService";
import { FinancialOrchestrator } from "../../services/FinancialOrchestrator";
import { generateRecentMonths } from "../../utils/format";
import { Jar } from "../../domain/entities/Jar";

function generateMonthForJar(count: number): string[] {
    const month: string[] = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        month.push(m);
    }

    return month;
}

const MONTHS = generateMonthForJar(4);

export function useJarViewModel() {
    const [jars, setJars] = useState<Jar[]>([]);
    const [name, setName] = useState<string>("Nhập tên khoản tiết kiệm");
    const [targetAmount, setTargetAmount] = useState<number>(0);

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [loading, setLoading] = useState(true);

    const [showAddJarModal, setShowAddJarModal] = useState(false);
    const [showEditJarModal, setShowEditJarModal] = useState(false);
    const [editingJar, setEditingJar] = useState<Jar | null>(null);

    const loadAllData = async () => {
        try {
            const jarList = await jarService.getJarsByMonth(selectedMonth);
            setJars(jarList);
            setLoading(false);
        } catch (error) {
            console.error("Error loading jars", error);
            setLoading(false);
        }
    };

    const handleCreateJar = async (name: string, allocatedAmount: number, isSaving: boolean) => {
        const newJar = new Jar({
            id: `jar_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name,
            allocated_amount: allocatedAmount,
            current_amount: allocatedAmount,
            month: selectedMonth,
            is_saving_jar: isSaving,
        });
        await jarService.saveJar(newJar);
        await loadAllData();
        setShowAddJarModal(false);
    }

    const handleDeleteJar = async (jarId: string) => {
        await jarService.deleteJar(jarId);
        await loadAllData();
    }

    const handleUpdateJar = async (
        jarId: string,
        name: string,
        newAllocated: number,
        isSaving: boolean,
    ) => {
        await jarService.updateJarLimit(jarId, name, newAllocated, isSaving);
        await loadAllData();
        setShowEditJarModal(false);
        setEditingJar(null);
    }

    useEffect(() => {
        loadAllData();
    }, [selectedMonth]);

    const totalAllocated = useMemo(() => {
        return jars.reduce((sum, jar) => sum + jar.allocated_amount, 0);
    }, [jars]);

    const totalRemaining = useMemo(() => {
        return jars.reduce((sum, jar) => sum + jar.current_amount, 0);
    }, [jars]);

    return {
        jars,
        totalAllocated,
        totalRemaining,
        name,
        setName,
        targetAmount,
        setTargetAmount,
        selectedMonth,
        setSelectedMonth,
        loading,
        MONTHS,
        showAddJarModal, setShowAddJarModal,
        showEditJarModal, setShowEditJarModal,
        editingJar, setEditingJar,
        handleCreateJar,
        handleDeleteJar,
        handleUpdateJar,
    };
}