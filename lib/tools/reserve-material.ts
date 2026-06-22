import { createServerClient } from '@/lib/supabase/server'

export async function reserveMaterial(fabricId: string, yardsRequired: number) {
  const supabase = createServerClient()

  const { data: fabric, error: fetchError } = await supabase
    .from('fabric_inventory')
    .select('id, material_name, yards_available')
    .eq('id', fabricId)
    .single()

  if (fetchError || !fabric) {
    return { error: 'Fabric not found' }
  }

  if (fabric.yards_available < yardsRequired) {
    return {
      error: 'Insufficient stock',
      shortfall: yardsRequired - fabric.yards_available,
      material_name: fabric.material_name,
      yards_available: fabric.yards_available,
      yards_required: yardsRequired
    }
  }

  const newYardage = fabric.yards_available - yardsRequired

  const { error: updateError } = await supabase
    .from('fabric_inventory')
    .update({ yards_available: newYardage })
    .eq('id', fabricId)

  if (updateError) {
    return { error: updateError.message }
  }

  return {
    success: true,
    material_name: fabric.material_name,
    yards_reserved: yardsRequired,
    yards_remaining: newYardage
  }
}