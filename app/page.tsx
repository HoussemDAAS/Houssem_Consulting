"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-AccentColor text-PrimaryColor">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-[size:30px_30px] lg:bg-[size:35px_35px] opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-AccentColor to-secondary/20" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 md:gap-8 w-full max-w-5xl">
        
        {/* Branding Section */}
        <div className="w-full lg:flex-1 space-y-4 lg:space-y-5 text-center">
          {/* Logo Stack - Centered for all screens */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6 lg:gap-6"
          >
            <div className="relative w-40 h-40 lg:w-40 lg:h-40">
              <Image 
                src="/logo.jpeg" 
                alt="Company Logo 1" 
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
            <div className="relative">
              <Image 
                src="/logo2.svg" 
                alt="Company Logo 2" 
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Heading Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-2 lg:space-y-3"
          >
            <h1 className="text-xl lg:text-2xl font-bold uppercase">
              Client Management Excellence
            </h1>
            <p className="text-sm lg:text-base font-light text-secondaryColor">
              Optimizing Business with Mitutoyo Solutions
            </p>
          </motion.div>

          {/* Auth Button */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex justify-center mt-4 lg:mt-5"
          >
            <Button 
              className="h-11 px-6 bg-primaryColor text-accentColor 
                        border-2 border-secondaryColor shadow-md
                        hover:shadow-lg text-sm lg:text-base
                        transition-transform hover:scale-105"
              asChild
            >
              <a href="/login" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 lg:h-5 lg:w-5" />
                <span>Client Login</span>
                <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Core Values Grid */}
        <div className="w-full lg:flex-1 grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 p-2 lg:p-3">
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
              className="aspect-square flex items-center justify-center p-2 lg:p-3 
                        bg-AccentColor border border-PrimaryColor 
                        text-sm lg:text-base font-bold hover:bg-secondary
                        cursor-pointer shadow-md hover:shadow-lg"
            >
              {value}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}