export default function RadialProgress({ value, progressColor, valueColorClass, label }: { value: number, progressColor?: 'success' | 'warning' | 'danger', valueColorClass?: string, label?: string }) {
    const progressColorClass = progressColor === 'success' ? 'text-[var(--success)]' : progressColor === 'warning' ? 'text-[var(--warning)]' : 'text-[var(--danger)]';
    const colorClass = valueColorClass ? valueColorClass : 'text-primary';
    return (
        <div className="relative size-40">
            <svg className="size-full" height="36" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg">
                <circle className="stroke-current text-slate-200 dark:text-slate-700" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                <circle className={`stroke-current ${progressColorClass}`} cx="18" cy="18" fill="none" r="16" strokeDasharray="100" strokeDashoffset={`${100 - value}`} strokeLinecap="round" strokeWidth="3" transform="rotate(-90 18 18)"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${colorClass}`}>{value}%</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
            </div>
        </div>
    )
}   