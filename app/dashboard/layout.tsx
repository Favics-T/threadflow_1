import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <Sidebar />
      {/* ml-64 clears sidebar width, pt-20 clears topnav height (h-20) */}
      <main className="ml-64 pt-20">
        {children}
      </main>
    </div>
  );
}