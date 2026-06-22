import { createServerClient } from '@/lib/supabase/server'

export async function checkOrderInputs(orderId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      yards_required,
      delivery_estimate,
      created_at,
      clients (
        name,
        measurements
      ),
      fabric_inventory (
        id,
        material_name,
        yards_available
      ),
      tailors (
        id,
        name,
        current_load_hours
      )
    `)
    .eq('id', orderId)
    .single()

  console.log('data:', JSON.stringify(data, null, 2))
  console.log('error:', JSON.stringify(error, null, 2))
  console.log('orderId received:', orderId)

  if (error || !data) {
    return { error: `Order not found` }
  }

  console.log('data:', JSON.stringify(data, null, 2))
  console.log('error:', error)


 const fabric = data.fabric_inventory as unknown as {
    id: string
    material_name: string
    yards_available: number
  } | null

  const tailor = data.tailors as unknown as {
    id: string
    name: string
    current_load_hours: number
  } | null

  const client = data.clients as unknown as {
    name: string
    measurements: Record<string, number>
  } | null

  if (!fabric || !tailor || !client) {
    return { error: 'Order is missing linked fabric, tailor, or client data' }
  }

  const fabricSufficient = fabric.yards_available >= data.yards_required
  const shortfall = fabricSufficient
    ? 0
    : data.yards_required - fabric.yards_available

  return {
    order_id: data.id,
    status: data.status,
    client: {
      name: client.name,
      measurements: client.measurements
    },
    fabric: {
      id: fabric.id,
      material_name: fabric.material_name,
      yards_available: fabric.yards_available,
      yards_required: data.yards_required,
      sufficient: fabricSufficient,
      shortfall: shortfall
    },
    tailor: {
      id: tailor.id,
      name: tailor.name,
      current_load_hours: tailor.current_load_hours
    }
  }


}