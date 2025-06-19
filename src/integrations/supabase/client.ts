import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lxohxewitissdhgzhjtj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4b2h4ZXdpdGlzc2RoZ3poanRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjgxNDIsImV4cCI6MjA1ODk0NDE0Mn0.M_pbKwpvfVvR_KfpLllVJRaZySPSTEbWQy84EUqSdqs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);