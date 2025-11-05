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
import { toast } from "sonner";
import { personalDetailsFormSchema } from "./formSchema";
import { useRouter } from 'next/navigation';
import { useEligibility } from "@/context/EligibilityContext";
import { PersonalDetails } from "@/models/PersonalDetails";

export default function PersonalDetailsForm() {
  const {personDetails,setPersonDetails} = useEligibility();
  const form = useForm<z.infer<typeof personalDetailsFormSchema>>({
    resolver: zodResolver(personalDetailsFormSchema),
    defaultValues: {
      firstName: personDetails.firstName,
      lastName: personDetails.lastName,
      age: personDetails.age || 18,
      employmentStatus: personDetails.employmentStatus,
      yearsInCurrentRole: personDetails.yearsInCurrentRole || 1,
    },
  });

  const router = useRouter();


  function onSubmit(data: z.infer<typeof personalDetailsFormSchema>) {
  setPersonDetails({...data} as PersonalDetails);
    if(process.env.NEXT_ENV === 'development') { // Only show toast in development environment
      toast("Personal details saved", {
        description: (
          <pre className="bg-code text-gray-500 mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(personDetails, null, 2)}</code>
          </pre>
        ),
      });
    }
    router.push('/financial-details');

  }

  return (
    <form id="personal-details-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col gap-2 md:flex-row">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  {...field}
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  aria-invalid={fieldState.invalid}
                  className="bg-slate-100"
                />
                {(fieldState.invalid || fieldState.isTouched) && (
                  <FieldError>{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  {...field}
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  aria-invalid={fieldState.invalid}
                  className="bg-slate-100"
                />
                {(fieldState.invalid || fieldState.isTouched) && (
                  <FieldError>{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

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