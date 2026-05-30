'use client';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { updateSeoSettings } from '../actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

export function SeoSettingsForm({ initialData }: { initialData: any }) {
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      site_name: initialData?.site_name || '',
      title_separator: initialData?.title_separator || '|',
      twitter_handle: initialData?.twitter_handle || '',
      google_verification: initialData?.google_verification || '',
      bing_verification: initialData?.bing_verification || '',
      schema_business_type: initialData?.schema_business_type || 'LocalBusiness',
      schema_price_range: initialData?.schema_price_range || '',
      noindex_blog: initialData?.noindex_blog ?? false,
      noindex_service_areas: initialData?.noindex_service_areas ?? false,
      enable_breadcrumbs: initialData?.enable_breadcrumbs ?? true,
      enable_aggregate_rating: initialData?.enable_aggregate_rating ?? true,
      custom_robots_rules: initialData?.custom_robots_rules || '',
    }
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const res = await updateSeoSettings(initialData.id, data);
      if (res.success) {
        addToast({ title: 'SEO Settings saved', type: 'success' });
      } else {
        addToast({ title: 'Error saving', description: res.error, type: 'error' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Global Metadata</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Site Name (Appended to all titles)" {...register('site_name')} />
          <Select label="Title Separator" {...register('title_separator')}>
            <option value="|">| (Pipe)</option>
            <option value="-">- (Hyphen)</option>
            <option value="—">— (Em Dash)</option>
            <option value="»">» (Guillemet)</option>
            <option value="·">· (Middle Dot)</option>
          </Select>
          <Input label="Twitter Handle (Without @)" {...register('twitter_handle')} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webmaster Tools Verification</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Google Search Console ID" {...register('google_verification')} />
          <Input label="Bing Webmaster ID" {...register('bing_verification')} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schema.org Structured Data</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Business Type (e.g., HVACBusiness, Plumber)" {...register('schema_business_type')} />
          <Input label="Price Range (e.g., $$, $$$)" {...register('schema_price_range')} />
          
          <div className="md:col-span-2 space-y-4 pt-2">
            <Toggle 
              checked={watch('enable_breadcrumbs')} 
              onChange={(e) => setValue('enable_breadcrumbs', e.target.checked)} 
              label="Enable BreadcrumbList Schema" 
            />
            <Toggle 
              checked={watch('enable_aggregate_rating')} 
              onChange={(e) => setValue('enable_aggregate_rating', e.target.checked)} 
              label="Enable AggregateRating in LocalBusiness Schema" 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Crawling Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Toggle 
              checked={watch('noindex_blog')} 
              onChange={(e) => setValue('noindex_blog', e.target.checked)} 
              label="Noindex Entire Blog Directory" 
            />
            <Toggle 
              checked={watch('noindex_service_areas')} 
              onChange={(e) => setValue('noindex_service_areas', e.target.checked)} 
              label="Noindex All Service Area Pages" 
            />
          </div>
          <Textarea 
            label="Custom robots.txt Rules" 
            {...register('custom_robots_rules')} 
            rows={4}
            placeholder="User-agent: *&#10;Disallow: /private/"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end pb-12">
        <Button type="submit" isLoading={isPending} size="lg">Save SEO Settings</Button>
      </div>
    </form>
  );
}
