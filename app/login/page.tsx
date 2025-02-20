// app/login/page.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Briefcase, Lightbulb } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-black">
      {/* Brand Section */}
      <div className="relative md:w-1/2 h-[40vh] md:h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
        <div className="relative z-10 space-y-8 text-center">
          <div className="relative w-48 h-48 mx-auto">
            <Image
              src="/logo.jpeg"
              alt="Consulting Agency Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Strategic Business Solutions
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-xl mx-auto">
  {['Strategy', 'Innovation', 'Growth', 'Analysis', 'Planning', 'Success'].map((value, index) => (
    <div 
      key={value}
      className={`p-3 rounded-xl transition-all duration-300 ${
        index % 2 === 0 
          ? 'bg-black text-white dark:bg-white dark:text-black' 
          : 'bg-white text-black dark:bg-gray-800 dark:text-white'
      }`}
    >
      <span className="text-xs font-bold flex items-center gap-2 justify-center">
        {index % 2 === 0 ? (
          <Briefcase className="h-3 w-3" />
        ) : (
          <Lightbulb className="h-3 w-3" />
        )}
        {value}
      </span>
    </div>
  ))}
</div>
        </div>
        
      </div>

      {/* Login Form */}
      <div className="relative md:w-1/2 flex items-center justify-center p-8">
     
        <Card className="w-full max-w-md p-8 space-y-6 shadow-2xl dark:shadow-gray-900/30">
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
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className="dark:bg-gray-900 focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="dark:bg-gray-900 focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black 
                        text-white py-6 text-lg transition-all"
              type="submit"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              New to our platform?{" "}
            </span>
            <Link 
              href="/signup" 
              className="font-medium text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300 underline"
            >
              Create account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}