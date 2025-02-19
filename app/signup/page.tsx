// app/signup/page.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

export default function SignupPage() {
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
        </div>
      </div>

      {/* Signup Form */}
      <div className="relative md:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8 space-y-6 shadow-2xl dark:shadow-gray-900/30">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Get Started
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Create your account to begin
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                className="dark:bg-gray-900 focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

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

            <div className="space-y-3">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password" 
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
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
            </span>
            <Link 
              href="/login" 
              className="font-medium text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300 underline"
            >
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}