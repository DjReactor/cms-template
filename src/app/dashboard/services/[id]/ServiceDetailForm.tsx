'use client';

import { useForm } from 'react-hook-form';
import { useTransition, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateService } from '../actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Toggle } from '@/components/ui/Toggle';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { BlockNoteEditor } from '@/components/dashboard/BlockNoteEditor';
import { useRouter } from 'next/navigation';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  short_description: z.string().max(160, 'Max 160 characters').optional().or(z.literal('')),
  is_active: z.boolean(),
  seo_title: z.string().max(70).optional().or(z.literal('')),
  seo_description: z.string().max(160).optional().or(z.literal('')),
  focus_keyword: z.string().optional().or(z.literal('')),
  noindex: z.boolean(),
  page_content: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ServiceDetailForm({ initialData }: { initialData: any }) {
  const { addToast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      short_description: initialData?.short_description || '',
      is_active: initialData?.is_active ?? true,
      seo_title: initialData?.seo_title || '',
      seo_description: initialData?.seo_description || '',
      focus_keyword: initialData?.focus_keyword || '',
      noindex: initialData?.noindex ?? false,
      page_content: initialData?.page_content || undefined,
    }
  });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(
    initialData?.slug ? !initialData.slug.startsWith('new-service-') : false
  );

  const nameValue = watch('name');

  useEffect(() => {
    if (!isSlugManuallyEdited) {
      const generatedSlug = (nameValue || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setValue('slug', generatedSlug, { shouldValidate: true, shouldDirty: true });
    }
  }, [nameValue, isSlugManuallyEdited, setValue]);

  const { onChange: onSlugChange, ...slugRest } = register('slug');

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const res = await updateService(initialData.id, data);
      if (res.success) {
        addToast({ title: 'Service updated', type: 'success' });
        router.push('/dashboard/services');
      } else {
        addToast({ title: 'Error saving', description: res.error, type: 'error' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Core details about this service.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <p className="font-medium text-slate-900">Visibility</p>
              <p className="text-sm text-slate-500">Show this service on the live website</p>
            </div>
            <Toggle 
              checked={watch('is_active')} 
              onChange={(e) => setValue('is_active', e.target.checked, { shouldDirty: true })} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Service Name" error={errors.name?.message} {...register('name')} />
            <Input 
              label="URL Slug" 
              error={errors.slug?.message} 
              {...slugRest} 
              onChange={(e) => {
                setIsSlugManuallyEdited(true);
                onSlugChange(e);
              }}
            />
            <Textarea label="Short Description (Max 160 chars)" error={errors.short_description?.message} {...register('short_description')} className="md:col-span-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Page Content</CardTitle>
          <CardDescription>Write the detailed description using the rich text editor.</CardDescription>
        </CardHeader>
        <CardContent>
          <BlockNoteEditor 
            initialContent={initialData.page_content} 
            onChange={(content) => setValue('page_content', content, { shouldDirty: true })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO & Search Visibility</CardTitle>
          <CardDescription>Optimize how this page appears on Google.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input label="Focus Keyword" error={errors.focus_keyword?.message} {...register('focus_keyword')} />
          <Input label="SEO Title (Max 70 chars)" error={errors.seo_title?.message} {...register('seo_title')} />
          <Textarea label="SEO Description (Max 160 chars)" error={errors.seo_description?.message} {...register('seo_description')} />
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <p className="font-medium text-slate-900">Hide from Search Engines (Noindex)</p>
              <p className="text-sm text-slate-500">Prevent Google from indexing this page</p>
            </div>
            <Toggle 
              checked={watch('noindex')} 
              onChange={(e) => setValue('noindex', e.target.checked, { shouldDirty: true })} 
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4 pb-12">
        <Button type="submit" isLoading={isPending} size="lg">
          Save Service
        </Button>
      </div>
    </form>
  );
}
