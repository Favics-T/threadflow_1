import { createServerClient } from '@/lib/supabase/server'

export async function getTailorWorkload() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('tailors')
    .select('id, name, current_load_hours')
    .order('current_load_hours', { ascending: true })

  if (error) {
    return { error: error.message }
  }

  if (!data || data.length === 0) {
    return { error: 'No tailors found' }
  }

  return {
    tailors: data,
    lightest: data[0]
  }
}