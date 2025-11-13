import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";      
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordFormSchema } from "./formSchema";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm({token}: {token: string}) {
    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuthStore();
    const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },   
    });

    useEffect(() => {
        setTimeout(() => {
            if(success) {
                router.push("/login");
            }
        }, 2000);
    }, [success, router]);

    const onSubmit = async (data: z.infer<typeof resetPasswordFormSchema>) => {
        setLoading(true);
        if (!token) {
            toast.error("Invalid reset token");
            return;
          }
          try {
            await resetPassword(token, data.newPassword, data.confirmPassword);
            setSuccess(true);
            toast.success("Password reset successfully!");
            setTimeout(() => {
              setSuccess(true);
              setLoading(false);
            }, 2000);
          } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to reset password";
            toast.error(message);
            form.setError("newPassword", { message });
          }
    };   
   
    if (success) {
        return (
          <div className="w-full max-w-sm">
            <Card>
              <CardHeader>
                <CardTitle>Password Reset Successful</CardTitle>
                <CardDescription>Your password has been reset successfully.</CardDescription>
              </CardHeader>
              <CardContent>
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
                    Redirecting to login...
                  </p>
                  <Button asChild>
                    <Link href="/login">Go to Login</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }
    
      return (
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>Enter your new password below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field data-invalid={!!form.formState.errors.newPassword}>
                    <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                    <Input
                      {...form.register("newPassword")}
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      className="bg-slate-100"
                      aria-invalid={!!form.formState.errors.newPassword}
                    />
                    {form.formState.errors.newPassword && (
                      <FieldError>{form.formState.errors.newPassword.message}</FieldError>
                    )}
                  </Field>
                  <Field data-invalid={!!form.formState.errors.confirmPassword}>
                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                    <Input
                      {...form.register("confirmPassword")}
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-slate-100"
                      aria-invalid={!!form.formState.errors.confirmPassword}
                    />
                    {form.formState.errors.confirmPassword && (
                      <FieldError>{form.formState.errors.confirmPassword.message}</FieldError>
                    )}
                  </Field>
                  <Button type="submit" className="w-full font-bold" disabled={loading}>
                    {loading ? <Spinner /> : "Reset Password"}
                  </Button>
                  <div className="text-center text-sm">
                    <Link href="/login" className="text-primary hover:text-primary/80 font-bold">
                      Back to Login
                    </Link>
                  </div>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      );
}   