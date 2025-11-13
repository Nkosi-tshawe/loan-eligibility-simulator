"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ResetPasswordForm from "@/components/feature/reset-password/ResetPasswordForm";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
 
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      toast.error("Invalid reset token");
      router.push("/forgot-password");
    } else {
      setTimeout(() => {    
        setToken(tokenParam);
      }, 1000);
    }
  }, [searchParams, router]);


  return (
   <ResetPasswordForm token={token || ""} />
  );
}

