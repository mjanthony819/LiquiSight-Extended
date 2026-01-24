import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null
let initAttempted = false

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance
  if (initAttempted) return null

  initAttempted = true

  const supabaseUrlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKeyRaw = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const stripOuterQuotes = (value: string) => {
    const trimmed = value.trim()
    if (trimmed.length >= 2) {
      const first = trimmed[0]
      const last = trimmed[trimmed.length - 1]
      if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
        return trimmed.slice(1, -1).trim()
      }
    }
    return trimmed
  }

  const supabaseUrl = stripOuterQuotes(supabaseUrlRaw ?? '')
  const supabaseAnonKey = stripOuterQuotes(supabaseAnonKeyRaw ?? '')

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Using local-only mode.')
    return null
  }

  // Avoid Supabase SDK throwing a runtime error if the URL is malformed.
  try {
    const parsed = new URL(supabaseUrl)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      console.warn('Supabase URL must be http(s). Using local-only mode.')
      return null
    }
  } catch {
    console.warn('Supabase URL is invalid. Using local-only mode.')
    return null
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    return supabaseInstance
  } catch (error) {
    // Keep this as a warning to avoid Next.js dev overlay spam.
    console.warn('Failed to initialize Supabase. Using local-only mode.')
    return null
  }
}

export const supabase = {
  from: (table: string) => {
    const client = getSupabase()
    if (!client) {
      // Return safe no-op methods for local-only mode
      return {
        select: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } })
          }),
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
          })
        }),
        delete: () => ({
          eq: () => ({
            select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' }, count: 0 })
          })
        }),
      }
    }
    return client.from(table)
  }
}
