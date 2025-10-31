export default function EligibilityResultsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full xl:flex xl:max-w-[1024px] xl:gap-5 mx-auto">
            {children}
        </div>
    )
}