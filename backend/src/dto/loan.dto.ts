import { LoanStatus, PaymentFrequency } from "@prisma/client";

export interface CreateLoanDto {
  clientId: string;
  principalAmount: number;
  interestRate: number;
  frequency: PaymentFrequency;
  startDate: string;
}

export interface RegisterLoanPaymentDto {
  loanId: string;
  amount: number;
  paymentDate?: string;
}

export interface GetLoansDto {
  clientId?: string;
  status?: LoanStatus;
}
