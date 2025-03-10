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
import { motion } from 'framer-motion';

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
            <div className="relative w-40 ">
              <Image 
                src="/logo2.svg" 
                alt="Company Logo 2" 
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          </motion.div>

          <h2 className="text-xl lg:text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
            Strategic Analytics Platform
          </h2>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
            {['Analytics', 'Efficiency', 'Innovation', 'Strategy'].map((value, index) => (
              <div 
                key={value}
                className={`p-3 rounded-md text-sm lg:text-base transition-colors ${
                  index % 2 === 0 
                    ? 'bg-primaryColor text-white dark:bg-gray-200 dark:text-black' 
                    : 'bg-gray-100 text-black dark:bg-primaryColor dark:text-gray-200'
                }`}
              >
                <span className="flex items-center gap-2 justify-center">
                  {index % 2 === 0 ? (
                    <Briefcase className="h-4 w-4 lg:h-5 lg:w-5" />
                  ) : (
                    <Lightbulb className="h-4 w-4 lg:h-5 lg:w-5" />
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
        <Card className="w-full max-w-md p-6 lg:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome Back
            </h1>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm lg:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                className="h-12 lg:h-14 text-sm lg:text-base dark:bg-gray-900"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-500 text-sm lg:text-base">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm lg:text-base">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="h-12 lg:h-14 text-sm lg:text-base dark:bg-gray-900"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="text-red-500 text-sm lg:text-base">{errors.password.message}</p>}
            </div>

            {error && <p className="text-red-500 text-center text-sm lg:text-base">{error}</p>}

            <Button 
              className="w-full h-12 lg:h-14 text-sm lg:text-base"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
            </Button>

            <p className="text-center text-xs lg:text-sm text-gray-500 dark:text-gray-400">
              Administrative access only
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}