export interface ClientBankAccountInput {
  bankName: string;
  accountType: string;
  accountNumber: string;
}

export interface CreateClientPayload {
  name: string;
  cedula: string;
  address: string;
  birthDate: string;
  email: string;
  phone: string;
  phone2?: string;
  credentials: {
    username: string;
    password: string;
  };
  bankAccounts: ClientBankAccountInput[];
  profileImage?: string;
}

export type UpdateClientPayload = CreateClientPayload;

export interface CreateClientResponse {
  message: string;
  data: {
    id: string;
    name: string;
    cedula: string;
    email: string;
    createdAt: string;
  };
}

export interface ClientBankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  createdAt?: string;
}

export interface ClientCredentials {
  id: string;
  username: string;
  password: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  cedula: string;
  address: string;
  birthDate: string;
  email: string;
  phone: string;
  phone2?: string | null;
  profileImage?: string | null;
  createdAt: string;
  bankAccounts: ClientBankAccount[];
  credentials?: ClientCredentials | null;
}

export interface GetClientsResponse {
  message: string;
  data: ClientRecord[];
}

export type LoanFrequency = "MONTHLY" | "BIWEEKLY";
export type LoanStatus = "ACTIVE" | "LATE" | "PAID";

export interface LoanPaymentRecord {
  id: string;
  amount: number;
  interestPaid: number;
  principalPaid: number;
  remainingBalance: number;
  daysCalculated: number;
  paymentDate: string;
  loanId: string;
}

export interface ClientLoanRecord {
  id: string;
  clientId: string;
  principalAmount: number;
  remainingBalance: number;
  interestRate: number;
  frequency: LoanFrequency;
  startDate: string;
  lastPaymentDate: string;
  nextDueDate: string;
  status: LoanStatus;
  createdAt: string;
  currentAccruedInterest: number;
  currentTotalDue: number;
  payments: LoanPaymentRecord[];
}
