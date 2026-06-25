import { createServerClient } from '@/lib/supabase/server'
import { WorkforceClient } from '@/components/workforce/WorkforceClient'
import { mockPastAssignments, mockProductionOrders } from '@/lib/mock/conversations'

export const metadata = {
  title: 'Workforce | ThreadFlow AI',
}

export default async function WorkforcePage() {
  const supabase = createServerClient()
  const { data: tailors } = await supabase
    .from('tailors')
    .select('id, name, current_load_hours')
    .order('current_load_hours', { ascending: true })

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