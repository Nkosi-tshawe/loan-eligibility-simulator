import RegisterForm from "@/components/feature/Register/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Login',
  description: "Login to your account to continue",
  openGraph: {
    title: 'Login',
      description: "Login to your account to continue",
  },
};

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
    </>
  );
}
