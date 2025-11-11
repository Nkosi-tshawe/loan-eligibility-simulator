"use client";
import { PersonalDetails, FinancialDetails, LoanDetails, EligibilityResponse } from '@/models';
import { LoanApiClient } from '@/services/LoanApiClient';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface EligibilityContextType {
    isLoading: boolean;
    personDetails: PersonalDetails;
    financialDetails: FinancialDetails;
    loanDetails: LoanDetails;
    eligibilityResult: EligibilityResponse;
    navigation: {currentPageTitle: string, currentPageDescription: string, progress: number},
    setNavigation: (navigation: {currentPageTitle: string, currentPageDescription: string, progress: number}) => void;
    setPersonDetails: (personDetails: PersonalDetails) => Promise<void>;
    setFinancialDetails: (financialDetails: FinancialDetails) => Promise<void>;
    setLoanDetails: (loanDetails: LoanDetails) => Promise<void>;
    setEligibilityResult: (eligibilityResult: EligibilityResponse) => Promise<void>;
    checkEligibility: (overrideDetails?: { personalDetails?: PersonalDetails; financialDetails?: FinancialDetails; loanDetails?: LoanDetails }) => Promise<void>;
    reset: () => void;
    loaded: boolean;
}

export const EligibilityContext = createContext<EligibilityContextType | undefined>(undefined);


export const useEligibility = () => {
    const context = useContext(EligibilityContext);
    if (!context) {
        throw new Error('useEligibility must be used within an EligibilityProvider');
    }
    return context;
}

interface EligibilityProviderProps {
    children: ReactNode;
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
    recommendedLoan: {
        product: {
            id: '',
            name: '',
            type: 'secured',
            minAmount: 0,
            maxAmount: 0,
            minTermMonths: 0,
            maxTermMonths: 0,
            baseRate: 0,
            description: '',
        },
        amount: 0,
        termMonths: 0,
        interestRate: 0,
    },
    affordabilityAnalysis: {
        monthlyPayment: 0,
        debtToIncomeRatio: 0,
        availableIncome: 0,
        safetyMargin: 0,
    },
};


export const EligibilityProvider: React.FC<EligibilityProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false); // Used in checkEligibility
    const [personDetails, setPersonDetails] = useState<PersonalDetails>(initialPersonDetails);
    const [financialDetails, setFinancialDetails] = useState<FinancialDetails>(initialFinancialDetails);
    const [loanDetails, setLoanDetails] = useState<LoanDetails>(initialLoanDetails);
    const [eligibilityResult, setEligibilityResult] = useState<EligibilityResponse>(initialEligibilityResponse);
    const [navigation, setNavigation] = useState<{currentPageTitle: string, currentPageDescription: string, progress: number}>({currentPageTitle: "", currentPageDescription: "", progress: 5});
    const loanApiClient = new LoanApiClient();
    const [loaded, setLoaded] = useState(false);
    const checkEligibility = async (overrideDetails?: { personalDetails?: PersonalDetails; financialDetails?: FinancialDetails; loanDetails?: LoanDetails }) => {
        setIsLoading(true);
        try {
        const response: EligibilityResponse = await loanApiClient.checkEligibility({
            personalDetails: overrideDetails?.personalDetails ?? personDetails,
            financialDetails: overrideDetails?.financialDetails ?? financialDetails,
            loanDetails: overrideDetails?.loanDetails ?? loanDetails
        });
            setEligibilityResult(response);
            setIsLoading(false);
            setLoaded(true);
        } catch (error) {
            console.error('Error checking eligibility:', error);
            setIsLoading(false);
            throw error; // Re-throw so caller can handle it
        }
    }

    return <EligibilityContext.Provider
        value={{
            isLoading: false,
            loaded: false,
            personDetails,
            financialDetails,
            loanDetails,
            navigation,
            eligibilityResult,
            setPersonDetails: async (details: PersonalDetails) => { setPersonDetails(details); },
            setFinancialDetails: async (details: FinancialDetails) => { setFinancialDetails(details); },
            setLoanDetails: async (details: LoanDetails) => { setLoanDetails(details); },
            setEligibilityResult: async (result: EligibilityResponse) => { setEligibilityResult(result); },
            setNavigation,
            checkEligibility,
            reset: () => {
                setPersonDetails(initialPersonDetails);
                setFinancialDetails(initialFinancialDetails);
                setLoanDetails(initialLoanDetails);
                setEligibilityResult(initialEligibilityResponse);
                setNavigation({currentPageTitle: "", currentPageDescription: "", progress: 25});
                setLoaded(false);
            }
        }}>
        {children}
    </EligibilityContext.Provider>;

}