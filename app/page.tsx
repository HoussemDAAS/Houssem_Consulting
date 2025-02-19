// app/page.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-black">
      {/* Left Section with Image */}
      <div className="relative md:w-1/2 h-[40vh] md:h-screen">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
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