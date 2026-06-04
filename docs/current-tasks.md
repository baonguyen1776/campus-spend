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

## MVP Phase 1 Checklist

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

## MVP Phase 2 Checklist

- [ ] Create monthly spending jars.
- [ ] Assign expense to a jar.
- [ ] Show remaining amount of each jar.
- [ ] Warn when overspending a jar.
- [ ] Show jar dashboard.

---

## MVP Phase 3 Checklist

- [ ] Mark one jar as saving/reserve.
- [ ] Suggest covering overspending from saving/reserve jar.
- [ ] Require user confirmation.
- [ ] Record jar transfer.
