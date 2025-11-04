"use client";
import RegisterForm from "@/components/feature/Register/RegisterForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function RegisterPage() {

  const router = useRouter();
  const {isAuthenticated,loading:authLoading} = useAuth();
   
  useEffect(() => {
      if (isAuthenticated && !authLoading) {
          router.push('/');
      }
  }, [isAuthenticated, authLoading, router]);
  
  return (
    <>
      <RegisterForm />
    </>
  );
}
