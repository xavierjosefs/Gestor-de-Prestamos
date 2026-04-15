export type PaymentFrequency = "MONTHLY" | "BIWEEKLY";

export interface CreateLoanPayload {
  clientId: string;
  principalAmount: number;
  interestRate: number;
  frequency: PaymentFrequency;
  startDate: string;
}

export interface CreateLoanResponse {
  message: string;
  data: {
    id: string;
    clientId: string;
    principalAmount: number;
    remainingBalance: number;
    interestRate: number;
    frequency: PaymentFrequency;
    startDate: string;
    nextDueDate: string;
    status: string;
  };
}
