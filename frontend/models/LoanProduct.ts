export interface LoanProduct {
    id: string;
    name: string;
    type: 'secured' | 'unsecured';
    minAmount: number;
    maxAmount: number;
    minTermMonths: number;
    maxTermMonths: number;
    baseRate: number;
    description: string;
  }