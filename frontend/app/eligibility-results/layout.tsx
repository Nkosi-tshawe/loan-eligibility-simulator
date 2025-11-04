"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

if (authLoading) {
  return <div>Authenticating....</div>;
}

if (!isAuthenticated) {
  return null;
}
    return (
        <div className="w-full xl:flex xl:max-w-[1024px] xl:gap-5 mx-auto">
            {children}
        </div>
    )
}