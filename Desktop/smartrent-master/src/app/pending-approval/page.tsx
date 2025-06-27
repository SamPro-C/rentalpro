'use client';

import Link from 'next/link';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-primary p-4">
      <h1 className="text-3xl font-bold mb-4 text-text-primary">Registration Successful!</h1>
      <p className="mb-6 text-text-secondary max-w-md text-center">
        Thank you for registering. Please check your email to confirm your address. Your account is pending waiting for the admins approval. You will be notified once your account is approved.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
}
