import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordFormSchema } from "./formSchema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useAuthStore } from "@/stores";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
    const { forgotPassword, loading } = useAuthStore();
    const [submitted, setSubmitted] = useState(false);
    
    const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: {
        email: "",
        },
    });


    const onSubmit = async (data: z.infer<typeof forgotPasswordFormSchema>) => {
        try {
        await forgotPassword(data.email);
        setSubmitted(true);
        toast.success("If an account exists with that email, a password reset link has been sent.");
        form.reset();
        } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to send password reset email";
        toast.error(message);
        form.setError("email", { message });
        } 
  };

  if(submitted) {
    return (
      <div className="w-full max-w-sm">
        <Card >
          <CardHeader>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We&apos;ve sent a password reset link to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                If an account exists with that email, you&apos;ll receive instructions to reset your password.
              </p>
              <Button asChild variant="outline" className="w-full text-primary hover:text-primary/80 font-bold">
                <Link href="/login">Back to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            <span>
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...form.register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-slate-100"
                  aria-invalid={!!form.formState.errors.email}
                />
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>
              <Button
                type="submit"
                className="w-full font-bold"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Send Reset Link"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-bold"
                >
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
