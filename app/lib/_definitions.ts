export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
};

export type Allowance = {
    id: string;
    name: string;
    image_url: string;
    email: string;
    amount: string;
};

export type AllowanceTable = {
    id: string;
    name: string;
    image_url: string;
    email: string;
    amount: string;
};

export type UserLatestClaim = {
    id: string;
    name: string;
    image_url: string;
    email: string;
    amount: string;
};

export type UserRecentClaimRecordsTable = {
    id: string;
    customer_id: string;
    name: string;
    email: string;
    image_url: string;
    date: string;
    amount: number;
    status: 'pending' | 'paid';
};