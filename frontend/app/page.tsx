import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center font-sans dark:bg-black">
     
        <div className=" flex flex-col items-center justify-center max-w-3xl text-center space-y-8">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-[-0.03em] text-primary">
        Fast-Track Your Loan Eligibility.
        </h1>
        <p className=" text-lg sm:text-xl font-light leading-relaxed max-w-2xl">
        Discover your loan options with our secure, streamlined process. Get clarity on your eligibility in just minutes.
        </p>
        <Link href="/personal-details" className="flex min-w-[180px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105">
         <span className="truncate">Get Started</span>
        </Link>
        </div>
       
    </div>
  );
}
