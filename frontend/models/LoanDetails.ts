export interface LoanDetails {
    requestedAmount: number;
    requestedTermMonths: number;
    purpose: 'home' | 'car' | 'personal' | 'education' | 'business';
  }