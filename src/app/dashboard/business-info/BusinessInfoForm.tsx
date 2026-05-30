'use client';

import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { updateBusinessInfo } from '../actions';

export default function BusinessInfoForm({ initialData }: { initialData: any }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      business_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      business_type: 'Plumber',
    }
  });

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  const onSubmit = (data: any) => {
    setMessage('');
    startTransition(async () => {
      const res = await updateBusinessInfo(data);
      if (res.success) {
        setMessage('Business information updated successfully!');
      } else {
        setMessage('Error: ' + res.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 shadow-sm rounded-xl border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <input {...register('business_name')} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Type</label>
          <input {...register('business_type')} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" {...register('email')} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="tel" {...register('phone')} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Street Address</label>
          <input {...register('address')} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input {...register('city')} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input {...register('state')} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">ZIP</label>
            <input {...register('zip')} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-green-600 font-medium">{message}</span>
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
