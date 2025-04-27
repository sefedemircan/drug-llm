import { createClient } from '@supabase/supabase-js';

// Supabase URL ve API anahtarı buraya eklenmelidir
// Bu değerler .env dosyasından alınmalıdır
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Retry mekanizması için yardımcı fonksiyon
const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
};

// Supabase istemcisini oluştur
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'drug-llm-web'
    }
  }
});

// Supabase işlemlerini retry mekanizması ile sarmalayalım
export const supabaseWithRetry = {
  ...supabase,
  auth: {
    ...supabase.auth,
    signInWithPassword: (credentials) => withRetry(() => supabase.auth.signInWithPassword(credentials)),
    signUp: (credentials) => withRetry(() => supabase.auth.signUp(credentials)),
    signOut: () => withRetry(() => supabase.auth.signOut()),
    getSession: () => withRetry(() => supabase.auth.getSession()),
    onAuthStateChange: (callback) => {
      return supabase.auth.onAuthStateChange((event, session) => {
        try {
          callback(event, session);
        } catch (error) {
          console.error('Auth state change error:', error);
        }
      });
    }
  },
  from: (table) => ({
    ...supabase.from(table),
    select: (...args) => withRetry(() => supabase.from(table).select(...args)),
    insert: (...args) => withRetry(() => supabase.from(table).insert(...args)),
    update: (...args) => withRetry(() => supabase.from(table).update(...args)),
    upsert: (...args) => withRetry(() => supabase.from(table).upsert(...args)),
    delete: (...args) => withRetry(() => supabase.from(table).delete(...args))
  })
};

export { supabase }; 