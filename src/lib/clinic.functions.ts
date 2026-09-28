import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

export const getPublicClinic = createServerFn({ method: 'GET' })
  .inputValidator((input: unknown) => z.string().min(1).max(120).regex(/^[a-z0-9-]+$/).parse(input))
  .handler(async ({ data }) => {
    const { createClient } = await import('@supabase/supabase-js');
    const url = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) throw new Error('Clinic data is unavailable');
    const client = createClient(url, key, { auth: { persistSession: false } });
    const { data: clinic, error } = await client.from('clinics').select('*').eq('slug', data).maybeSingle();
    if (error) throw new Error('Could not load this practice');
    return clinic;
  });
