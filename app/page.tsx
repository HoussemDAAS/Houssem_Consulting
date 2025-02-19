// app/page.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-black">
    {/* Brand Showcase Section */}
    <div className="relative md:w-1/2 h-[40vh] md:h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10 dark:opacity-15">
        <div className="absolute w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Logo Container */}
      <div className="relative z-10 space-y-8 text-center group">
        {/* Main Logo */}
        <div className="relative w-48 h-48 mx-auto transition-transform duration-300 hover:scale-105">
          <Image
            src="/logo.jpeg
          " // Replace with actual logo path
            alt="Consulting Agency Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Animated Tagline */}
        <div className="overflow-hidden">
          <div className="animate-slide-up-fade space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Strategic Business Solutions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm">
              Transforming visions into measurable success through expert consulting
            </p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-3 gap-4 mt-8 max-w-xl mx-auto">
          {['Strategy', 'Innovation', 'Growth', 'Analysis', 'Planning', 'Success'].map((value) => (
            <div key={value} className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* Right Section */}
      <div className="relative md:w-1/2 flex items-center justify-center p-8">
        {/* Animated Text Banner */}
        <div className="absolute top-4 right-0 left-0 md:top-8 mx-auto w-full max-w-xl px-4">
          <div className="relative overflow-hidden h-12">
            <div className="absolute inset-0 flex items-center justify-center animate-infinite-scroll space-x-4">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                TOP AGENCY IN TUNISIA • DEVELOP INNOVATE CREATE • DIGITAL EXCELLENCE
              </span>
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                TOP AGENCY IN TUNISIA • DEVELOP INNOVATE CREATE • DIGITAL EXCELLENCE
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Login Card */}
        <Card className="w-full max-w-md p-8 space-y-6 relative group border-0 shadow-xl dark:shadow-gray-800/20 hover:shadow-2xl dark:hover:shadow-gray-800/30 transition-shadow duration-300 mt-16 md:mt-0">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Streamline your business management
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className="dark:bg-gray-900 transition-all duration-300 focus:ring-2 focus:ring-black dark:focus:ring-white hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="dark:bg-gray-900 transition-all duration-300 focus:ring-2 focus:ring-black dark:focus:ring-white hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600"
              />
            </div>

            <Button 
              className="w-full group/button bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white 
                        transform transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl
                        flex items-center justify-between px-6 py-6"
              type="submit"
            >
              <span className="text-lg">Continue to Dashboard</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/button:translate-x-1" />
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              New to our platform?{" "}
            </span>
            <a 
              href="#" 
              className="font-medium text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300 
                         underline underline-offset-4 decoration-from-font transition-colors"
            >
              Create account
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}