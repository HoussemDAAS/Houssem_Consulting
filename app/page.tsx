import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Briefcase } from "lucide-react";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-8 relative overflow-hidden bg-AccentColor text-PrimaryColor">
      {/* Subtle Background Design */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-[size:60px_60px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-AccentColor to-secondary/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 max-w-7xl w-full">
        {/* Brand Showcase */}
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="relative w-64 h-64 mx-auto md:mx-0 mb-12">
            <Image
              src="/logo.jpeg"
              alt="Consulting Agency Logo"
              fill
              className="object-contain"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primaryColor to-secondaryColor bg-clip-text text-transparent leading-tight uppercase">
            Strategic Excellence
            <br />
            <span className="text-lg font-light text-secondaryColor mt-4 block">
              Global Business Transformation Partners
            </span>
          </h1>

          {/* Auth Actions */}
          <div className="flex flex-col md:flex-row gap-6 justify-center md:justify-start mt-16">
            <Button 
              className="group h-14 px-12 bg-primaryColor text-accentColor 
                        backdrop-blur-lg border border-secondaryColor shadow-md
                        hover:shadow-lg hover:scale-105 transition-all"
              asChild
            >
              <a href="/login" className="space-x-4 flex items-center">
                <Briefcase className="h-6 w-6 text-PrimaryColor" />
                <span className="text-lg">Partner Login</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </a>
            </Button>

            <Button 
              variant="ghost"
              className="group h-14 px-12 border-2 border-PrimaryColor bg-AccentColor text-PrimaryColor
                        hover:bg-secondary hover:text-PrimaryColor transition-all
                        hover:scale-105 hover:shadow-lg"
              asChild
            >
              <a href="/signup" className="space-x-4 flex items-center">
                <Rocket className="h-6 w-6 text-PrimaryColor" />
                <span className="text-lg">Join us</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Interactive Core Values */}
        <div className="flex-1 grid grid-cols-2 gap-8 p-8">
          {['Strategy', 'Innovation', 'Growth', 'Excellence'].map((value) => (
            <div 
              key={value}
              className="aspect-square flex items-center justify-center p-6 
                        bg-AccentColor border border-PrimaryColor shadow-sm
                        hover:bg-secondary transition-all
                        rotate-3 hover:rotate-0 cursor-pointer"
            >
              <span className="text-lg md:text-2xl font-bold text-PrimaryColor">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
