import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lsoexglirbkcfzmbysmd.supabase.co';
const supabaseKey = 'sb_publishable_JA1dAQviBLI6fEdqzIYaMw_GH3hsL-p';

export const supabase = createClient(supabaseUrl, supabaseKey);