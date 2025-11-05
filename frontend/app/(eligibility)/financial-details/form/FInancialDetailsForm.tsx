"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { financialDetailsFormSchema } from "./formSchema";
import { useRouter } from "next/navigation";
import { useEligibility } from "@/context/EligibilityContext";
import { FinancialDetails } from "@/models/FinancialDetails";

export default function FinancialDetailsForm() {
  const {financialDetails,setFinancialDetails} = useEligibility();
  const form = useForm<z.infer<typeof financialDetailsFormSchema>>({
    resolver: zodResolver(financialDetailsFormSchema),
    defaultValues: {
      monthlyIncome: financialDetails.monthlyIncome,
      monthlyExpenses: financialDetails.monthlyExpenses,
      existingDebt: financialDetails.existingLoans,
      creditScore: financialDetails.creditScore,
    },
  });

  const router = useRouter();

  function onSubmit(data: z.infer<typeof financialDetailsFormSchema>) {
    setFinancialDetails({...data} as unknown as FinancialDetails);
    router.push("/loan-details");
    if(process.env.NEXT_ENV === 'development') { // Only show toast in development environment
      toast("Financial details saved", {
        description: (
          <pre className="bg-code text-gray-500 mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(financialDetails, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius) + 4px)",
        } as React.CSSProperties,
      });
    }
 
  }

  return (
    <form
      id="financial-details-form"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="monthlyIncome"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="monthlyIncome">Monthly Income</FieldLabel>
              <Input
                {...field}
                id="monthlyIncome"
                min={0}
                type="number"
                placeholder="Enter monthly income"
                aria-invalid={fieldState.invalid}
                className="bg-slate-100"
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : Number(value));
                }}
                value={field.value ?? ""}
              />
              {(fieldState.invalid || fieldState.isTouched) && (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="monthlyExpenses"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="monthlyExpenses"> Total Monthly Expenses</FieldLabel>
              <Input
                {...field}
                id="monthlyExpenses"
                type="number"
                min={0}
                placeholder="Enter monthly expenses"
                aria-invalid={fieldState.invalid}
                className="bg-slate-100"
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : Number(value));
                }}
                value={field.value ?? ""}
              />
              {(fieldState.invalid || fieldState.isTouched) && (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="existingDebt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="existingDebt">Existing Debt</FieldLabel>
              <Input
                {...field}
                id="existingDebt"
                min={0}
                type="number"
                placeholder="Enter existing debt amount"
                aria-invalid={fieldState.invalid}
                className="bg-slate-100"
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : Number(value));
                }}
                value={field.value ?? ""}
              />
              {(fieldState.invalid || fieldState.isTouched) && (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="creditScore"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="creditScore">Credit Score</FieldLabel>
              <Input
                {...field}
                id="creditScore"
                type="number"
                placeholder="Enter credit score (300-850)"
                aria-invalid={fieldState.invalid}
                className="bg-slate-100"
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : Number(value));
                }}
                value={field.value ?? ""}
              />
              {(fieldState.invalid || fieldState.isTouched) && (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Field>
          <Button
            type="submit"
            form="financial-details-form"
            className="w-full font-bold"
          >
            Continue
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}