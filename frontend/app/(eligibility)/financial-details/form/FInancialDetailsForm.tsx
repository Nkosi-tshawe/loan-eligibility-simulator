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
import { financialDetailsFormSchema } from "./formSchema";
import { useRouter } from "next/navigation";
import { useEligibilityStore } from "@/stores";
import { FinancialDetails } from "@/models/FinancialDetails";
import showToast from "@/lib/showToast";

export default function FinancialDetailsForm() {
  const {financialDetails,setFinancialDetails} = useEligibilityStore();
  const form = useForm<z.infer<typeof financialDetailsFormSchema>>({
    resolver: zodResolver(financialDetailsFormSchema),
    defaultValues: {
      monthlyIncome: financialDetails.monthlyIncome || 1000,
      monthlyExpenses: financialDetails.monthlyExpenses || 0,
      existingDebt: financialDetails.existingLoans || 0,
      creditScore: financialDetails.creditScore || 0,
    },
  });

  const router = useRouter();


  function onSubmit(data: z.infer<typeof financialDetailsFormSchema>) {
    // Map form data to FinancialDetails model (existingDebt -> existingLoans)
    const financialDetailsData: FinancialDetails = {
      monthlyIncome: data.monthlyIncome,
      monthlyExpenses: data.monthlyExpenses,
      existingLoans: data.existingDebt, // Map existingDebt to existingLoans
      creditScore: data.creditScore,
    };
    
    setFinancialDetails(financialDetailsData);
    showToast({data, title: "Financial details saved"});
    console.log('Setting financial details:', financialDetailsData);
    router.push("/loan-details");
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
                min={1000}
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