import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { financialDetailsFormSchema } from "./formSchema";
import { z } from "zod";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

 export default function FinancialDetailsForm() {
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
        console.log(data);
    }

      return (
        <form id="financial-details-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="monthlyIncome"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Monthly Income</FieldLabel>
                            <Input type="number" {...field} />
                        </Field>
                    )}
                />
                <Controller
                    name="monthlyExpenses"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Monthly Expenses</FieldLabel>
                            <Input type="number" {...field} />
                        </Field>
                    )}
                />
                <Controller
                    name="existingDebt"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Existing Debt</FieldLabel>
                            <Input type="number" {...field} />
                        </Field>
                    )}
                />
                <Controller
                    name="creditScore"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Credit Score</FieldLabel>
                            <Input type="number" {...field} />
                        </Field>
                    )}
                />
            </FieldGroup>
            <Button type="submit" form="financial-details-form">Submit</Button>
          </form>
    );
 }