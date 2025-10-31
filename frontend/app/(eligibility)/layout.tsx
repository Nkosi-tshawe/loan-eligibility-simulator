"use client"
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const NavigationContext = React.createContext({navigation: {currentPageTitle: "", currentPageDescription: "", progress:5}, setNavigation: (navigation: {currentPageTitle: string, currentPageDescription: string, progress: number}) => {}});

export default function EligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {

   
const [navigation, setNavigation] = React.useState<{currentPageTitle: string, currentPageDescription: string, progress: number}>({currentPageTitle: "", currentPageDescription: "", progress: 5}); 

const { isAuthenticated, loading: authLoading } = useAuth();
const router = useRouter();

useEffect(() => {
  if (!authLoading && !isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated, authLoading, router]);

if (authLoading) {
  return <div>Authenticating....</div>;
}

if (!isAuthenticated) {
  return null;
}
  
return (
    <NavigationContext.Provider value={{navigation, setNavigation}}>
    <div className="w-full xl:flex xl:max-w-[1024px] xl:gap-5 mx-auto bg-white xl:bg-transparent rounded-lg p-6 ">
      <div className="flex flex-col gap-4 mb-6 xl:mb-0 xl:bg-white xl:p-10 xl:rounded-lg h-fill">
        <div className="text-center">
          <h1 className="text-xl md:text-3xl font-extrabold text-primary">
            {navigation.currentPageTitle}
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            {navigation.currentPageDescription}
          </p>
        </div>
        <div className="w-full max-w-sm">
        <Progress value={navigation.progress} className="w-full" />
          <p className="text-sm text-gray-500 text-center mt-2">
            {navigation.progress}% Complete - You&apos;re doing great!
          </p>
        </div>
        <div className="w-full bg-gray-100 rounded-lg p-4 flex-1">

        </div>
      </div>
     <div className="md:flex-1 xl:bg-white xl:p-10 xl:rounded-lg h-fill">
     {children}
     </div>
    </div>
    </NavigationContext.Provider>
  );
}
