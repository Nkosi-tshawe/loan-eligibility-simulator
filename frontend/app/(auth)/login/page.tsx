"use client";
import LoginForm from "@/components/feature/Login/LoginForm";
import { useAuth } from "@/context/AuthContext";
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
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <div>Redirecting...</div>;
    }

    return (
        <>
           <LoginForm/>
        </>
    )
}