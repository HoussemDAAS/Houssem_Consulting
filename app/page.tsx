"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-AccentColor text-PrimaryColor">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-[size:20px_20px] sm:bg-[size:30px_30px] opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-AccentColor to-secondary/20" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-4 md:gap-8 w-full max-w-4xl">
        
        {/* Branding Section */}
        <div className="w-full lg:flex-1 space-y-3 text-center lg:text-left">
          {/* Logo Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3"
          >
            <div className="relative w-24 h-24">
              <Image 
                src="/logo.jpeg" 
                alt="Company Logo 1" 
                fill 
                className="object-contain"
                sizes="96px"
              />
            </div>
            <span className="text-xl text-secondaryColor hidden sm:inline">×</span>
            <div className="relative w-24 h-24">
              <Image 
                src="/logo2.svg" 
                alt="Company Logo 2" 
                fill 
                className="object-contain"
                sizes="96px"
              />
            </div>
          </motion.div>

          {/* Heading Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-2"
          >
            <h1 className="text-lg sm:text-xl font-bold uppercase">
              Client Management Excellence
            </h1>
            <p className="text-xs sm:text-sm font-light text-secondaryColor">
              Optimizing Business with Mitutoyo Solutions
            </p>
          </motion.div>

          {/* Auth Button */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex justify-center lg:justify-start mt-4"
          >
            <Button 
              className="h-10 px-5 bg-primaryColor text-accentColor 
                        border border-secondaryColor shadow-sm
                        hover:shadow-md text-xs sm:text-sm
                        transition-transform hover:scale-105"
              asChild
            >
              <a href="/login" className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span>Client Login</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Core Values Grid */}
        <div className="w-full lg:flex-1 grid grid-cols-2 gap-1.5 sm:gap-3 p-2">
          {["Accuracy", "Innovation", "Reliability", "Efficiency"].map((value, index) => (
            <motion.div 
              key={value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              whileHover={{ scale: 1.05 }}
              className="aspect-square flex items-center justify-center p-2 
                        bg-AccentColor border border-PrimaryColor 
                        text-xs sm:text-sm font-bold hover:bg-secondary
                        cursor-pointer shadow-sm hover:shadow-md"
            >
              {value}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}