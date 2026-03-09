import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://ymmguoxdmvphexggnypo.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWd1b3hkbXZwaGV4Z2dueXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjIwNTk0NCwiZXhwIjoyMDg3NzgxOTQ0fQ.MEFCqig2lv44Lsajuh-2Vi2VAEQDj-21YLOEdVS7cYU';

export const supabase = createClient(supabaseUrl, supabaseKey);
