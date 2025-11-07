"use client";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { EligibilityProvider, useEligibility } from "@/context/EligibilityContext";

export function EligibilityResultsLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading } = useEligibility();

    if (isLoading) {
      return <div className="flex items-center justify-center h-screen"><Spinner /><span>Loading...</span></div>;
    }
    return (
      
         <div className="w-full xl:flex xl:max-w-[1024px] xl:gap-5 mx-auto">
            {children}
        </div>
     
    )
}

export default function EligibilityResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter(); 

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);


  return (
    <EligibilityProvider>
      <EligibilityResultsLayoutContent>
        {children}
      </EligibilityResultsLayoutContent>
    </EligibilityProvider>
  );
}