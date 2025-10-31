import { LockIcon } from "lucide-react";
import LoanDetailsForm from "./form/LoanDetailsForm";

export default function LoanDetailsPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-4"> 
                <h2 className=" font-bold">Loan Details</h2>
                <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined mr-1"> <LockIcon className="w-4 h-4 " /> </span>
                   <small className="hidden md:block">Secure &amp; Private</small>
                </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
                Please provide information about your loan requirements.
            </p>
            <LoanDetailsForm />
        </div>
    );
}