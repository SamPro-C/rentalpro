'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';

interface UserApproval {
  id: string;
  email: string;
  fullName: string;
  role: string;
  created_at: string;
}

export default function UserApprovalQueuePage() {
  const [users, setUsers] = useState<UserApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUnapprovedUsers();
  }, []);

  async function fetchUnapprovedUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('id, email, fullName, role, created_at')
      .eq('approved', false)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: 'Error fetching users',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  }

  async function approveUser(userId: string) {
    const { error } = await supabase
      .from('users')
      .update({ approved: true })
      .eq('id', userId);

    if (error) {
      toast({
        title: 'Error approving user',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'User approved',
        description: 'The user has been approved successfully.',
      });
      fetchUnapprovedUsers();
    }
  }

  async function rejectUser(userId: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      toast({
        title: 'Error rejecting user',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'User rejected',
        description: 'The user registration has been rejected.',
      });
      fetchUnapprovedUsers();
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Approval Queue</h1>
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users pending approval.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Full Name</th>
              <th className="border border-gray-300 p-2 text-left">Role</th>
              <th className="border border-gray-300 p-2 text-left">Registered At</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.fullName}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
                <td className="border border-gray-300 p-2">{new Date(user.created_at).toLocaleString()}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => approveUser(user.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => rejectUser(user.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
