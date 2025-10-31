import Link from "next/link";

export default function NotFound() {
    return (
        <div className="w-full max-w-xl mx-auto text-center space-y-6">
            <div className="space-y-2">
                <p className="text-primary font-bold tracking-widest">ERROR 404</p>
                <h1 className="text-3xl md:text-5xl font-extrabold">Page not found</h1>
                <p className="text-slate-600">The page you are looking for doesn’t exist or has been moved.</p>
            </div>

            <div className="flex items-center justify-center gap-3">
            
                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 font-semibold text-primary hover:bg-slate-100"
                >
                    Go back to home
                </Link>
            </div>
        </div>
    );
}