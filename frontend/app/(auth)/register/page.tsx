"use client";
import RegisterForm from "@/components/feature/Register/RegisterForm";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function RegisterPage() {

  const router = useRouter();
  const {isAuthenticated,loading:authLoading} = useAuthStore();
   
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
      <RegisterForm />
    </>
  );
}
