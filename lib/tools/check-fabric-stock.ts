import { createServerClient } from '@/lib/supabase/server'

export async function checkFabricStock(materialName: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('fabric_inventory')
    .select('id, material_name, yards_available')
    .ilike('material_name', `%${materialName}%`)

  if (error) {
    return { error: error.message }
  }

  if (!data || data.length === 0) {
    return { error: `No fabric found matching "${materialName}"` }
  }

  if (data.length > 1) {
    return {
      ambiguous: true,
      message: `Found ${data.length} fabrics matching "${materialName}". Please clarify:`,
      matches: data.map(f => ({ id: f.id, material_name: f.material_name, yards_available: f.yards_available }))
    }
  }

  return { fabric: data[0] }
}