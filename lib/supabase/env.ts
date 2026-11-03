function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env.local and fill in your Supabase credentials.`);
  }
  return value;
}

export function getSupabasePublicEnv() {
  return {
    url: requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: requiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  };
}
