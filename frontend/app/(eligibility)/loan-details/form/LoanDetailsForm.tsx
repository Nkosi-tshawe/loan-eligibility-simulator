"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loanDetailsFormSchema } from "./formSchema";
import { useRouter } from "next/navigation";

export default function LoanDetailsForm() {
  const form = useForm<z.infer<typeof loanDetailsFormSchema>>({
    resolver: zodResolver(loanDetailsFormSchema),
    defaultValues: {
      loanAmount: undefined,
      loanTerm: 12,
      loanPurpose: "",
    },
  });

  const loanTermMonths = useWatch({
    control: form.control,
    name: "loanTerm",
    defaultValue: 12,
  });

  const router = useRouter();

  const loanTermYears = loanTermMonths ? Math.floor(loanTermMonths / 12) : 0;
  const loanTermRemainingMonths = loanTermMonths ? loanTermMonths % 12 : 0;

  function onSubmit(data: z.infer<typeof loanDetailsFormSchema>) {
    router.push("/eligibility-results");
    toast("Loan details saved", {
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
    <form id="loan-details-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="loanAmount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="loanAmount">Loan Amount</FieldLabel>
              <Input
                {...field}
                id="loanAmount"
                type="number"
                placeholder="Enter loan amount"
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
          name="loanTerm"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel htmlFor="loanTerm">Loan Term</FieldLabel>
                <span className="text-sm font-medium text-slate-600">
                  {loanTermYears > 0 && `${loanTermYears} ${loanTermYears === 1 ? "year" : "years"}`}
                  {loanTermYears > 0 && loanTermRemainingMonths > 0 && ", "}
                  {loanTermRemainingMonths > 0 && `${loanTermRemainingMonths} ${loanTermRemainingMonths === 1 ? "month" : "months"}`}
                  {loanTermYears === 0 && loanTermRemainingMonths === 0 && "0 months"}
                  {loanTermMonths && ` (${loanTermMonths} months)`}
                </span>
              </div>
              <Slider
                id="loanTerm"
                min={1}
                max={360}
                step={1}
                value={[field.value || 12]}
                onValueChange={(values) => {
                  field.onChange(values[0]);
                }}
                className="w-full"
                aria-invalid={fieldState.invalid}
              />
              <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                <span>1 month</span>
                <span>360 months (30 years)</span>
              </div>
              {(fieldState.invalid || fieldState.isTouched) && (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="loanPurpose"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="loanPurpose">Loan Purpose</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}
              >
                <SelectTrigger
                  id="loanPurpose"
                  className="w-full bg-slate-100"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select loan purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home-purchase">Home Purchase</SelectItem>
                  <SelectItem value="home-refinancing">Home Refinancing</SelectItem>
                  <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="car-vehicle">Car/Vehicle</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="medical">Medical Expenses</SelectItem>
                  <SelectItem value="home-improvement">Home Improvement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {(fieldState.invalid || fieldState.isTouched) && (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Field>
          <Button
            type="submit"
            form="loan-details-form"
            className="w-full font-bold"
          >
            Continue
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

