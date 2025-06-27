'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MpesaCredentials {
  shortcode: string;
  passkey: string;
  consumerKey: string;
  consumerSecret: string;
  environment: 'sandbox' | 'production';
}

interface Props {
  landlordId: string;
}

export default function MpesaCredentialsForm({ landlordId }: Props) {
  const [credentials, setCredentials] = useState<MpesaCredentials>({
    shortcode: '',
    passkey: '',
    consumerKey: '',
    consumerSecret: '',
    environment: 'sandbox',
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch existing credentials for landlord
    async function fetchCredentials() {
      try {
        const res = await fetch(`/api/landlord/${landlordId}/mpesa-credentials`);
        if (res.ok) {
          const data = await res.json();
          setCredentials(data);
        }
      } catch (error) {
        console.error('Failed to fetch M-Pesa credentials', error);
      }
    }
    fetchCredentials();
  }, [landlordId]);

  const handleChange = (field: keyof MpesaCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/landlord/${landlordId}/mpesa-credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (res.ok) {
        toast({ title: 'Saved', description: 'M-Pesa credentials saved successfully.' });
      } else {
        toast({ title: 'Error', description: 'Failed to save credentials.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save credentials.', variant: 'destructive' });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md">
      <div>
        <label className="block mb-1 font-medium">Shortcode</label>
        <Input
          value={credentials.shortcode}
          onChange={e => handleChange('shortcode', e.target.value)}
          placeholder="Enter M-Pesa Shortcode"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Passkey</label>
        <Input
          value={credentials.passkey}
          onChange={e => handleChange('passkey', e.target.value)}
          placeholder="Enter M-Pesa Passkey"
          type="password"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Consumer Key</label>
        <Input
          value={credentials.consumerKey}
          onChange={e => handleChange('consumerKey', e.target.value)}
          placeholder="Enter Consumer Key"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Consumer Secret</label>
        <Input
          value={credentials.consumerSecret}
          onChange={e => handleChange('consumerSecret', e.target.value)}
          placeholder="Enter Consumer Secret"
          type="password"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Environment</label>
      <select
        aria-label="Environment"
        value={credentials.environment}
        onChange={e => handleChange('environment', e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      >
        <option value="sandbox">Sandbox</option>
        <option value="production">Production</option>
      </select>
      </div>
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Credentials'}
      </Button>
    </div>
  );
}
