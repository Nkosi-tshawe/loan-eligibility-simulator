"use client";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMessages } from "next-intl";

export default function Header() {
    const { isAuthenticated,logout,user } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const messages = useMessages();
    const menuItems = (messages.navigationMenu as { menuItems: Array<{ label: string; href: string }> })?.menuItems || [];
   
    const handleRouter = (path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setOpen(false);
        router.push(path);
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
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
                        {isAuthenticated ? (
                            <DropdownMenu>
                            <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarFallback>{user?.firstName?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>My Account</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Profile</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                            <li><Link href="/login" className="text-sm font-medium  hover:text-primary">Login</Link></li>
                        )}
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
                      <div className="flex flex-col justify-between">
                        <ul className="flex flex-col gap-4 px-4 w-full">
                          {menuItems.map((item) => (
                            <li key={item.label}>
                              <Link href={item.href} onClick={(e) => handleRouter(item.href,e)} className="text-sm font-medium text-center block">{item.label}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <SheetFooter>
                       {isAuthenticated ?  <Button variant="outline" onClick={() => {logout(); setOpen(false);}}>Logout</Button> : <Button variant="outline" onClick={() => {router.push('/login'); setOpen(false);}}>Login</Button>}
                      </SheetFooter>
                </SheetContent>
            </header>
        </Sheet>
    )
}