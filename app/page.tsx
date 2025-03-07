import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 md:p-12 relative overflow-hidden bg-AccentColor text-PrimaryColor">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-[size:30px_30px] sm:bg-[size:50px_50px] opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-AccentColor to-secondary/20" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 md:gap-12 w-full max-w-6xl">
        
        {/* Branding Section with Top Spacing */}
        <div className="w-full lg:flex-1 space-y-4 md:space-y-6 text-center lg:text-left mt-8 md:mt-12">
          {/* Logo Grid */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 sm:gap-6 mt-4 md:mt-6">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
              <Image 
                src="/logo.jpeg" 
                alt="Company Logo 1" 
                fill 
                className="object-contain"
                sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
              />
            </div>
            <span className="text-2xl md:text-3xl text-secondaryColor hidden sm:inline">×</span>
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
              <Image 
                src="/logo2.svg" 
                alt="Company Logo 2" 
                fill 
                className="object-contain"
                sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
              />
            </div>
          </div>

          {/* Heading Section */}
          <div className="space-y-2 md:space-y-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primaryColor to-secondaryColor bg-clip-text text-transparent leading-snug uppercase">
              Client Management Excellence
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-light text-secondaryColor">
              Optimizing Business with Mitutoyo Solutions
            </p>
          </div>

          {/* Auth Buttons */}
          <div className="flex justify-center lg:justify-start mt-6 md:mt-10">
            <Button 
              className="group h-11 sm:h-12 md:h-14 px-6 sm:px-8 md:px-12 bg-primaryColor text-accentColor 
                        backdrop-blur-lg border border-secondaryColor shadow-md
                        hover:shadow-lg hover:scale-105 transition-all text-sm sm:text-base"
              asChild
            >
              <a href="/login" className="space-x-2 sm:space-x-3 flex items-center">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                <span>Client Login</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1 sm:group-hover:translate-x-2" />
              </a>
            </Button>
          </div>
        </div>

        {/* Core Values Grid - Always 2 columns */}
        <div className="w-full lg:flex-1 grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 p-2 sm:p-4 md:p-6">
          {["Accuracy", "Innovation", "Reliability", "Efficiency"].map((value) => (
            <div 
              key={value}
              className="aspect-square flex items-center justify-center p-2 sm:p-4 
                        bg-AccentColor border border-PrimaryColor shadow-sm
                        hover:bg-secondary transition-all text-center
                        hover:rotate-0 cursor-pointer rotate-0 xs:rotate-2
                        text-xs xs:text-sm sm:text-base md:text-lg font-bold"
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}