"use client";
import RadialProgress from "@/components/RadialProgress";
import { useEligibilityStore } from "@/stores";
import { BriefcaseIcon, CheckCircleIcon, ChevronDownIcon, DownloadIcon, UserCheckIcon, WalletIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EligibilityResultsPage() {
    const t = useTranslations("eligibilityResultPage");
    const { eligibilityResult } = useEligibilityStore();
    const isEligible = eligibilityResult.eligibilityResult.eligible;
    const title = isEligible ? t("eligiblility.egigible.title") : t("eligiblility.notEligible.title");
    const description = isEligible ? t("eligiblility.egigible.description") : t("eligiblility.notEligible.description");
    const colorClass = isEligible ? "text-[var(--success)]" : "text-[var(--warning)]";
    const bgColorClass = isEligible ? "bg-[var(--success)]/10" : "bg-[var(--warning)]/10";
    const borderColorClass = isEligible ? "border-[var(--success)]" : "border-[var(--warning)]";
    const iconClass = isEligible ? "text-[var(--success)]" : "text-[var(--warning)]";
    const textColorClass = isEligible ? "text-success-700 dark:text-success-200" : "text-danger-700 dark:text-warning-200";

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-wrap justify-between gap-4 items-center">
                <p className="text-[#0d141b] dark:text-slate-50 text-xl lg:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Your Loan Eligibility Results</p>
            </div>
            {/** Eligibility Header */}
            <div className="p-4 @container w-full">
                <div className={`flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border ${borderColorClass} ${bgColorClass} p-5 @[480px]:flex-row @[480px]:items-center`}>
                    <div className="flex items-center gap-4">
                        <div className="bg-success text-white rounded-full p-2">
                            <CheckCircleIcon className={`w-6 h-6 ${iconClass}`} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className={`${colorClass} text-lg font-bold leading-tight`}>{title}</p>
                            <p className={`${textColorClass} text-sm font-normal leading-normal`}>{description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/** Affordability Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white ">
                    <p className="text-slate-600 flex-1 dark:text-slate-400 text-sm font-medium leading-normal">Estimated Monthly Payment</p>
                    <p className="text-primary dark:text-slate-50 tracking-light text-3xl font-bold leading-tight">R1,250</p>
                </div>
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white ">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal">Debt-to-Income (DTI) Ratio</p>
                    <p className="text-primary dark:text-slate-50 tracking-light text-3xl font-bold leading-tight">35%</p>
                </div>
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white">
                    <p className="text-slate-600 flex-1 dark:text-slate-400 text-sm font-medium leading-normal">Available Income</p>
                    <p className="text-primary dark:text-slate-50 tracking-light text-3xl font-bold leading-tight">R4,500</p>
                </div>
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white">
                    <p className="text-slate-600 flex-1 dark:text-slate-400 text-sm font-medium leading-normal">Safety Margin</p>
                    <p className="text-primary dark:text-slate-50 tracking-light text-3xl font-bold leading-tight">R800</p>
                </div>
            </div>

            {/** Decision Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                <div className="md:col-span-2 flex flex-col gap-4">
                    <h2 className="text-[#0d141b] dark:text-slate-50 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-0 pt-5">Decision Breakdown</h2>
                    <div className="flex flex-col gap-3">
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-4">
                            <details className="group">
                                <summary className="flex items-center justify-between cursor-pointer list-none">
                                    <div className="flex items-center gap-3">
                                        <div className={`${bgColorClass} ${colorClass} rounded-full p-1.5`}>
                                            <span className="material-symbols-outlined text-xl"><UserCheckIcon className="w-6 h-6" /></span>
                                        </div>
                                        <span className="font-semibold dark:text-slate-200">Credit Score</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm ${colorClass} font-medium`}>Excellent</span>
                                        {/* <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180"><ChevronDownIcon className="w-6 h-6" /></span> */}
                                    </div>
                                </summary>
                                <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 pl-10">Summary of your credit score</div>
                            </details>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark p-4">
                            <details className="group">
                                <summary className="flex items-center justify-between cursor-pointer list-none">
                                    <div className="flex items-center gap-3">
                                        <div className={`${bgColorClass} ${colorClass} rounded-full p-1.5`}>
                                            <span className="material-symbols-outlined text-xl"><BriefcaseIcon className="w-6 h-6" /></span>
                                        </div>
                                        <span className="font-semibold dark:text-slate-200">Income Verification</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm ${colorClass} font-medium`}>Verified</span>
                                        {/* <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180"><ChevronDownIcon className="w-6 h-6" /></span> */}
                                    </div>
                                </summary>
                                <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 pl-10">Summary of your income verification</div>
                            </details>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark p-4">
                            <details className="group">
                                <summary className="flex items-center justify-between cursor-pointer list-none">
                                    <div className="flex items-center gap-3">
                                        <div className={`${bgColorClass} ${colorClass} rounded-full p-1.5`}>
                                            <span className="material-symbols-outlined text-xl"><WalletIcon className="w-6 h-6" /></span>
                                        </div>
                                        <span className="font-semibold dark:text-slate-200">Debt Analysis</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm ${colorClass} font-medium`}>Healthy</span>
                                        {/* <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span> */}
                                    </div>
                                </summary>
                                <div className="mt-4 text-sm text-slate-600 flex-1 dark:text-slate-400 pl-10">Summary of your debt analysis</div>
                            </details>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-[#0d141b] dark:text-slate-50 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-0 pt-5">Risk Assessment</h2>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark p-6 flex flex-col items-center justify-center gap-4">
                           <RadialProgress value={35} valueColorClass="text-primary" label={`DIT Ratio`}  progressColor="success"/>
                        <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success dark:bg-success/20 dark:text-success-300">Low Risk</span>
                        <p className="text-center text-sm text-slate-600 dark:text-slate-400">Your financial profile is strong, placing you in the lowest risk category.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}