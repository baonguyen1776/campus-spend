# CampusSpend – Database Design Draft

## 1. Design Goals

The database should support:

- Income and expense transactions.
- Expense categories.
- Income categories or sources.
- Payment/account methods.
- Monthly spending jars.
- Overspending detection.
- Transfer between jars.
- Future cloud sync.

Use SQLite for MVP.

---

## 2. ID Policy

Use:

```sql
id TEXT PRIMARY KEY
```

Reason:

- Easier future sync.
- Less risk of ID conflict across devices.
- More flexible than local-only integer IDs.

Recommended ID style:

```text
UUID
tx_<uuid>
cat_food
acc_cash
jar_food_2026_05
```

---

## 3. Tables

## 3.1 transactions

```sql
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category_id TEXT,
  account_id TEXT,
  jar_id TEXT,
  transaction_date TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  FOREIGN KEY (jar_id) REFERENCES jars(id)
);
```

Important rules:

- `amount` must be positive.
- `type` decides income or expense.
- Do not store expenses as negative numbers.

---

## 3.2 categories

```sql
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

Examples:

```text
cat_food | Food | expense
cat_transport | Transportation | expense
cat_salary | Salary | income
```

---

## 3.3 accounts

```sql
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

Examples:

```text
acc_cash | Cash | cash
acc_bank | Bank Transfer | bank
acc_ewallet | E-wallet | ewallet
```

---

## 3.4 jars

```sql
CREATE TABLE IF NOT EXISTS jars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  allocated_amount REAL NOT NULL,
  current_amount REAL NOT NULL,
  month TEXT NOT NULL,
  is_saving_jar INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

Notes:

- `month` uses format `YYYY-MM`.
- `is_saving_jar` uses 0/1.
- `current_amount` starts equal to `allocated_amount`.

---

## 3.5 jar_transfers

```sql
CREATE TABLE IF NOT EXISTS jar_transfers (
  id TEXT PRIMARY KEY,
  from_jar_id TEXT NOT NULL,
  to_jar_id TEXT NOT NULL,
  amount REAL NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (from_jar_id) REFERENCES jars(id),
  FOREIGN KEY (to_jar_id) REFERENCES jars(id)
);
```

Used for:

- Covering overspending from a saving/reserve jar.
- Recording movement between jars.

---

## 4. Default Seed Data Ideas

Default expense categories:

```text
Food
Transportation
Shopping
Education
Entertainment
Rent
Utilities
Health
Other
```

Default income categories:

```text
Salary
Family support
Scholarship
Freelance
Other
```

Default accounts:

```text
Cash
Bank Transfer
E-wallet
Card
```

Default jar suggestions:

```text
Rent
Food
Transportation
Utilities
Shopping
Saving
Emergency
Other
```

---

## 5. Important Query Ideas

### Monthly total income

```sql
SELECT COALESCE(SUM(amount), 0) AS total_income
FROM transactions
WHERE type = 'income'
  AND substr(transaction_date, 1, 7) = ?;
```

### Monthly total expense

```sql
SELECT COALESCE(SUM(amount), 0) AS total_expense
FROM transactions
WHERE type = 'expense'
  AND substr(transaction_date, 1, 7) = ?;
```

### Expense by category

```sql
SELECT category_id, COALESCE(SUM(amount), 0) AS total
FROM transactions
WHERE type = 'expense'
  AND substr(transaction_date, 1, 7) = ?
GROUP BY category_id
ORDER BY total DESC;
```

### Jar summary

```sql
SELECT id, name, allocated_amount, current_amount, month, is_saving_jar
FROM jars
WHERE month = ?;
```

---

## 6. Open Questions

These should be decided later:

1. Should `current_amount` be stored directly, or calculated from transactions every time?
2. Should income transactions be assigned to jars automatically?
3. Should the app allow expenses without jars?
4. Should one expense be split across multiple jars?
5. Should a jar belong to a user/group when login is added?

For MVP, keep it simple:

- Store `current_amount`.
- Allow expenses without jars in Phase 1.
- Require jars only in Jar Management phase.
- Do not split one expense across multiple jars yet.
