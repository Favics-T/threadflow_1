export type MeasurementValue = string | number | boolean | null

export type MeasurementMap = Record<string, MeasurementValue>

export type ClientOrder = {
  id: string
  status: string | null
  yards_required: number | null
  delivery_estimate: string | null
  created_at: string | null
  garment_type: string | null
  image_url: string | null
  notes: string | null
  fabric_inventory: {
    material_name: string | null
    yards_available?: number | null
  } | null
  tailors: {
    name: string | null
    current_load_hours?: number | null
  } | null
}

export type StudioClient = {
  id: string
  name: string
  phone: string | null
  measurements: MeasurementMap | null
  created_at: string | null
  orders: ClientOrder[]
}
