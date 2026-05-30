'use client';

import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { updateSiteContent } from '../actions';

export default function ContentForm({ initialData }: { initialData: any }) {
  const { register, handleSubmit } = useForm({ defaultValues: initialData });
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  const onSubmit = (data: any) => {
    setMessage('');
    startTransition(async () => {
      const res = await updateSiteContent('home', data);
      if (res.success) setMessage('Content updated successfully!');
      else setMessage('Error: ' + res.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 shadow-sm rounded-xl border border-gray-100">
      <div>
        <label className="block text-sm font-medium text-gray-700">Hero Headline Override</label>
        <input {...register('hero_headline')} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="Enter custom headline or leave blank for default" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Hero Subheadline Override</label>
        <textarea {...register('hero_subheadline')} rows={3} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="Enter custom subheadline or leave blank for default" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Call to Action Button Text</label>
        <input {...register('cta_text')} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="e.g., Get a Free Estimate" />
      </div>
      
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-green-600 font-medium">{message}</span>
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Content'}
        </button>
      </div>
    </form>
  );
}
