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
import { registerFormSchema } from "./formSchema";
import { useAuthStore } from "@/stores";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { register, loading, resendVerificationEmail, registrationSuccess, isEmailVerified, registeredEmail } = useAuthStore();
  const t = useTranslations("registerPage");
  const onSubmit = async (data: z.infer<typeof registerFormSchema>, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (data.email && data.password && data.firstName && data.lastName) {
      try {
        await register(data.email, data.email, data.password, data.firstName, data.lastName);

        toast.success("Registration successful! Please check your email to verify your account.");
      } catch (error: unknown) {
        let errorMessage = 'Registration failed';
        if (error instanceof Error) {
          errorMessage = error.message;
          if (errorMessage === 'Username or email already exists') {
            form.setError("email", { type: "manual", message: "Email already exists" });
          }
        }
        toast.error(errorMessage);
      }
    }

  }

  if (registrationSuccess && !isEmailVerified) {
    return (
      <div className="w-full max-w-lg">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>Registration Successful!</CardTitle>
              <CardDescription>
                We&apos;ve sent a verification email to {registeredEmail}
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
                  Please check your email and click the verification link to activate your account.
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={async () => {
                      try {
                        await resendVerificationEmail(registeredEmail);
                        toast.success("Verification email resent!");
                      } catch {
                        toast.error("Failed to resend email");
                      }
                    }}
                    className="text-primary hover:text-primary/80 font-bold underline"
                  >
                    resend verification email
                  </button>
                </p>
                <Button asChild className="w-full">
                  <Link href="/login">Go to Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="login-form" onSubmit={(e) => form.handleSubmit((data) => onSubmit(data, e))(e)}>
              <FieldGroup>
                <div className="flex  gap-2">
                  <Controller name="firstName" control={form.control} render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="firstName">{t("firstName")}</FieldLabel>
                      <Input
                        {...field}
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        aria-invalid={fieldState.invalid}
                        className="bg-slate-100 "
                      />
                      {fieldState.invalid || fieldState.isTouched && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )} />
                  <Controller name="lastName" control={form.control} render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lastName">{t("lastName")}</FieldLabel>
                      <Input
                        {...field}
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        aria-invalid={fieldState.invalid}
                        className="bg-slate-100 "
                      />
                      {fieldState.invalid || fieldState.isTouched && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )} />
                </div>
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
                      {fieldState.invalid || fieldState.isTouched && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
                <div className="flex flex-col gap-2">
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
                  <Controller name="confirmPassword" control={form.control} render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirmPassword">{t("confirmPassword")}</FieldLabel>
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        className="bg-slate-100 "
                      />
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )} />
                </div>
                <Field>
                  <Button type="submit" form="login-form" className="font-bold">{loading ? <Spinner /> : t("buttonText")}</Button>
                  <FieldDescription className="text-center">
                    {t("loginLink")} <a href="/login" className="text-primary hover:text-primary/80 font-bold no-underline!">Login</a>
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
