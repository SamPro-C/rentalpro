'use client';

import React, { useState } from 'react';
import { sendPasswordResetEmail } from '@/lib/api/auth';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(email);
      toast({
        title: 'Success',
        description: 'Password reset email sent. Please check your inbox.',
      });
      setEmail('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reset email.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[--bg-primary] to-[--bg-secondary] text-[--text-primary] items-center justify-center px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>
      <form onSubmit={handlePasswordReset} className="w-full max-w-sm bg-[--bg-card] p-6 rounded-lg shadow-md">
        <label htmlFor="email" className="block mb-2 font-semibold">
          Enter your email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="you@example.com"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent text-white py-2 rounded hover:bg-accent-light disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}
