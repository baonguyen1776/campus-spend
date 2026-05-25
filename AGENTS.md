# AGENTS.md – CampusSpend

> [!IMPORTANT]
> - Agent **BẮT BUỘC** phải tìm kiếm và đọc toàn bộ tài liệu hướng dẫn trong thư mục [docs/](file:///Users/nguyenphuonggiabao/Documents/Project%20file/campus-spend/docs/) trước khi thực hiện bất kỳ nhiệm vụ nào. Thư mục này chứa các tài liệu kỹ thuật, thiết kế cơ sở dữ liệu, và logic nghiệp vụ quan trọng đã được thống nhất cho dự án.
> - Việc đọc hiểu file [GUIDELINES.md](file:///Users/nguyenphuonggiabao/Documents/Project%20file/campus-spend/GUIDELINES.md) là **bắt buộc** đối với tất cả các agent tham gia vào dự án này.
> 
> *It is **MANDATORY** for all agents to search and read documents in the [docs/](file:///Users/nguyenphuonggiabao/Documents/Project%20file/campus-spend/docs/) directory before starting any task.*
> *Reading and understanding [GUIDELINES.md](file:///Users/nguyenphuonggiabao/Documents/Project%20file/campus-spend/GUIDELINES.md) is **mandatory** for all agents working on this project.*

---

## 1. Project Identity

**Project name:** CampusSpend  
**Project type:** Mobile application  
**Main idea:** A personal expense management app that helps users track income/expenses, divide money into spending jars, detect overspending, and support future AI-based budget suggestions.

This project is currently in the **planning + early setup phase**. Do not over-engineer. The first goal is to build a small but complete offline MVP.

---

## 2. Tech Direction

### Current MVP stack

- **Mobile app:** React Native
- **Tooling:** Expo
- **Language:** TypeScript
- **Local database:** SQLite
- **Backend:** Not required for MVP
- **Authentication:** Not required for MVP
- **AI:** Not required for MVP

### Future stack possibilities

- **Authentication:** Firebase Auth / Supabase Auth / custom backend with JWT
- **Cloud database:** Supabase PostgreSQL / Firebase Firestore / PostgreSQL / MySQL
- **Backend for AI:** Node.js Express / NestJS / FastAPI / Spring Boot
- **AI provider:** Gemini / OpenAI / other LLM provider

---

## 3. Product Problem

Users often spend beyond their planned budget because they do not track money logically. They may know their monthly income, but they do not clearly know:

- Where the money goes.
- Which category is overspending.
- Whether they are following the planned budget.
- How much remains in each spending jar.
- Whether they need to adjust their spending behavior.

CampusSpend should help users plan, track, compare, and receive warnings when their spending exceeds the planned amount.

---

## 4. Core Product Concept

CampusSpend has two core features:

### Feature 1: Expense and Income Tracking

Users can record normal financial transactions.

A transaction includes:

- Transaction name.
- Amount.
- Type: income or expense.
- Category.
- Payment/account method.
- Transaction date.
- Optional note.

Examples:

```text
Name: Buy eggs
Amount: 30000
Type: Expense
Category: Food
Account: Cash
Date: Today by default, editable
```

```text
Name: Salary
Amount: 10000000
Type: Income
Account: Bank transfer
Date: Today by default, editable
```

At the end of the month, the app should summarize:

- Total income.
- Total expense.
- Balance.
- Amount spent by category.
- Overspent categories or jars.

---

### Feature 2: Spending Jar Management

Users can divide their monthly income into planned jars.

Example:

```text
Monthly income: 10,000,000 VND

Jars:
- Rent: 2,500,000
- Food: 2,000,000
- Utilities: 500,000
- Shopping: 1,000,000
- Saving: 2,000,000
- Emergency/Reserve: 2,000,000
```

When a user records an expense, the expense can be assigned to a jar.

Example:

```text
Jar: Shopping
Planned amount: 1,000,000
Expense: 1,200,000
Overspent: 200,000
```

The app should warn the user when a jar is overspent. If a saving or reserve jar exists, the app may suggest covering the overspent amount from that jar, but the user must confirm before any money is moved.

---

## 5. Very Important Business Rules

Follow these rules strictly.

### Transaction rules

1. `amount` must always be a positive number.
2. `type` determines whether a transaction is income or expense.
3. If `type = expense`, an expense category is required.
4. If `type = income`, an income category or income source/account should be available.
5. `transaction_date` defaults to the current date, but the user can edit it.
6. Do not save a transaction if the amount is empty, invalid, zero, or negative.
7. Do not mix negative amounts with expense transactions. Expense should be represented by `type = expense`, not by negative amount.
8. Monthly balance is calculated as:

```text
monthlyBalance = totalIncome - totalExpense
```

### Jar rules

1. A jar represents a planned spending allocation for a month.
2. A jar has an allocated amount and a remaining/current amount.
3. Jar remaining amount is calculated as:

```text
jarRemaining = allocatedAmount - spentAmount
```

4. If an expense is assigned to a jar, the app must check whether the jar has enough remaining money.
5. If the expense exceeds the jar remaining amount, the app must warn the user.
6. If a saving/reserve jar exists, the app may suggest covering the overspent amount from that jar.
7. The app must not automatically transfer money between jars without user confirmation.
8. Any transfer between jars should be recorded for audit/history.

### AI rules for future features

1. AI must only suggest.
2. AI must not automatically create transactions, jars, or transfers without user confirmation.
3. AI budget suggestions should ask clarifying questions before recommending a plan.
4. The app should calculate numeric summaries before sending them to AI.
5. Do not send unnecessary raw personal data to AI if a summarized form is enough.

---

## 6. MVP Scope

Build MVP in phases.

### MVP Phase 1: Basic Income/Expense Tracking

Must include:

1. Add income/expense transaction.
2. View transaction list.
3. Edit transaction.
4. Delete transaction.
5. View monthly total income.
6. View monthly total expense.
7. View monthly balance.
8. Filter transactions by month.
9. Filter transactions by category.

Do not include yet:

- Login.
- Cloud sync.
- AI.
- OCR.
- Shared household/couple account.
- Complex charting.
- Backend.
- Push notifications.

---

### MVP Phase 2: Basic Jar Management

Must include:

1. Create monthly spending jars.
2. Assign expense transactions to jars.
3. Show remaining amount in each jar.
4. Warn when a jar is overspent.
5. Show basic jar summary.

---

### MVP Phase 3: Reserve/Saving Jar Logic

Must include:

1. Mark a jar as saving/reserve.
2. If another jar is overspent, suggest using reserve/saving jar.
3. User must confirm before transferring money.
4. Record jar transfer history.

---

## 7. Recommended Folder Structure

Use this as the initial direction. Adjust only when needed.

```text
campus-spend/
├── app/
│   ├── _layout.tsx
│   └── index.tsx
├── src/
│   ├── components/
│   ├── constants/
│   ├── database/
│   ├── features/
│   │   ├── transactions/
│   │   ├── categories/
│   │   ├── accounts/
│   │   ├── jars/
│   │   └── reports/
│   ├── services/
│   ├── types/
│   └── utils/
├── docs/
│   ├── system-analysis.md
│   ├── database-design.md
│   └── current-tasks.md
├── AGENTS.md
├── GUIDELINES.md
├── project_idea.md
└── README.md
```

---

## 8. Suggested Data Entities

### Transaction

Represents an income or expense record.

Fields:

```text
id
name
amount
type
category_id
account_id
jar_id
transaction_date
note
created_at
updated_at
```

### Category

Represents a category for income or expense.

Fields:

```text
id
name
type
created_at
updated_at
```

### Account

Represents a payment or money source method.

Fields:

```text
id
name
type
created_at
updated_at
```

Examples:

```text
Cash
Bank transfer
E-wallet
Card
```

### Jar

Represents a monthly budget/spending jar.

Fields:

```text
id
name
allocated_amount
current_amount
month
is_saving_jar
created_at
updated_at
```

### Jar Transfer

Represents a movement of money between jars.

Fields:

```text
id
from_jar_id
to_jar_id
amount
reason
created_at
```

---

## 9. ID Strategy

Use:

```text
id TEXT PRIMARY KEY
```

Prefer UUID-style string IDs because the app may later support login and cloud sync.

Do not rely only on `INTEGER AUTOINCREMENT` if the project is expected to sync across devices in the future.

Examples:

```text
tx_550e8400-e29b-41d4-a716-446655440000
cat_food
jar_food_2026_05
```

---

## 10. Current Development Priority

The current priority is **not AI, not login, not cloud**.

The current priority is:

1. Keep project documentation clear.
2. Set up Expo + TypeScript project.
3. Build static Home Dashboard UI.
4. Build Add Transaction screen with temporary state.
5. Define TypeScript types.
6. Add SQLite later.
7. Implement CRUD.
8. Implement monthly summary.
9. Implement basic jar management only after basic tracking works.

---

## 11. How the AI Agent Should Work

When generating code:

1. Do not generate the full app at once.
2. Work in small, testable steps.
3. Explain what files are being changed.
4. Keep the project simple.
5. Avoid premature backend/auth/AI code.
6. Do not add libraries unless there is a clear need.
7. Keep business logic separate from UI when reasonable.
8. Prefer readable code over clever code.
9. Follow TypeScript types consistently.
10. Preserve the MVP scope.

Recommended order:

```text
Step 1: Create project structure
Step 2: Define types
Step 3: Create static UI
Step 4: Add temporary state
Step 5: Add SQLite database layer
Step 6: Add CRUD
Step 7: Add summaries
Step 8: Add jar logic
```

---

## 12. Non-Goals for Now

Do not implement these in the initial MVP:

- Login.
- Couple/shared account.
- Cloud sync.
- AI budget advisor.
- AI transaction parsing.
- OCR receipt scanning.
- Push notifications.
- App Store deployment.
- Complex analytics for 2 years.
- Multi-currency support.
- Bank account integration.

These are future extensions only.

---

## 13. Future Extensions

Possible future features:

### Shared account for couples/families

- Users can create a household/group.
- Multiple users can add transactions.
- When one person adds a transaction, the other receives notification.
- Requires authentication, shared database, permissions, and notifications.

### AI budget advisor

Example user question:

```text
My monthly income is 10 million VND. How should I divide it?
```

AI should ask clarifying questions such as:

```text
Do you pay rent?
How much do you usually spend on food?
Do you have debt or tuition fees?
How much do you want to save?
What are your fixed monthly costs?
```

Then AI can suggest jars, but the user must confirm before creating them.

### Chart analytics

Possible reports:

- Income vs expense by month.
- Spending by category.
- Jar usage percentage.
- Month-to-month comparison.
- Trend for up to 24 months.

### Receipt OCR

User can take a photo of a receipt. The app extracts merchant, amount, date, and suggests a transaction. User must confirm before saving.

---

## 14. Development Philosophy

This project should be built with computational thinking:

1. **Decomposition:** Split app into transactions, categories, accounts, jars, reports.
2. **Pattern recognition:** Most reports follow filter → group → sum → compare.
3. **Abstraction:** Model real-life money events as typed entities.
4. **Algorithm design:** Create clear rules for balance, jar remaining, overspending, and transfers.

The goal is not to build many features quickly. The goal is to build a small, correct, understandable system.
