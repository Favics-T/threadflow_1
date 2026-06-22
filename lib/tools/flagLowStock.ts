import { createServerClient } from '@/lib/supabase/server'

export async function flagLowStock(thresholdYards: number = 5) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('fabric_inventory')
    .select('id, material_name, yards_available')
    .lt('yards_available', thresholdYards)

  if (error) {
    return { error: error.message }
  }

  if (!data || data.length === 0) {
    return { status: 'all_clear', message: 'All fabrics are above the threshold' }
  }

  return {
    status: 'low_stock_detected',
    count: data.length,
    items: data
  }
}