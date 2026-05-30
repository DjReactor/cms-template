'use client';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { updateSettings } from './actions';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

export function SettingsForm({ initialData }: { initialData: any }) {
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const { handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      show_powered_by: initialData?.show_powered_by ?? false,
      allow_agency_access: initialData?.allow_agency_access ?? true,
      notify_on_publish: initialData?.notify_on_publish ?? true,
      notify_monthly_summary: initialData?.notify_monthly_summary ?? false,
      notify_new_blog_post: initialData?.notify_new_blog_post ?? false,
    }
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const res = await updateSettings(initialData.id, data);
      if (res.success) {
        addToast({ title: 'Settings saved', type: 'success' });
      } else {
        addToast({ title: 'Error saving', description: res.error, type: 'error' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Agency Access</CardTitle>
          <CardDescription>Control how SuccessForce staff can access your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <p className="font-medium text-slate-900">Allow Support Access</p>
              <p className="text-sm text-slate-500">Allow our support team to log into your dashboard to help troubleshoot issues.</p>
            </div>
            <Toggle 
              checked={watch('allow_agency_access')} 
              onChange={(e) => setValue('allow_agency_access', e.target.checked)} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose which events you want to be notified about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <p className="font-medium text-slate-900">Content Published</p>
              <p className="text-sm text-slate-500">Get notified when a new page or service goes live.</p>
            </div>
            <Toggle 
              checked={watch('notify_on_publish')} 
              onChange={(e) => setValue('notify_on_publish', e.target.checked)} 
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <p className="font-medium text-slate-900">Monthly Summary</p>
              <p className="text-sm text-slate-500">Receive a monthly report of traffic and leads.</p>
            </div>
            <Toggle 
              checked={watch('notify_monthly_summary')} 
              onChange={(e) => setValue('notify_monthly_summary', e.target.checked)} 
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <p className="font-medium text-slate-900">New Blog Post Alerts</p>
              <p className="text-sm text-slate-500">Get notified when an AI-generated blog post is published.</p>
            </div>
            <Toggle 
              checked={watch('notify_new_blog_post')} 
              onChange={(e) => setValue('notify_new_blog_post', e.target.checked)} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Manage how the website displays agency attribution.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <p className="font-medium text-slate-900">Show "Powered by SuccessForce"</p>
              <p className="text-sm text-slate-500">Display a small badge in the footer of your website.</p>
            </div>
            <Toggle 
              checked={watch('show_powered_by')} 
              onChange={(e) => setValue('show_powered_by', e.target.checked)} 
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-12">
        <Button type="submit" isLoading={isPending} size="lg">Save Preferences</Button>
      </div>
    </form>
  );
}
