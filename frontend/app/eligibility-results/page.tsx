import { BriefcaseIcon, CheckCircleIcon, ChevronDownIcon, DownloadIcon, UserCheckIcon, WalletIcon } from "lucide-react";

export default function EligibilityResultsPage() {
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-wrap justify-between gap-4 items-center">
                <p className="text-[#0d141b] dark:text-slate-50 text-xl lg:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Your Loan Eligibility Results</p>
            </div>
            <div className="p-4 @container w-full">
                <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-[var(--success)] bg-[var(--success)]/10  p-5 @[480px]:flex-row @[480px]:items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-success text-white rounded-full p-2">
                            <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[var(--success)]  text-lg font-bold leading-tight">Congratulations, you are approved!</p>
                            <p className="text-success-700 dark:text-success-200 text-sm font-normal leading-normal">Based on the information provided, you are eligible for the loan. Please review the details below.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white ">
                    <p className="text-slate-600 flex-1 dark:text-slate-400 text-sm font-medium leading-normal">Estimated Monthly Payment</p>
                    <p className="text-primary dark:text-slate-50 tracking-light text-3xl font-bold leading-tight">$1,250</p>
                </div>
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white ">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal">Debt-to-Income (DTI) Ratio</p>
                    <p className="text-primary dark:text-slate-50 tracking-light text-3xl font-bold leading-tight">35%</p>
                </div>
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white">
                    <p className="text-slate-600 flex-1 dark:text-slate-400 text-sm font-medium leading-normal">Available Income</p>
                    <p className="text-primary dark:text-slate-50 tracking-light text-3xl font-bold leading-tight">$4,500</p>
                </div>
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white">
                    <p className="text-slate-600 flex-1 dark:text-slate-400 text-sm font-medium leading-normal">Safety Margin</p>
                    <p className="text-primary dark:text-slate-50 tracking-light text-3xl font-bold leading-tight">$800</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                <div className="md:col-span-2 flex flex-col gap-4">
                    <h2 className="text-[#0d141b] dark:text-slate-50 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-0 pt-5">Decision Breakdown</h2>
                    <div className="flex flex-col gap-3">
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-4">
                            <details className="group">
                                <summary className="flex items-center justify-between cursor-pointer list-none">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[var(--success)]/10 text-[var(--success)] rounded-full p-1.5">
                                            <span className="material-symbols-outlined text-xl"><UserCheckIcon className="w-6 h-6" /></span>
                                        </div>
                                        <span className="font-semibold dark:text-slate-200">Credit Score</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-[var(--success)] font-medium">Excellent</span>
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
                                        <div className="bg-[var(--success)]/10 text-[var(--success)] rounded-full p-1.5">
                                            <span className="material-symbols-outlined text-xl"><BriefcaseIcon className="w-6 h-6" /></span>
                                        </div>
                                        <span className="font-semibold dark:text-slate-200">Income Verification</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-[var(--success)] font-medium">Verified</span>
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
                                        <div className="bg-[var(--success)]/10 text-[var(--success)] rounded-full p-1.5">
                                            <span className="material-symbols-outlined text-xl"><WalletIcon className="w-6 h-6" /></span>
                                        </div>
                                        <span className="font-semibold dark:text-slate-200">Debt Analysis</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-[var(--success)] font-medium">Healthy</span>
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
                        <div className="relative size-40">
                            <svg className="size-full" height="36" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg">
                                <circle className="stroke-current text-slate-200 dark:text-slate-700" cx="18" cy="18" fill="none" r="16" stroke-width="3"></circle>
                                <circle className="stroke-current text-[var(--success)]" cx="18" cy="18" fill="none" r="16" stroke-dasharray="100" stroke-dashoffset="65" stroke-linecap="round" stroke-width="3" transform="rotate(-90 18 18)"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-primary dark:text-slate-50">35%</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">DTI Ratio</span>
                            </div>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success dark:bg-success/20 dark:text-success-300">Low Risk</span>
                        <p className="text-center text-sm text-slate-600 dark:text-slate-400">Your financial profile is strong, placing you in the lowest risk category.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}