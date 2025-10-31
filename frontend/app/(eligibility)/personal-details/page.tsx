import PersonalDetailsForm from "./form/PersonDetailsForm";
import { LockIcon } from "lucide-react";

export default function PersonalDetailsPage() {
    return (
        <>
            <div className="flex items-center justify-between mb-4"> 
                <h2 className=" font-bold">Personal Details</h2>
                <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined mr-1"> <LockIcon className="w-4 h-4 " /> </span>
                   <small className="hidden md:block">Secure &amp; Private</small>
                </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
                Please provide your basic personal information.
            </p>
            <PersonalDetailsForm />
        </>
    );
}