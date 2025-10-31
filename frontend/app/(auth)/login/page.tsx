"use client";
import LoginForm from "@/components/feature/Login/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
   
    if (isAuthenticated) {
        router.push('/');
    }

    if (authLoading) {
        return <div>Logging you in...</div>;
    }

    return (
        <>
           <LoginForm/>
        </>
    )
}