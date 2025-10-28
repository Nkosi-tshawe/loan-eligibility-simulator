import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
    return (
        <Sheet>
            <header className="flex items-center justify-between whitespace-nowrap border-b border-b-slate-200 border-solid px-4  md:px-10 py-4 bg-white">
                <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" className="text-primary hidden md:block" alt="logo" width={32} height={32} />
                <Image src="/logo.svg" className="text-primary block md:hidden" alt="logo" width={24} height={24} />
                    <h1 className="text-xl md:text-2xl font-bold">LoanQuest</h1>
                </Link>
                <div className="hidden md:block">
                    <ul className="flex items-center gap-4">
                        <li><Link href="/" className="text-sm font-medium">Home</Link></li>
                        <li><Link href="/" className="text-sm font-medium  hover:text-primary">About</Link></li>
                        <li><Link href="/" className="text-sm font-medium  hover:text-primary">Contact</Link></li>
                        <li><Link href="/" className="text-sm   bg-primary text-white px-4 py-2 rounded-md font-bold">Login</Link></li>
                    </ul>
                </div>
              <SheetTrigger asChild>
                <button className="md:hidden" >
                        <MenuIcon className="w-6 h-6" />
                    </button>
              </SheetTrigger>

                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle></SheetTitle>
                        <Link href="/" className="flex items-center gap-2 text-xl">
                            <Image src="/logo.svg" className="text-primary" alt="logo" width={24} height={24} />
                            <h1 className="text-xl md:text-2xl font-bold">LoanQuest</h1>
                        </Link>
                    </SheetHeader>
                        <ul className="flex flex-col gap-4 px-4 w-full">
                            <li><Link href="/" className="text-sm font-medium text-center block">Home</Link></li>
                            <li><Link href="/" className="text-sm font-medium text-center block">About</Link></li>
                            <li><Link href="/" className="text-sm font-medium text-center block">Contact</Link></li>
                            <li className="w-full"><Link href="/login" className="text-sm block text-center font-medium bg-primary text-white px-4 py-2 rounded-md font-bold w-full">Login</Link></li>
                        </ul>
                  
                </SheetContent>
            </header>
        </Sheet>
    )
}