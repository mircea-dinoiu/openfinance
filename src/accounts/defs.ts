export enum AccountStatus {
    OPEN = 'open',
    LOCKED = 'locked',
    CLOSED = 'closed',
}

export enum AccountType {
    CASH = 'cash',
    CREDIT = 'credit',
    LOAN = 'loan',
    BROKERAGE = 'brokerage',
    CHECKING = 'checking',
    SAVINGS = 'savings',
}

export type TAccount = {
    currency_id: number;
    id: number;
    name: string;
    status: AccountStatus;
    type: AccountType;
    owner_id: number | null;
    credit_limit: number | null;
    credit_apr: number | null;
    credit_minpay: number | null;
    credit_dueday: number | null;
};
export type Accounts = TAccount[];
