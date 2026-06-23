import Link from "next/link";
import { ApprovalGate } from "@/components/dashboard/ApprovalGate";
import {Sparkle,ConciergeBell,CirclePile,Shirt,MessageSquareDot,ArrowRight,GlobeCheck  } from 'lucide-react'
import { MorningBriefWidget } from '@/components/dashboard/MorningBriefWidget'

// ── Stat card 
function StatCard({
  label,
  value,
  sub,
  subVariant = "default",
  icon,
}: {
  label: string;
  value: string | number;
  sub: string;
  subVariant?: "default" | "danger" | "success";
  icon: React.ReactNode;
}) {
  const subColor =
    subVariant === "danger"
      ? "text-error"
      : subVariant === "success"
      ? "text-tertiary"
      : "text-on-surface-variant";

  return (
    <div className="border border-outline-variant bg-surface-container-lowest p-6 flex flex-col gap-4 hover:border-primary transition-colors cursor-default">
      <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>
      <div>
        <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest mb-3">
          {label}
        </p>
        <p className="font-headline-lg text-headline-lg text-primary">{value}</p>
        <p className={`text-body-sm font-body-sm mt-1 ${subColor}`}>{sub}</p>
      </div>
    </div>
  );
}

// ── Seed data 
const orders = [
  {
    id: "1",
    client: "Adaeze Okonkwo",
    initials: "AO",
    fabric: "Ankara Print — Royal Blue",
    tailor: "Tunde Bakare",
    load: "low" as const,
    status: "in_progress" as const,
    delivery: "Jun 28",
  },
  {
    id: "2",
    client: "Chiamaka Eze",
    initials: "CE",
    fabric: "Silk Charmeuse — Ivory",
    tailor: "Grace Effiong",
    load: "high" as const,
    status: "blocked" as const,
    delivery: "—",
  },
];

const statusStyle: Record<string, string> = {
  in_progress: "bg-primary-fixed text-on-primary-fixed-variant",
  pending:     "bg-surface-container text-on-surface-variant",
  blocked:     "bg-error-container text-on-error-container",
  completed:   "bg-tertiary-fixed text-on-tertiary-fixed-variant",
};

const statusLabel: Record<string, string> = {
  in_progress: "IN PROGRESS",
  pending:     "PENDING",
  blocked:     "BLOCKED",
  completed:   "COMPLETED",
};

const loadDot: Record<string, string> = {
  low:    "bg-[#10B981]",
  medium: "bg-amber-400",
  high:   "bg-red-500",
};

const activity = [
  { id: "1", icon: "check_circle",  text: "Delivery estimate calculated for Adaeze",  time: "2 min ago",  color: "text-tertiary" },
  { id: "2", icon: "warning",       text: "Fabric shortage flagged — Silk Charmeuse", time: "5 min ago",  color: "text-error"   },
  { id: "3", icon: "edit_note",     text: "Client reply drafted for Adaeze",          time: "6 min ago",  color: "text-primary" },
];

// ── Page
export default function DashboardPage() {
  const date = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
        <Link
          href="/agent"
          className="flex items-center gap-2 bg-primary text-on-primary px-8 py-3 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-lg"><Sparkle /></span>
          ASK AI AGENT
        </Link>
      </header>

      <MorningBriefWidget />

      

      {/* Stat cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard label="Active Orders"    value={2} sub="1 in progress · 1 pending" icon= {<ConciergeBell /> }     />
        <StatCard label="Fabric Alerts"    value={1} sub="Silk Charmeuse low"         icon={<Shirt />}     subVariant="danger"  />
        <StatCard label="Tailor Load"      value={3} sub="1 tailor available"         icon={<CirclePile />}          subVariant="success" />
        <StatCard label="Pending Replies"  value={1} sub="Awaiting your approval"     icon={<MessageSquareDot />} />
      </section>

      {/* Main grid */}
      <section className="grid grid-cols-12 gap-6">

        {/* Orders table — col 8 */}
        <div className="col-span-8 border border-outline-variant bg-surface-container-lowest">

          {/* Card header */}
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
              <span className="material-symbols-outlined text-sm"><ArrowRight /></span>
            </Link>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant">
                {["Client", "Fabric", "Tailor", "Status", "Delivery", ""].map((h) => (
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
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-surface-container-low transition-colors">

                  {/* Client */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-surface-container flex items-center justify-center flex-shrink-0">
                        <span className="text-label-caps font-label-caps text-primary">
                          {o.initials}
                        </span>
                      </div>
                      <span className="text-body-sm font-body-sm font-semibold text-primary">
                        {o.client}
                      </span>
                    </div>
                  </td>

                  {/* Fabric */}
                  <td className="px-6 py-5 text-body-sm font-body-sm text-on-surface-variant">
                    {o.fabric}
                  </td>

                  {/* Tailor */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${loadDot[o.load]}`} />
                      {o.tailor}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span className={`inline-block px-3 py-1 text-label-caps font-label-caps ${statusStyle[o.status]}`}>
                      {statusLabel[o.status]}
                    </span>
                  </td>

                  {/* Delivery */}
                  <td className={`px-6 py-5 text-data-mono font-data-mono ${o.status === "blocked" ? "text-on-error-container" : "text-on-surface-variant"}`}>
                    {o.delivery}
                  </td>

                  {/* AI action */}
                  <td className="px-6 py-5">
                    <Link
                      href={`/agent?order=${o.id}`}
                      className="flex items-center gap-1 text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[10px] block">Ask AI</span>
                     <span>
                      
                      </span> 
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right col — col 4 */}
        <div className="col-span-4 flex flex-col gap-6">

          {/* AI Activity */}
          <div className="border border-outline-variant bg-surface-container-lowest">
            <div className="flex items-center justify-between px-6 py-6 border-b border-outline-variant">
              <div>
                <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
                  <GlobeCheck />
                </span>
                <h2 className="font-headline-md text-headline-md text-primary mt-0.5">
                  AI Activity
                </h2>
              </div>
              <Link
                href="/agent"
                className="flex items-center gap-1 text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors"
              >
                VIEW ALL
                <span className="material-symbols-outlined text-sm"><ArrowRight /></span>
              </Link>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              {activity.map((item) => (
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
  );
}