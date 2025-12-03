import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { financialDetailsFormSchema } from "./formSchema";
import { z } from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FinancialDetails } from "@/models/FinancialDetails";
import { useRouter } from "next/navigation";
import { useEligibilityStore } from "@/stores";
import showToast from "@/lib/showToast";

export default function FinancialDetailsForm() {
  const selectAllText = (event: React.MouseEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const { setFinancialDetails } = useEligibilityStore();
  const router = useRouter();
  const form = useForm<z.infer<typeof financialDetailsFormSchema>>({
    resolver: zodResolver(financialDetailsFormSchema),
    defaultValues: {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      existingDebt: 0,
      creditScore: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof financialDetailsFormSchema>) {
    if (data) {
      const financialDetailsData: FinancialDetails = {
        monthlyIncome: data.monthlyIncome,
        monthlyExpenses: data.monthlyExpenses,
        existingLoans: data.existingDebt,
        creditScore: data.creditScore,
      };

      await setFinancialDetails(financialDetailsData);

      showToast({
        data: financialDetailsData,
        title: "Financial details saved",
      });
      router.push("/loan-details");
    }
  }

  return (
    <form
      id="financial-details-form grid gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="monthlyIncome"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Monthly Income</FieldLabel>
              <Input
                id="monthlyIncome"
                type="number"
                {...field}
                onMouseUp={selectAllText}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : Number(value));
                }}
                value={field.value ?? ""}
              />
              {fieldState.invalid && (
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
              <FieldLabel>Monthly Expenses</FieldLabel>
              <Input
                id="monthlyExpenses"
                type="number"
                {...field}
                onMouseUp={selectAllText}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : Number(value));
                }}
                value={field.value ?? ""}
              />
              {fieldState.invalid && (
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
              <FieldLabel>Existing Debt</FieldLabel>
              <Input
                id="existingDebt"
                type="number"
                {...field}
                onMouseUp={selectAllText}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : Number(value));
                }}
                value={field.value ?? ""}
              />
              {fieldState.invalid && (
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
              <FieldLabel>Credit Score</FieldLabel>
              <Input
                id="creditScore"
                type="number"
                {...field}
                onMouseUp={selectAllText}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : Number(value));
                }}
                value={field.value ?? ""}
              />
              {fieldState.invalid && (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" className="w-full font-bold">
            Submit
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
