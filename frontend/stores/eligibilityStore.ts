import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PersonalDetails, FinancialDetails, LoanDetails, EligibilityResponse } from '@/models';
import { LoanApiClient } from '@/services/LoanApiClient';

interface NavigationState {
  currentPageTitle: string;
  currentPageDescription: string;
  progress: number;
}

interface EligibilityState {
  // State
  isLoading: boolean;
  personDetails: PersonalDetails;
  financialDetails: FinancialDetails;
  loanDetails: LoanDetails;
  eligibilityResult: EligibilityResponse;
  navigation: NavigationState;
  loaded: boolean;

  // Actions
  setPersonDetails: (personDetails: PersonalDetails) => Promise<void>;
  setFinancialDetails: (financialDetails: FinancialDetails) => Promise<void>;
  setLoanDetails: (loanDetails: LoanDetails) => Promise<void>;
  setEligibilityResult: (eligibilityResult: EligibilityResponse) => Promise<void>;
  setNavigation: (navigation: NavigationState) => void;
  checkEligibility: (overrideDetails?: {
    personalDetails?: PersonalDetails;
    financialDetails?: FinancialDetails;
    loanDetails?: LoanDetails;
  }) => Promise<void>;
  reset: () => void;
}

const initialPersonDetails: PersonalDetails = {
  age: 0,
  employmentStatus: 'employed',
  yearsInCurrentRole: 0,
};

const initialFinancialDetails: FinancialDetails = {
  monthlyIncome: 0,
  monthlyExpenses: 0,
  existingLoans: 0,
  creditScore: 0,
};

const initialLoanDetails: LoanDetails = {
  requestedAmount: 0,
  requestedTermMonths: 0,
  purpose: 'personal',
};

const initialEligibilityResponse: EligibilityResponse = {
  eligibilityResult: {
    eligible: false,
    maxLoanAmount: 0,
    recommendedTermMonths: 0,
    riskCategory: 'low',
    reasons: [],
  },
  recommendedLoan: null,
  affordabilityAnalysis: {
    monthlyPayment: 0,
    debtToIncomeRatio: 0,
    availableIncome: 0,
    safetyMargin: 0,
  },
};

const initialNavigation: NavigationState = {
  currentPageTitle: '',
  currentPageDescription: '',
  progress: 5,
};

export const useEligibilityStore = create<EligibilityState>()(
  devtools(
    (set, get) => {
  const loanApiClient = new LoanApiClient();

  return {
    // Initial state
    isLoading: false,
    personDetails: initialPersonDetails,
    financialDetails: initialFinancialDetails,
    loanDetails: initialLoanDetails,
    eligibilityResult: initialEligibilityResponse,
    navigation: initialNavigation,
    loaded: false,

    // Actions
    setPersonDetails: async (personDetails: PersonalDetails) => {
      set({ personDetails });
    },

    setFinancialDetails: async (financialDetails: FinancialDetails) => {
      set({ financialDetails });
    },

    setLoanDetails: async (loanDetails: LoanDetails) => {
      set({ loanDetails });
    },

    setEligibilityResult: async (eligibilityResult: EligibilityResponse) => {
      set({ eligibilityResult });
    },

    setNavigation: (navigation: NavigationState) => {
      set({ navigation });
    },

    checkEligibility: async (overrideDetails?: {
      personalDetails?: PersonalDetails;
      financialDetails?: FinancialDetails;
      loanDetails?: LoanDetails;
    }) => {
      set({ isLoading: true });
      try {
        const { personDetails, financialDetails, loanDetails } = get();
        const response: EligibilityResponse = await loanApiClient.checkEligibility({
          personalDetails: overrideDetails?.personalDetails ?? personDetails,
          financialDetails: overrideDetails?.financialDetails ?? financialDetails,
          loanDetails: overrideDetails?.loanDetails ?? loanDetails,
        });
        set({
          eligibilityResult: response,
          isLoading: false,
          loaded: true,
        });
      } catch (error) {
        console.error('Error checking eligibility:', error);
        set({ isLoading: false });
        throw error; // Re-throw so caller can handle it
      }
    },

    reset: () => {
      set({
        personDetails: initialPersonDetails,
        financialDetails: initialFinancialDetails,
        loanDetails: initialLoanDetails,
        eligibilityResult: initialEligibilityResponse,
        navigation: {
          currentPageTitle: '',
          currentPageDescription: '',
          progress: 25,
        },
        loaded: false,
      });
    },
  };
    },
    { name: 'EligibilityStore' }
  )
);

