"use client";
import { useAuthStore } from "@/stores";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useEligibilityStore } from "@/stores";
import { Button } from "@/components/ui/button";

export function EligibilityResultsLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading,eligibilityResult } = useEligibilityStore();
    const router = useRouter();

    if (isLoading) {
      return <div className="flex items-center justify-center h-screen"><Spinner /><span>Loading...</span></div>;
    }
    if(eligibilityResult.eligibilityResult.reasons.length > 0) {
      return <div className="flex items-center justify-center h-screen">
        <span>You did not complete the eligibility process. Please go back and complete the process.</span>
        <Button onClick={() => router.push("/eligibility")}>Go Back</Button>
        </div>;
    }

    return (
        <div className="w-full xl:flex xl:max-w-[1024px] xl:gap-5 mx-auto">
            {children}
        </div>
    );
}

export default function EligibilityResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if(authLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner /><span>Loading...</span></div>;
  }

  if(!isAuthenticated) {
    return <></>;
  }

  return (
    <EligibilityResultsLayoutContent>
      {children}
    </EligibilityResultsLayoutContent>
  );
}