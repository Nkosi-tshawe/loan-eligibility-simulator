"use client"
import { Progress } from "@/components/ui/progress";
import React from "react";

export default function EligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [progress, setProgress] = React.useState(0)
    React.useEffect(() => {
      const timer = setTimeout(() => setProgress(5), 500)
      return () => clearTimeout(timer)
    }, [])
    
  return (
    <div className="w-full xl:flex xl:max-w-[1024px] xl:gap-5 mx-auto bg-white xl:bg-transparent rounded-lg p-6 ">
      <div className="flex flex-col gap-4 mb-6 xl:mb-0 xl:bg-white xl:p-10 xl:rounded-lg h-fill">
        <div className="text-center">
          <h1 className="text-xl md:text-3xl font-extrabold text-primary">
            Personal details
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Complete all steps to unlock your loan eligibility!
          </p>
        </div>
        <div className="w-full max-w-sm">
        <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 text-center mt-2">
            {progress}% Complete - You&apos;re doing great!
          </p>
        </div>
        <div className="w-full bg-gray-100 rounded-lg p-4 flex-1">

        </div>
      </div>
     <div className="md:flex-1 xl:bg-white xl:p-10 xl:rounded-lg h-fill">
     {children}
     </div>
    </div>
  );
}
