import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If env vars are present, create a real client. Otherwise export a small
// mock that implements the methods used by the app to avoid throwing at
// module initialization time (which would result in a blank UI).
function makeMockClient() {
  const chain: any = {
    select: () => chain,
    order: () => chain,
    limit: () => chain,
    maybeSingle: async () => ({ data: null, error: null }),
    eq: () => chain,
    insert: async () => ({ data: null, error: null }),
  };

  return {
    from: (_table: string) => chain,
  };
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : ((): any => {
        // eslint-disable-next-line no-console
        console.warn(
          'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set — using mock supabase client'
        );
        return makeMockClient();
      })();

export interface GameScore {
  id?: string;
  player_name: string;
  score: number;
  coins: number;
  distance: number;
  created_at?: string;
  session_id: string;
}
