"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalDetailsFormSchema } from "./formSchema";
import { useRouter } from 'next/navigation';
import { useEligibilityStore } from "@/stores";
import { PersonalDetails } from "@/models/PersonalDetails";
import showToast from "@/lib/showToast";

export default function PersonalDetailsForm() {
  const {personDetails,setPersonDetails} = useEligibilityStore();
  const form = useForm<z.infer<typeof personalDetailsFormSchema>>({
    resolver: zodResolver(personalDetailsFormSchema),
    defaultValues: {
      age: personDetails.age || 18,
      employmentStatus: personDetails.employmentStatus || "employed",
      yearsInCurrentRole: personDetails.yearsInCurrentRole || 1,
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof personalDetailsFormSchema>) {
    const personalDetails: PersonalDetails = {
      age: data.age,
      employmentStatus: data.employmentStatus as PersonalDetails['employmentStatus'],
      yearsInCurrentRole: data.yearsInCurrentRole,
    };
    
    await setPersonDetails(personalDetails);
    
    showToast({data, title: "Personal detailsss saved"});
    router.push('/financial-details');
  }

  return (
    <form id="personal-details-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="age"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="age">Age</FieldLabel>
              <Input
                {...field}
                id="age"
                min={18}
                max={100}
                type="number"
                placeholder="Enter your age"
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
          name="employmentStatus"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="employmentStatus">
                Employment Status
              </FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}
              >
                <SelectTrigger
                  id="employmentStatus"
                  className="w-full bg-slate-100"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                </SelectContent>
              </Select>
              {(fieldState.invalid || fieldState.isTouched) && (
                <FieldError>{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="yearsInCurrentRole"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="yearsInCurrentRole">
                Employment Duration (years)
              </FieldLabel>
              <Input
                {...field}
                id="yearsInCurrentRole"
                type="number"
                min={1}
                max={60}
                placeholder="Enter duration in years"
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
          <Button type="submit" form="personal-details-form" className="w-full font-bold">
            Continue
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}