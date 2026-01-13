import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yxnzzmvyyhdjsawovqlt.supabase.co';
const supabaseKey = 'sb_publishable_jdVP3P2ClAe1TK1_fzRaQQ_LD6sUMO-';

export const supabase = createClient(supabaseUrl, supabaseKey);
