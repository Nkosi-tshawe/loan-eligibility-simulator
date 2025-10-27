export default function AuthLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="auth-layout flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">{children}</div>
        </div>
    )
}