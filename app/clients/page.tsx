import { createClient } from '@/lib/supabase/server'
import { ClientsUI } from './ClientsUI'
import type { ClientOrder, StudioClient } from './types'

type SupabaseRelation<T> = T | T[] | null

type SupabaseOrder = Omit<ClientOrder, 'fabric_inventory' | 'tailors'> & {
  fabric_inventory: SupabaseRelation<ClientOrder['fabric_inventory']>
  tailors: SupabaseRelation<ClientOrder['tailors']>
}

type SupabaseClientRow = Omit<StudioClient, 'orders'> & {
  orders: SupabaseOrder[] | null
}

function firstRelation<T>(relation: SupabaseRelation<T>) {
  return Array.isArray(relation) ? relation[0] ?? null : relation
}

export default async function ClientsPage() {
  let data: SupabaseClientRow[] | null = null
  let errorMessage: string | null = null

  try {
    const supabase = createClient()

    const { data: rows, error } = await supabase
      .from('clients')
      .select(`
        id,
        name,
        phone,
        measurements,
        created_at,
        orders (
          id,
          status,
          yards_required,
          delivery_estimate,
          created_at,
          garment_type,
          image_url,
          notes,
          fabric_inventory (
            material_name,
            yards_available
          ),
          tailors (
            name,
            current_load_hours
          )
        )
      `)
      .order('created_at', { ascending: false })

    data = rows as unknown as SupabaseClientRow[] | null
    errorMessage = error?.message ?? null
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Failed to load clients'
  }

  const clients = ((data ?? []) as SupabaseClientRow[]).map((client) => ({
    ...client,
    orders: (client.orders ?? []).map((order) => ({
      ...order,
      fabric_inventory: firstRelation(order.fabric_inventory),
      tailors: firstRelation(order.tailors),
    })),
  }))

  return <ClientsUI clients={clients} error={errorMessage} />
}