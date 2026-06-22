import { createServerClient } from '@/lib/supabase/server'

export async function findClient(name: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('clients')
    .select('id, name, phone, measurements')
    .ilike('name', `%${name}%`)

  if (error) {
    return { error: error.message }
  }

  if (!data || data.length === 0) {
    return { error: `No client found matching "${name}"` }
  }

  if (data.length > 1) {
    return {
      ambiguous: true,
      message: `Found ${data.length} clients matching "${name}". Please clarify which one:`,
      matches: data.map(c => ({ id: c.id, name: c.name, phone: c.phone }))
    }
  }

  return { client: data[0] }
}