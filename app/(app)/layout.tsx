import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cb-layout">
      <Sidebar />
      <div className="cb-main">
        <Topbar />
        <main className="cb-content animate-up">{children}</main>
      </div>
    </div>
  )
}
