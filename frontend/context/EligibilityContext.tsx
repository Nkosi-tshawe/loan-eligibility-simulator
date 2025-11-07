"use client";
import { EligibilityResult, PersonalDetails, FinancialDetails, LoanDetails } from '@/models';
import { LoanApiClient } from '@/services/LoanApiClient';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface EligibilityContextType {
    isLoading: boolean;
    personDetails: PersonalDetails;
    financialDetails: FinancialDetails;
    loanDetails: LoanDetails;
    eligibilityResult: EligibilityResult;
    navigation: {currentPageTitle: string, currentPageDescription: string, progress: number},
    setNavigation: (navigation: {currentPageTitle: string, currentPageDescription: string, progress: number}) => void;
    setPersonDetails: (personDetails: PersonalDetails) => Promise<void>;
    setFinancialDetails: (financialDetails: FinancialDetails) => Promise<void>;
    setLoanDetails: (loanDetails: LoanDetails) => Promise<void>;
    setEligibilityResult: (eligibilityResult: EligibilityResult) => Promise<void>;
    checkEligibility: () => Promise<void>;
    reset: () => void;
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
const initialEligibilityResult: EligibilityResult = {
    eligible: false,
    maxLoanAmount: 0,
    recommendedTermMonths: 0,
    riskCategory: 'low',
    reasons: [],
};

export const EligibilityProvider: React.FC<EligibilityProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [personDetails, setPersonDetails] = useState<PersonalDetails>(initialPersonDetails);
    const [financialDetails, setFinancialDetails] = useState<FinancialDetails>(initialFinancialDetails);
    const [loanDetails, setLoanDetails] = useState<LoanDetails>(initialLoanDetails);
    const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult>(initialEligibilityResult);
    const [navigation, setNavigation] = useState<{currentPageTitle: string, currentPageDescription: string, progress: number}>({currentPageTitle: "", currentPageDescription: "", progress: 5});
    const loanApiClient = new LoanApiClient();

    const checkEligibility = async () => {
        setIsLoading(true);
        try {
        const response = await loanApiClient.checkEligibility({
            personalDetails: personDetails,
            financialDetails: financialDetails,
            loanDetails: loanDetails
        });
            setEligibilityResult(response.eligibilityResult);
            setIsLoading(false);
        } catch (error) {
            console.error('Error checking eligibility:', error);
            setIsLoading(false);
        }
    }

    return <EligibilityContext.Provider
        value={{
            isLoading: false,
            personDetails,
            financialDetails,
            loanDetails,
            navigation,
            eligibilityResult,
            setPersonDetails: async (personDetails: PersonalDetails) => { setPersonDetails(personDetails); },
            setFinancialDetails: async (financialDetails: FinancialDetails) => { setFinancialDetails(financialDetails); },
            setLoanDetails: async (loanDetails: LoanDetails) => { setLoanDetails(loanDetails); },
            setEligibilityResult: async (eligibilityResult: EligibilityResult) => { setEligibilityResult(eligibilityResult); },
            setNavigation,
            checkEligibility,
            reset: () => {
                setPersonDetails(initialPersonDetails);
                setFinancialDetails(initialFinancialDetails);
                setLoanDetails(initialLoanDetails);
                setEligibilityResult(initialEligibilityResult);
                setNavigation({currentPageTitle: "", currentPageDescription: "", progress: 25});
            }
        }}>
        {children}
    </EligibilityContext.Provider>;

}