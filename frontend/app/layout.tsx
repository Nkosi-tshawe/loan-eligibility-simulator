import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ErrorBoundaryWrapper } from "@/components/ErrorBoundaryWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { template: '%s - LoanQuest', default: 'LoanQuest' },
  description: "LoanQuest is a platform for finding the best loans for your needs",
};

async function RootLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();

  
  return (
     <NextIntlClientProvider messages={messages} locale={locale}>
          <ErrorBoundaryWrapper>
            <div className="min-h-svh w-full flex flex-col">
              <Header />
              <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-slate-100 font-sans">
                {children}
              </div>
            </div>
            <Toaster />
          </ErrorBoundaryWrapper>
     </NextIntlClientProvider>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-svh`}
      >
        <RootLayoutContent>
          {children}
        </RootLayoutContent>
      </body>
    </html>
  );
}