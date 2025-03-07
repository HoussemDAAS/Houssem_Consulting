/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Briefcase, Lightbulb } from "lucide-react";
import { useAuth } from '@/context/AuthContext';

import { useRouter } from 'next/navigation';
import Image from 'next/image';



interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError('');
  
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Login failed");
        } else {
          throw new Error("Unexpected server response. Please try again later.");
        }
      }
  
      const result = await response.json();
  
      // Store user session
      login(result.user); // Add this line
      // localStorage.setItem('user', JSON.stringify(result.user));
      // router.push('/dashboard');
    } catch (err: any) {
      try {
        const errorData = JSON.parse(err.message);
        setError(errorData.error || 'Login failed');
      } catch {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.token) {
      router.push('/dashboard');
    }
  }, [user, router]);
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-black">
      {/* Left Section */}
      <div className="relative lg:w-1/2 min-h-[40vh] lg:min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
        <div className="relative z-10 space-y-4 sm:space-y-6 md:space-y-8 text-center w-full">
          {/* Logo Grid */}
          <div className="flex flex-col xs:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6 md:p-8">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
              <Image 
                src="/logo.jpeg" 
                alt="Company Logo 1" 
                fill 
                className="object-contain"
                sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
              />
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl text-secondaryColor">×</span>
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
              <Image 
                src="/logo2.svg" 
                alt="Company Logo 2" 
                fill 
                className="object-contain"
                sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Strategic Analytics Solutions
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-xl mx-auto">
            {['Data Analysis', 'Process Optimization', 'Technological Innovation', 'Strategic Decision-Making','Risk Management','Operational Efficiency'].map((value, index) => (
              <div 
                key={value}
                className={`p-2 sm:p-3 rounded-lg md:rounded-xl transition-all duration-300 ${
                  index % 2 === 0 
                    ? 'bg-black text-white dark:bg-white dark:text-black' 
                    : 'bg-white text-black dark:bg-gray-800 dark:text-white'
                }`}
              >
                <span className="text-[10px] xs:text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2 justify-center">
                  {index % 2 === 0 ? (
                    <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  <span className="truncate">{value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-[400px] md:max-w-md p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-xl dark:shadow-gray-900/30">
          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Welcome
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Simplify analysis & process optimization
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-10 sm:h-12 text-sm sm:text-base dark:bg-gray-900 focus:ring-2 focus:ring-black dark:focus:ring-white"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-500 text-xs sm:text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-10 sm:h-12 text-sm sm:text-base dark:bg-gray-900 focus:ring-2 focus:ring-black dark:focus:ring-white"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="text-red-500 text-xs sm:text-sm">{errors.password.message}</p>}
            </div>

            {error && <p className="text-red-500 text-center text-sm sm:text-base">{error}</p>}

            <Button 
              className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black 
                        text-white py-4 sm:py-6 text-sm sm:text-base transition-all"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Login'} 
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="text-center text-xs sm:text-sm">
              <p className="text-gray-500 dark:text-gray-400">
                Administration portal - restricted access
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}