"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail, loading } = useAuthStore();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setErrorMessage("Verification token is missing");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
        toast.success("Email verified successfully!");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error) {
        setStatus("error");
        const message = error instanceof Error ? error.message : "Failed to verify email";
        setErrorMessage(message);
        toast.error(message);
      }
    };

    verify();
  }, [searchParams, verifyEmail, router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {status === "verifying" && "Verifying your email address..."}
            {status === "success" && "Your email has been verified successfully!"}
            {status === "error" && "Email verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "verifying" && (
            <div className="flex flex-col items-center gap-4">
              <Spinner />
              <p className="text-sm text-muted-foreground">Please wait while we verify your email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Your email has been verified. Redirecting to login...
              </p>
              <Button asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-center text-sm text-red-600">{errorMessage}</p>
              <div className="flex flex-col gap-2 w-full">
                <Button asChild variant="outline">
                  <Link href="/login">Go to Login</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/register">Register Again</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

