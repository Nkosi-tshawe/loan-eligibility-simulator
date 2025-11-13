"use client"
import RadialProgress from "@/components/RadialProgress";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores";
import { useEligibilityStore } from "@/stores";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

// Inner component that uses the EligibilityContext
function EligibilityLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navigation } = useEligibilityStore();

  return (
    <div className="w-full xl:flex xl:max-w-[1024px] xl:gap-5 mx-auto bg-white xl:bg-transparent rounded-lg p-6 ">
      <div className="flex flex-col gap-4 mb-6 xl:mb-0 xl:bg-white xl:p-10 xl:rounded-lg h-fill">
        <div className="text-center">
          <h1 className="text-xl md:text-3xl font-extrabold text-primary">
            {navigation.currentPageTitle}
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            {navigation.currentPageDescription}
          </p>
        </div>
        <div className="w-full">
        <Progress value={navigation.progress} className="w-full block xl:hidden" />
      
          <p className="text-sm text-gray-500 text-center mt-2 xl:hidden">
            {navigation.progress}% Complete - You&apos;re doing great!
          </p>
        </div>
        <div className="w-full bg-gray-100 rounded-lg p-4 flex-1 flex items-center justify-center hidden xl:flex">
        <RadialProgress value={navigation.progress} valueColorClass="text-primary" label={`Complete`}  progressColor="success"/>
        </div>
      </div>
     <div className="md:flex-1 xl:bg-white xl:p-10 xl:rounded-lg h-fill">
     {children}
     </div>
    </div>
  );
}

export default function EligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuthStore();
  const router = useRouter(); 

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated) {
    return <></>;
  }

  return (
    <EligibilityLayoutContent>
      {children}
    </EligibilityLayoutContent>
  );
}
