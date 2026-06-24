import Link from 'next/link'
import { ApprovalGate } from '@/components/dashboard/ApprovalGate'
import { MorningBriefWidget } from '@/components/dashboard/MorningBriefWidget'
import { createClient } from '@/lib/supabase/server'
import { ConciergeBell, Shirt, CirclePile, MessageSquareDot, ArrowRight, GlobeCheck } from 'lucide-react'

// ── Types ───────────────────────────────────────────────────────────────────
type OrderStatus = 'in_progress' | 'pending' | 'blocked' | 'completed'
type TailorLoad = 'low' | 'medium' | 'high'

// ── Data fetching ────────────────────────────────────────────────────────────
async function getDashboardStats() {
  const supabase = createClient()

  const [ordersRes, fabricRes, tailorsRes, activityRes] = await Promise.all([
    supabase.from('orders').select(`
      id, status, delivery_estimate, created_at, yards_required,
      clients ( id, name ),
      tailors ( id, name, current_load_hours ),
      fabric_inventory ( id, material_name, yards_available )
    `),
    supabase.from('fabric_inventory').select('id, material_name, yards_available'),
    supabase.from('tailors').select('id, name, current_load_hours'),
    supabase.from('activity_log').select('id, tool_name, output, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const orders = (ordersRes.data ?? []) as any[]
  const fabrics = fabricRes.data ?? []
  const tailors = tailorsRes.data ?? []
  const activity = activityRes.data ?? []

  const activeOrders = orders.filter((o) => o.status !== 'completed')
  const inProgress = orders.filter((o) => o.status === 'in_progress').length
  const pending = orders.filter((o) => o.status === 'pending').length
  const lowStockFabrics = fabrics.filter((f) => (f.yards_available ?? 0) < 5)
  const availableTailors = tailors.filter((t) => (t.current_load_hours ?? 0) <= 8).length

  return {
    activeOrderCount: activeOrders.length,
    activeOrderSub: `${inProgress} in progress · ${pending} pending`,
    fabricAlertCount: lowStockFabrics.length,
    fabricAlertSub: lowStockFabrics.length > 0
      ? lowStockFabrics.map((f) => f.material_name).join(', ') + ' low'
      : 'All fabrics stocked',
    tailorCount: tailors.length,
    tailorSub: `${availableTailors} tailor${availableTailors !== 1 ? 's' : ''} available`,
    orders,
    tailors,
    activity,
  }
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  subVariant = 'default',
  icon,
}: {
  label: string
  value: string | number
  sub: string
  subVariant?: 'default' | 'danger' | 'success'
  icon: React.ReactNode
}) {
  const subColor =
    subVariant === 'danger'
      ? 'text-error'
      : subVariant === 'success'
      ? 'text-tertiary'
      : 'text-on-surface-variant'

  return (
    <div className="border border-outline-variant bg-surface-container-lowest p-6 flex flex-col gap-4 hover:border-primary transition-colors cursor-default">
      <span className="text-on-surface-variant">{icon}</span>
      <div>
        <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-3">
          {label}
        </p>
        <p className="font-headline-lg text-headline-lg text-primary">{value}</p>
        <p className={`text-body-sm font-body-sm mt-1 ${subColor}`}>{sub}</p>
      </div>
    </div>
  )
}

// ── Status helpers ───────────────────────────────────────────────────────────
const statusStyle: Record<string, string> = {
  in_progress: 'bg-primary-fixed text-on-primary-fixed-variant',
  pending:     'bg-surface-container text-on-surface-variant',
  blocked:     'bg-error-container text-on-error-container',
  completed:   'bg-tertiary-fixed text-on-tertiary-fixed-variant',
}
const statusLabel: Record<string, string> = {
  in_progress: 'IN PROGRESS',
  pending:     'PENDING',
  blocked:     'BLOCKED',
  completed:   'COMPLETED',
}
const loadDot: Record<string, string> = {
  low:    'bg-[#10B981]',
  medium: 'bg-amber-400',
  high:   'bg-red-500',
}

function getTailorLoad(hours: number): TailorLoad {
  if (hours <= 8) return 'low'
  if (hours <= 15) return 'medium'
  return 'high'
}

// ── Activity icon mapping ────────────────────────────────────────────────────
function activityIcon(toolName: string): { icon: string; color: string } {
  if (toolName === 'calculate_delivery_estimate') return { icon: 'check_circle', color: 'text-tertiary' }
  if (toolName === 'flag_low_stock')              return { icon: 'warning',      color: 'text-error'   }
  if (toolName === 'draft_client_reply')          return { icon: 'edit_note',    color: 'text-primary' }
  if (toolName === 'reserve_material')            return { icon: 'inventory',    color: 'text-tertiary' }
  return { icon: 'magic_button', color: 'text-on-surface-variant' }
}

function relativeTime(ts: string): string {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ── Fallback seed activity (shown when activity_log is empty) ────────────────
const seedActivity = [
  { id: 's1', icon: 'check_circle',  text: 'Delivery estimate calculated for Adaeze',  time: '2 min ago',  color: 'text-tertiary' },
  { id: 's2', icon: 'warning',       text: 'Fabric shortage flagged — Silk Charmeuse', time: '5 min ago',  color: 'text-error'   },
  { id: 's3', icon: 'edit_note',     text: 'Client reply drafted for Adaeze',          time: '6 min ago',  color: 'text-primary' },
]

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Orders already have nested join objects from the query
  const displayOrders = stats.orders
    .filter((o: any) => o.status !== 'completed')
    .slice(0, 5)

  // Build activity rows
  const activityRows =
    stats.activity.length > 0
      ? stats.activity.map((a: any) => {
          const { icon, color } = activityIcon(a.tool_name)
          // Try to extract a readable description from output
          let text = a.tool_name.replace(/_/g, ' ')
          try {
            const out = typeof a.output === 'string' ? JSON.parse(a.output) : a.output
            if (out?.client)           text = `Delivery estimate for ${out.client}`
            else if (out?.draft_message) text = `Client reply drafted for ${out.client?.name ?? 'client'}`
            else if (Array.isArray(out)) text = `${out.length} low-stock item${out.length !== 1 ? 's' : ''} flagged`
          } catch {}
          return { id: a.id, icon, color, text, time: relativeTime(a.created_at) }
        })
      : seedActivity

  return (
    <main className="px-10 py-10 pb-16">

      {/* Header */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            {date}
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">
            Good morning, Taiwo
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            Live production overview. Monitor orders, fabric stock, and tailor load in real time.
          </p>
        </div>
      </header>

      <MorningBriefWidget />

      {/* Stat cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard
          label="Active Orders"
          value={stats.activeOrderCount}
          sub={stats.activeOrderSub}
          icon={<ConciergeBell size={20} />}
        />
        <StatCard
          label="Fabric Alerts"
          value={stats.fabricAlertCount}
          sub={stats.fabricAlertSub}
          icon={<Shirt size={20} />}
          subVariant={stats.fabricAlertCount > 0 ? 'danger' : 'default'}
        />
        <StatCard
          label="Tailor Load"
          value={stats.tailorCount}
          sub={stats.tailorSub}
          icon={<CirclePile size={20} />}
          subVariant="success"
        />
        <StatCard
          label="Pending Replies"
          value={1}
          sub="Awaiting your approval"
          icon={<MessageSquareDot size={20} />}
        />
      </section>

      {/* Main grid */}
      <section className="grid grid-cols-12 gap-6">

        {/* Orders table — col 8 */}
        <div className="col-span-8 border border-outline-variant bg-surface-container-lowest">
          <div className="flex items-center justify-between px-6 py-6 border-b border-outline-variant">
            <div>
              <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                Production
              </span>
              <h2 className="font-headline-md text-headline-md text-primary mt-0.5">
                Active Orders
              </h2>
            </div>
            <Link
              href="/orders"
              className="flex items-center gap-1 text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors"
            >
              VIEW ALL
              <span className="material-symbols-outlined text-sm"><ArrowRight size={14} /></span>
            </Link>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant">
                {['Client', 'Fabric', 'Tailor', 'Status', 'Delivery', ''].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {displayOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-body-sm font-body-sm text-on-surface-variant text-center">
                    No active orders
                  </td>
                </tr>
              ) : (
                displayOrders.map((o: any) => {
                  const tailor = o.tailors as any
                  const client = o.clients as any
                  const load: TailorLoad = tailor ? getTailorLoad(tailor.current_load_hours ?? 0) : 'low'
                  const clientName: string = client?.name ?? 'Unknown'
                  const initials = clientName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                  const status: OrderStatus = o.status ?? 'pending'

                  return (
                    <tr key={o.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-surface-container flex items-center justify-center shrink-0">
                            <span className="text-label-caps font-label-caps text-primary">{initials}</span>
                          </div>
                          <span className="text-body-sm font-body-sm font-semibold text-primary">
                            {clientName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-body-sm font-body-sm text-on-surface-variant">
                        {(o.fabric_inventory as any)?.material_name ?? '—'}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${loadDot[load]}`} />
                          {tailor?.name ?? 'Unassigned'}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-block px-3 py-1 text-label-caps font-label-caps ${statusStyle[status]}`}>
                          {statusLabel[status]}
                        </span>
                      </td>
                      <td className={`px-6 py-5 text-data-mono font-data-mono ${status === 'blocked' ? 'text-on-error-container' : 'text-on-surface-variant'}`}>
                        {o.delivery_estimate ?? '—'}
                      </td>
                      <td className="px-6 py-5">
                        <Link
                          href={`/agent?order=${o.id}`}
                          className="flex items-center gap-1 text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Right col — col 4 */}
        <div className="col-span-4 flex flex-col gap-6">

          {/* AI Activity */}
          <div className="border border-outline-variant bg-surface-container-lowest">
            <div className="flex items-center justify-between px-6 py-6 border-b border-outline-variant">
              <div>
                <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                  <GlobeCheck size={14} />
                  AI Activity
                </span>
                <h2 className="font-headline-md text-headline-md text-primary mt-0.5">
                  Agent Log
                </h2>
              </div>
              <Link
                href="/agent"
                className="flex items-center gap-1 text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors"
              >
                VIEW ALL
                <span className="material-symbols-outlined text-sm"><ArrowRight size={14} /></span>
              </Link>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              {activityRows.map((item: any) => (
                <div key={item.id} className="flex gap-3">
                  <span className={`material-symbols-outlined text-lg shrink-0 mt-0.5 ${item.color}`}>
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-body-sm font-body-sm text-on-surface leading-snug">
                      {item.text}
                    </p>
                    <p className="text-label-caps font-label-caps text-on-surface-variant mt-1">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approval gate */}
          <ApprovalGate />
        </div>
      </section>
    </main>
  )
}
