// app/page.tsx (Home)

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Rocket, Briefcase, Lightbulb } from "lucide-react";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] animate-gradient-move" />
      </div>

      {/* Brand Section */}
      <div className="relative md:w-1/2 flex flex-col items-center justify-center p-8 space-y-12">
        <div className="relative w-64 h-64 group">
          <Image
            src="/logo.jpeg"
            alt="Logo"
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-95"
          />
          <div className="absolute inset-0 rounded-full border-2 border-gray-300 dark:border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl w-full">
          {['Strategy', 'Innovation', 'Growth', 'Analysis', 'Planning', 'Success'].map((value, index) => (
            <div 
              key={value}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                index % 2 === 0 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'bg-white text-black dark:bg-gray-800 dark:text-white'
              }`}
            >
              <div className="flex items-center gap-2 justify-center">
                {index % 2 === 0 ? (
                  <Briefcase className="h-4 w-4" />
                ) : (
                  <Lightbulb className="h-4 w-4" />
                )}
                <span className="text-xs font-bold">{value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Animated Tagline */}
        <div className="relative overflow-hidden w-full max-w-2xl">
          <div className="animate-infinite-scroll text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Transforming Business Visions into Reality
            </h2>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="relative md:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-xl p-12 space-y-8 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl">
          <div className="space-y-6 text-center">
            <Rocket className="h-16 w-16 mx-auto text-gray-800 dark:text-gray-200 animate-bounce" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Excellence Starts Here
            </h1>
            
            <div className="space-y-6 pt-8">
              <Button 
                className="w-full h-16 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black 
                          text-white text-lg flex justify-between items-center px-8 transition-all hover:scale-[1.02]"
                asChild
              >
                <a href="/login">
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </a>
              </Button>

              <Button 
                variant="outline"
                className="w-full h-16 border-2 border-gray-800 dark:border-gray-200 text-gray-800 dark:text-gray-200 
                          hover:bg-gray-50 dark:hover:bg-gray-800 text-lg hover:scale-[0.98] transition-all"
                asChild
              >
                <a href="/signup">
                  <span>Create Account</span>
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}