"use client";
import LoginForm from "@/components/feature/Login/LoginForm";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
   
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            router.push('/');
        }
    }, [isAuthenticated, authLoading, router]);

    if (authLoading) {
        return <div className="flex items-center justify-center h-screen"><Spinner /><span>Loading...</span></div>;
      }

    return (
        <>
           <LoginForm/>
        </>
    )
}