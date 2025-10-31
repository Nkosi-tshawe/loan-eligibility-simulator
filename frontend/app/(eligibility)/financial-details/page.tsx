"use client";
import { LockIcon } from "lucide-react";
import FinancialDetailsForm from "./form/FInancialDetailsForm";
import { useContext } from "react";
import { NavigationContext } from "../layout";
import React from "react";

export default function FinancialDetailsPage() {
    const { setNavigation } = useContext(NavigationContext);

    React.useEffect(() => {
        setNavigation({currentPageTitle: "Financial Details", currentPageDescription: "Complete all steps to unlock your loan eligibility!", progress: 50});
    }, [setNavigation]);
    return (
        <div>
            <div className="flex items-center justify-between mb-4"> 
                <h2 className=" font-bold">Financial Details</h2>
                <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined mr-1"> <LockIcon className="w-4 h-4 " /> </span>
                   <small className="hidden md:block">Secure &amp; Private</small>
                </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
                Please provide your financial information.
            </p>
            <FinancialDetailsForm />
        </div>
    );
}