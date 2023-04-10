import {createClient} from '@supabase/supabase-js';
import {Database} from '../supabase';
// require('dotenv-flow').config();
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

export default supabase;
