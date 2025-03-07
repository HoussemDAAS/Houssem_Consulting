import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-6 md:p-12 relative overflow-hidden bg-AccentColor text-PrimaryColor">
      {/* Subtle Background Design */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-[size:50px_50px] opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-AccentColor to-secondary/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-6xl w-full">
        {/* Brand Showcase */}
        <div className="flex-1 space-y-6 text-center md:text-left">
        <div className="relative w-full flex justify-center md:justify-start gap-6 items-center">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              <Image src="/logo.jpeg" alt="Company Logo 1" fill className="object-contain" />
            </div>
            <span className="text-3xl  text-secondaryColor">×</span>
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              <Image src="/logo2.svg" alt="Company Logo 2" fill className="object-contain" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primaryColor to-secondaryColor bg-clip-text text-transparent leading-tight uppercase">
          Client Management Excellenc
            <br />
            <span className="text-base md:text-lg font-light text-secondaryColor mt-2 block">
            Optimizing Business with Mitutoyo Solutions
            </span>
          </h1>

          {/* Auth Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start mt-10">
            <Button 
              className="group h-12 md:h-14 px-10 md:px-12 bg-primaryColor text-accentColor 
                        backdrop-blur-lg border border-secondaryColor shadow-md
                        hover:shadow-lg hover:scale-105 transition-all"
              asChild
            >
              <a href="/login" className="space-x-3 flex items-center">
                <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-PrimaryColor" />
                <span className="text-base md:text-lg">Client Login</span>
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-2" />
              </a>
            </Button>
          </div>
        </div>

        {/* Interactive Core Values */}
        <div className="flex-1 grid grid-cols-2 gap-6 p-6">
          {["Accuracy", "Innovation", "Reliability", "Efficiency"].map((value) => (
            <div 
              key={value}
              className="aspect-square flex items-center justify-center p-4 
                        bg-AccentColor border border-PrimaryColor shadow-sm
                        hover:bg-secondary transition-all
                        rotate-2 hover:rotate-0 cursor-pointer text-sm md:text-lg"
            >
              <span className="text-sm md:text-xl font-bold text-PrimaryColor">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
