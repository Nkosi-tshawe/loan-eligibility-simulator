import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LoanQuest - Login",
    description: "Login to your account to continue",
    icons: {
        icon: "/logo.svg",
    },
    openGraph: {
        title: "LoanBuster - Login",
        description: "Login to your account to continue",
    },
  };

export default function AuthLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
       <div className="flex flex-col min-h-svh w-full">
        <Header /> 
        <div className="auth-layout flex-1 flex items-center justify-center p-6 md:p-10 bg-slate-100 font-sans dark:bg-black">
            <div className="w-full max-w-sm">{children}</div>
        </div>
        </div>
    )
}