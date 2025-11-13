"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginFormSchema } from "./formSchema";
import { useAuthStore } from "@/stores";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl";
import Link from "next/link";


export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login, loading, user, resendVerificationEmail, isAuthenticated } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showUnverifiedMessage, setShowUnverifiedMessage] = useState(false);
  const t = useTranslations("loginPage");

  const onSubmit = async (data: z.infer<typeof loginFormSchema>, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowUnverifiedMessage(false);
    if (data.email && data.password) {
      try {
        await login(data.email, data.password);
        // Check if user email is verified after login - this will be checked via useEffect after user state updates
      } catch (error) {
        form.setError("email", { message: "" });
        form.setError("password", { message: "" });
        const errorMess = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
        setErrorMessage(errorMess);
        toast.error(errorMess);
        // Check if error is about unverified email
        if (errorMess.toLowerCase().includes('email') && errorMess.toLowerCase().includes('verify')) {
          setShowUnverifiedMessage(true);
        }
      } finally {
        setErrorMessage("");
      }
    }
  }

  // Check if user email is verified after successful login
  useEffect(() => {
    if (user && !user.emailVerified && isAuthenticated) {
      setShowUnverifiedMessage(true);
    }
  }, [user]);

  return (
    <div className="w-full max-w-sm">
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="login-form"
              onSubmit={(e) => form.handleSubmit((data) => onSubmit(data, e as React.FormEvent<HTMLFormElement>))(e)}
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        aria-invalid={fieldState.invalid}
                        className="bg-slate-100 "

                      />
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
                <Controller name="password" control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      className="bg-slate-100 "
                    />
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )} />
                {errorMessage && <FieldError>{errorMessage}</FieldError>}
                {showUnverifiedMessage && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800 mb-2">
                      Your email address has not been verified. Please check your email for the verification link.
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          await resendVerificationEmail(form.getValues("email"));
                          toast.success("Verification email resent!");
                        } catch (error) {
                          toast.error("Failed to resend verification email");
                        }
                      }}
                      className="text-sm text-yellow-800 hover:text-yellow-900 font-bold underline"
                    >
                      Resend verification email
                    </button>
                  </div>
                )}
                <Field>
                  <div className="text-right text-sm mb-2">
                    <Link href="/forgot-password" className="text-primary hover:text-primary/80 font-bold">
                      Forgot password?
                    </Link>
                  </div>
                  {loading ? <Button type="submit" form="login-form" className="font-bold" disabled>
                    <Spinner />
                    Submitting...</Button> : <Button type="submit" form="login-form" className="font-bold">{t("buttonText")}</Button>}
                  <FieldDescription className="text-center">
                    {t("registerLink")} <a href="/register" className="text-primary hover:text-primary/80 font-bold no-underline!">Sign up</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
