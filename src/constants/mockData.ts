// src/constants/mockData.ts
import { ICategory, IAccount, IJar, ITransaction } from '../types';

// 1. Dữ liệu Danh mục mẫu (Categories)
export const MOCK_CATEGORIES: ICategory[] = [
    {
        id: 'cat_food',
        name: 'Ăn uống',
        type: 'expense',
        created_at: new Date('2026-05-01T00:00:00Z'),
        updated_at: new Date('2026-05-01T00:00:00Z'),
    },
    {
        id: 'cat_shopping',
        name: 'Mua sắm',
        type: 'expense',
        created_at: new Date('2026-05-01T00:00:00Z'),
        updated_at: new Date('2026-05-01T00:00:00Z'),
    },
    {
        id: 'cat_salary',
        name: 'Tiền lương',
        type: 'income',
        created_at: new Date('2026-05-01T00:00:00Z'),
        updated_at: new Date('2026-05-01T00:00:00Z'),
    }
];

// 2. Dữ liệu Tài khoản/Phương thức thanh toán mẫu (Accounts)
export const MOCK_ACCOUNTS: IAccount[] = [
    {
        id: 'acc_cash',
        name: 'Tiền mặt',
        type: 'cash',
        created_at: new Date('2026-05-01T00:00:00Z'),
        updated_at: new Date('2026-05-01T00:00:00Z'),
    },
    {
        id: 'acc_momo',
        name: 'Ví Momo',
        type: 'e-wallet',
        created_at: new Date('2026-05-01T00:00:00Z'),
        updated_at: new Date('2026-05-01T00:00:00Z'),
    }
];

// 3. Dữ liệu Hũ chi tiêu (Jars) - Tháng 5/2026
export const MOCK_JARS: IJar[] = [
    {
        id: 'jar1',
        name: 'Chi tiêu cá nhân',
        allocated_amount: 2500000,
        current_amount: 2500000,
        is_saving_jar: false,
        month: '2026-05',
        created_at: new Date('2026-05-01T00:00:00Z'),
        updated_at: new Date('2026-05-01T00:00:00Z'),
    },
    {
        id: 'jar2',
        name: 'Tiết kiệm',
        allocated_amount: 1000000,
        current_amount: 500000,
        is_saving_jar: true,
        month: '2026-05',
        created_at: new Date('2026-05-01T00:00:00Z'),
        updated_at: new Date('2026-05-01T00:00:00Z'),
    }
];

// 4. Dữ liệu Giao dịch mẫu (Transactions)
export const MOCK_TRANSACTIONS: ITransaction[] = [
    {
        id: 'trans_001',
        name: 'Mua giáo trình',
        amount: 100000,
        type: 'expense',
        category_id: 'cat_food',
        account_id: 'acc_cash',
        jar_id: 'jar1',
        note: 'Mua sách cho môn học',
        transaction_date: new Date('2026-05-01T00:00:00Z'),
        created_at: new Date('2026-05-01T00:00:00Z'),
        updated_at: new Date('2026-05-01T00:00:00Z'),
    },
    {
        id: 'trans_002',
        name: 'Mua trà sữa',
        amount: 50000,
        type: 'expense',
        category_id: 'cat_food',
        account_id: 'acc_momo',
        jar_id: 'jar1',
        note: 'Mua trà sữa cho buổi học chiều',
        transaction_date: new Date('2026-05-05T00:00:00Z'),
        created_at: new Date('2026-05-05T00:00:00Z'),
        updated_at: new Date('2026-05-05T00:00:00Z'),
    }
];