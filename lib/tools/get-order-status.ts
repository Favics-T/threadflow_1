import { createServerClient } from '@/lib/supabase/server'

export async function getOrderStatus(clientId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      yards_required,
      delivery_estimate,
      created_at,
      fabric_inventory (
        material_name,
        yards_available
      ),
      tailors (
        name,
        current_load_hours
      )
    `)
    .eq('client_id', clientId)

  if (error) {
    return { error: error.message }
  }

  if (!data || data.length === 0) {
    return { error: 'No orders found for this client' }
  }

  return { orders: data }
}