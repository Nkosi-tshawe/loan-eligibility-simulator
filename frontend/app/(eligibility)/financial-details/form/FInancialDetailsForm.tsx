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

export default function FinancialDetailsForm() {
  const form = useForm<z.infer<typeof financialDetailsFormSchema>>({
    resolver: zodResolver(financialDetailsFormSchema),
    defaultValues: {
      monthlyIncome: undefined,
      monthlyExpenses: undefined,
      existingDebt: undefined,
      creditScore: undefined,
    },
  });

  const router = useRouter();

  function onSubmit(data: z.infer<typeof financialDetailsFormSchema>) {
    router.push("/loan-details");
    toast("Financial details saved", {
      description: (
        <pre className="bg-code text-gray-500 mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
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