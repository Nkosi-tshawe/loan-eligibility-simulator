"use client";
import { EligibilityResult, PersonalDetails, FinancialDetails, LoanDetails } from '@/models';
import { LoanApiClient } from '@/services/LoanApiClient';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface EligibilityContextType {
    personDetails: PersonalDetails;
    financialDetails: FinancialDetails;
    loanDetails: LoanDetails;
    eligibilityResult: EligibilityResult;
    navigation: {currentPageTitle: string, currentPageDescription: string, progress: number},
    setNavigation: (navigation: {currentPageTitle: string, currentPageDescription: string, progress: number}) => void;
    setPersonDetails: (personDetails: PersonalDetails) => void;
    setFinancialDetails: (financialDetails: FinancialDetails) => void;
    setLoanDetails: (loanDetails: LoanDetails) => void;
    setEligibilityResult: (eligibilityResult: EligibilityResult) => void;
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
    annualIncome: 0,
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



// const calculateEligibility = async (personalDetails: PersonalDetails, financialDetails: FinancialDetails, loanDetails: LoanDetails) => {
//     const response = await fetch('/api/eligibility', {
//         method: 'POST',
//         body: JSON.stringify({ personalDetails, financialDetails, loanDetails }),
//     });
//     return response.json();
// };

export const EligibilityProvider: React.FC<EligibilityProviderProps> = ({ children }) => {
    const [personDetails, setPersonDetails] = useState<PersonalDetails>(initialPersonDetails);
    const [financialDetails, setFinancialDetails] = useState<FinancialDetails>(initialFinancialDetails);
    const [loanDetails, setLoanDetails] = useState<LoanDetails>(initialLoanDetails);
    const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult>(initialEligibilityResult);
    const [navigation, setNavigation] = useState<{currentPageTitle: string, currentPageDescription: string, progress: number}>({currentPageTitle: "", currentPageDescription: "", progress: 5});
    const loanApiClient = new LoanApiClient();
    const checkEligibility = async () => {
        try {
        const response = await loanApiClient.checkEligibility({
            personalDetails: personDetails,
            financialDetails: financialDetails,
            loanDetails: loanDetails
        });
            setEligibilityResult(response.eligibilityResult);
        } catch (error) {
            console.error('Error checking eligibility:', error);
        }
    }

   

    return <EligibilityContext.Provider
        value={{
            personDetails,
            financialDetails,
            loanDetails,
            navigation,
            eligibilityResult,
            setPersonDetails,
            setFinancialDetails,
            setLoanDetails,
            setEligibilityResult,
            setNavigation
        }}>
        {children}
    </EligibilityContext.Provider>;

}