'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to submit form. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl text-center">
        <h3 className="font-semibold text-lg mb-2">Message Sent!</h3>
        <p>Thank you for reaching out. We will get back to you shortly.</p>
        <Button variant="outline" className="mt-4" onClick={() => setStatus('idle')}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <Input label="Name" name="name" required placeholder="John Doe" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Email" name="email" type="email" placeholder="john@example.com" />
        <Input label="Phone" name="phone" type="tel" placeholder="(555) 555-5555" />
      </div>
      <Textarea label="Message" name="message" required rows={4} placeholder="How can we help you?" />
      
      {status === 'error' && (
        <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-lg">
          {errorMessage}
        </div>
      )}
      
      <Button type="submit" isLoading={status === 'loading'} className="w-full">
        Send Message
      </Button>
      
      <p className="text-xs text-slate-500 text-center mt-2">
        Please provide either an email or phone number.
      </p>
    </form>
  );
}
