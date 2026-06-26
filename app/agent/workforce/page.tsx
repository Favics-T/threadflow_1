import { createServerClient } from '@/lib/supabase/server'
import  WorkforceClient  from '@/components/workforce/WorkforceClient'
import { mockPastAssignments, mockProductionOrders, mockStaff } from '@/lib/mock/conversations'

export const metadata = {
  title: 'Workforce | ThreadFlow AI',
}

export default async function WorkforcePage() {
  let tailors: { id: string; name: string; current_load_hours: number }[] | null = null

  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('tailors')
      .select('id, name, current_load_hours')
      .order('current_load_hours', { ascending: true })
    tailors = data
  } catch {
    // Supabase unreachable or misconfigured — fall back to empty list
  }

  // Orders that are confirmed but not yet assigned — need tailor assignment
  const pendingAssignment = mockProductionOrders.filter(
    (o) => o.productionStatus === 'confirmed'
  )

  return (
    <WorkforceClient
      tailors={tailors ?? []}
    
      pendingAssignment={pendingAssignment}
      pastAssignments={mockPastAssignments}
    />
  )
}