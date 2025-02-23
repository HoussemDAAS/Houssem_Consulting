/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Briefcase, Lightbulb } from "lucide-react";
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export default function SignupPage() {
  const router = useRouter();
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch 
  } = useForm<SignupFormData>();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

// Update onSubmit
const onSubmit = async (data: SignupFormData) => {
  try {
    setLoading(true);
    setError('');

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    // Automatically login after signup
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      }),
    });

    const loginResult = await loginResponse.json();

    if (!loginResponse.ok) {
      throw new Error(loginResult.error);
    }

    localStorage.setItem('user', JSON.stringify(loginResult.user));
    router.push('/dashboard');
  } catch (err: any) {
    setError(err.message || 'Registration failed');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-black">
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="dark:bg-gray-900 focus:ring-2 focus:ring-black dark:focus:ring-white"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && typeof errors.name.message === 'string' && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="dark:bg-gray-900 focus:ring-2 focus:ring-black dark:focus:ring-white"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && typeof errors.email.message === 'string' && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="dark:bg-gray-900 focus:ring-2 focus:ring-black dark:focus:ring-white"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
              />
              {errors.password && typeof errors.password.message === 'string' && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="dark:bg-gray-900 focus:ring-2 focus:ring-black dark:focus:ring-white"
                {...register('confirmPassword', {
                  validate: (value) => 
                    value === watch('password') || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && typeof errors.confirmPassword.message === 'string' && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <Button 
              className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black 
                        text-white py-6 text-lg transition-all"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

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
          </form>
        </Card>
      </div>
    </div>
  );
}