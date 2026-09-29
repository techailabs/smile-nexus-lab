import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
const Schema=z.object({clinic_slug:z.string().regex(/^[a-z0-9-]{1,120}$/),full_name:z.string().trim().min(1).max(120),email:z.string().email().max(200),phone:z.string().max(40).nullish(),age_range:z.string().max(40).nullish(),concerns:z.array(z.string().max(60)).max(20),smile_goal:z.string().max(400).nullish(),notes:z.string().max(2000).nullish()});
export const submitSmileCheck=createServerFn({method:'POST'}).inputValidator((data:unknown)=>Schema.parse(data)).handler(async ({data})=>{
 const url=process.env['SUPABASE_URL'];const key=process.env['SUPABASE_PUBLISHABLE_KEY'];if(!url||!key)throw new Error('Assessment unavailable');
 const db=createClient(url,key,{auth:{persistSession:false}});
 const {data:clinic,error:lookupError}=await db.from('clinics').select('id,clinic_name,services').eq('slug',data.clinic_slug).maybeSingle();if(lookupError||!clinic)throw new Error('Practice not found');
 const summary=`Thank you for sharing your smile goals. ${clinic.clinic_name} can discuss your options with you during a consultation. This summary is general information, not a diagnosis or treatment recommendation. Please contact the practice for a clinical assessment.`;
 const recommended:{title:string;reason:string}[]=[];
 const {error}=await db.from('smile_assessments').insert({clinic_id:clinic.id,clinic_slug:data.clinic_slug,full_name:data.full_name,email:data.email,phone:data.phone??null,age_range:data.age_range??null,concerns:data.concerns,smile_goal:data.smile_goal??null,notes:data.notes??null,ai_summary:summary,recommended_services:recommended});if(error)throw new Error('Could not submit your request. Please contact the practice.');return {summary,recommended};
});
