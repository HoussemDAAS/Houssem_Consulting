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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const result = await response.json();
      login(result.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) router.push('/dashboard');
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-black">
      {/* Left Section */}
      <div className="lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="space-y-6 max-w-xs">
          <div className="flex justify-center items-center gap-4">
            <div className="relative w-20 h-20">
              <Image 
                src="/logo.jpeg" 
                alt="Company Logo"
                fill 
                className="object-contain"
                sizes="80px"
              />
            </div>
            <span className="text-2xl text-gray-600 dark:text-gray-300">×</span>
            <div className="relative w-20 h-20">
              <Image 
                src="/logo2.svg" 
                alt="Company Logo" 
                fill 
                className="object-contain"
                sizes="80px"
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
            Strategic Analytics Platform
          </h2>

          {/* Compact Features Grid */}
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
            {['Analytics', 'Efficiency', 'Innovation', 'Strategy'].map((value, index) => (
              <div 
                key={value}
                className={`p-2 rounded-md text-xs sm:text-sm transition-colors ${
                  index % 2 === 0 
                    ? 'bg-primaryColor text-white dark:bg-gray-200 dark:text-black' 
                    : 'bg-gray-100 text-black dark:bg-primaryColor dark:text-gray-200'
                }`}
              >
                <span className="flex items-center gap-1 justify-center">
                  {index % 2 === 0 ? (
                    <Briefcase className="h-3 w-3" />
                  ) : (
                    <Lightbulb className="h-3 w-3" />
                  )}
                  <span className="truncate">{value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                className="dark:bg-gray-900"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="dark:bg-gray-900"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <Button 
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Administrative access only
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}