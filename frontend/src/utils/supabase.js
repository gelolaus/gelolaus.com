import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

function createSupabaseClient() {
  if (supabaseUrl && supabaseKey) {
    return createClient(supabaseUrl, supabaseKey)
  }
  const noop = {
    from() {
      return {
        select() {
          return {
            eq() {
              return {
                single() {
                  return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
                }
              }
            }
          }
        },
        insert() {
          return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        }
      }
    }
  }
  return noop
}

export const supabase = createSupabaseClient()
