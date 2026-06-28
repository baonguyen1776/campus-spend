# CampusSpend – Current Tasks

## Current Phase

Planning + early setup.

The project should not implement backend, login, cloud sync, or AI yet.

---

## Immediate Tasks

1. Confirm repo name: `campus-spend`.
2. Keep documentation files:
   - `AGENTS.md`
   - `docs/system-analysis.md`
   - `docs/database-design.md`
   - `docs/current-tasks.md`
3. Set up Expo app with TypeScript.
4. Confirm the app runs with Expo Go.
5. Create initial folder structure: (Completed)
   - `src/components`
   - `src/types`
   - `src/database`
   - `src/features/transactions`
   - `src/features/categories`
   - `src/features/accounts`
   - `src/features/jars`
   - `src/features/reports`
   - `src/services`
   - `src/utils`
6. Build static Home Dashboard UI. (Completed - Refactored to OOP SOLID Clean Architecture)
7. Build static Add Transaction screen. (Completed - Refactored to OOP SOLID Clean Architecture & Colocated in components subfolder)
8. Define TypeScript types: (Completed - Implemented Rich Domain classes Transaction & Jar, Interface mappings for IAccount, ICategory, IJar, ITransaction)
   - `Transaction`
   - `Category`
   - `Account`
   - `Jar`
   - `JarTransfer`
9. Use mock data first. (Completed - Implemented MockTransactionRepository)
10. Add SQLite only after the basic UI and types are clear. (Completed - Fully integrated SQLite with repositories and seeding)

---

## MVP Phase 1 Checklist ✅ 100% Complete

- [x] Add income transaction.
- [x] Add expense transaction.
- [x] View transaction list.
- [x] Create custom categories dynamically during transaction creation.
- [x] Edit transaction.
- [x] Delete transaction.
- [x] View monthly total income.
- [x] View monthly total expense.
- [x] View monthly balance.
- [x] Filter transactions by month.
- [x] Filter transactions by category.

---

## MVP Phase 2 Checklist (~95% Complete)

- [x] Create monthly spending jars. (JarScreen + JarFormModal + JarService.saveJar)
- [x] Edit and delete jars. (JarService.updateJarLimit, JarService.deleteJar — validates new limit >= spent)
- [x] Assign expense transaction to a jar. (UI in AddTransactionScreen + FinancialOrchestrator.saveTransaction)
- [x] Deduct jar amount when expense is saved. (JarService.deductAmount via FinancialOrchestrator)
- [x] Refund jar amount when expense is deleted or edited. (JarService.refundAmount via FinancialOrchestrator)
- [x] Warn when overspending a jar. (Alert.alert shown from useHomeViewModel catch block)
- [x] Show remaining amount of each jar. (JarScreen card shows current_amount and progress bar)
- [x] Show jar dashboard. (JarScreen with totalAllocated / totalRemaining summary)
- [x] **BUG FIX:** Filter jar list in AddTransactionScreen by current selected month.
  - Fixed: `SELECT id, name, current_amount FROM jars WHERE month = ?` using `new Date().toISOString().slice(0, 7)`.

---

## MVP Phase 3 Checklist (Not Started)

- [ ] Mark one jar as saving/reserve.
  - `is_saving_jar` toggle already exists in JarFormModal UI ✅
  - Need: logic to identify and prioritize reserve jars in Orchestrator.
- [ ] Detect overspending and suggest covering from saving/reserve jar.
  - In `FinancialOrchestrator.saveTransaction`: if deductAmount fails (overspent), check if a reserve jar exists and prompt user.
- [ ] Require user confirmation before transferring between jars.
  - Show Alert with confirm/cancel before executing transfer.
- [ ] Execute jar-to-jar transfer and update both jar balances.
- [ ] Record jar transfer history.
  - Needs: `jar_transfers` table in SQLite DB + `JarTransfer` domain entity + `SQLiteJarTransferRepository`.
