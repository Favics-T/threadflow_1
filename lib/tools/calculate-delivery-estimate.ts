import { checkOrderInputs } from './check-order-input'
import { getTailorWorkload } from './get-tailor-workload'

function addDays(date: Date, days: number): string {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result.toDateString()
}

function assessRisk(loadHours: number): 'low' | 'medium' | 'high' {
  if (loadHours <= 8) return 'low'
  if (loadHours <= 15) return 'medium'
  return 'high'
}

function baseDaysFromMeasurements(measurements: Record<string, number>): number {
  // More measurements = more complex garment = more days
  const complexity = Object.keys(measurements).length
  if (complexity <= 3) return 3
  if (complexity <= 6) return 5
  return 7
}

export async function calculateDeliveryEstimate(orderId: string) {
  // Step 1 — pull the full order picture
  const orderData = await checkOrderInputs(orderId)

  if ('error' in orderData) {
    return { error: orderData.error }
  }

  // Step 2 — pull live tailor workload
  const workloadData = await getTailorWorkload()

  if ('error' in workloadData) {
    return { error: workloadData.error }
  }

  const { fabric, tailor, client } = orderData

  // Step 3 — fabric gate: if stock is insufficient, block immediately
  if (!fabric.sufficient) {
    return {
      status: 'blocked',
      reason: `Cannot proceed. ${fabric.material_name} is short by ${fabric.shortfall} yards. Only ${fabric.yards_available} yards available, ${fabric.yards_required} required.`,
      recommendation: 'Restock fabric before scheduling this order.'
    }
  }

  // Step 4 — assess tailor risk
  const risk = assessRisk(tailor.current_load_hours)

  // Step 5 — calculate base days from garment complexity
  const baseDays = baseDaysFromMeasurements(client.measurements)

  // Step 6 — add buffer based on tailor load
  const loadBuffer = risk === 'low' ? 0 : risk === 'medium' ? 2 : 5
  const totalDays = baseDays + loadBuffer

  // Step 7 — build the estimate with visible reasoning
  const estimatedDate = addDays(new Date(), totalDays)

  const reasoning: string[] = [
    `Fabric check: ${fabric.material_name} — ${fabric.yards_available} yards available, ${fabric.yards_required} required. Sufficient.`,
    `Garment complexity: ${Object.keys(client.measurements).length} measurements on file. Base production time: ${baseDays} days.`,
    `Tailor: ${tailor.name} is currently at ${tailor.current_load_hours} load hours (${risk} workload). Buffer added: ${loadBuffer} days.`,
    `Total estimated days: ${totalDays}. Target delivery: ${estimatedDate}.`
  ]

  return {
    status: risk === 'high' ? 'at_risk' : 'on_track',
    order_id: orderId,
    client: client.name,
    tailor: tailor.name,
    estimated_delivery: estimatedDate,
    total_days: totalDays,
    reasoning
  }
}