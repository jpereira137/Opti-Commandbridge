"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard,Users,UserPlus,CalendarDays,Clock,Umbrella,Star,FolderOpen,Megaphone,BarChart3,Zap,Settings,LogOut,ChevronRight } from "lucide-react"

const NAV = [
  {section:"Overview"},
  {href:"/dashboard",icon:LayoutDashboard,label:"Dashboard"},
  {section:"People"},
  {href:"/directory",icon:Users,label:"Employee directory"},
  {href:"/onboarding",icon:UserPlus,label:"Payroll onboarding"},
  {section:"Workforce"},
  {href:"/scheduling",icon:CalendarDays,label:"Scheduling"},
  {href:"/time-tracking",icon:Clock,label:"Time tracking"},
  {href:"/pto",icon:Umbrella,label:"PTO & leave"},
  {section:"HR"},
  {href:"/performance",icon:Star,label:"Performance"},
  {href:"/documents",icon:FolderOpen,label:"Documents"},
  {href:"/announcements",icon:Megaphone,label:"Announcements"},
  {section:"Insights"},
  {href:"/analytics",icon:BarChart3,label:"Analytics"},
  {href:"/connecteam",icon:Zap,label:"Connecteam"},
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <nav className="cb-sidebar">
      <div style={{padding:"20px 20px 16px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:"#C0392B",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>📱</div>
          <div>
            <div style={{color:"#fff",fontWeight:700,fontSize:14,lineHeight:1.2}}>OptiSolutions</div>
            <div style={{color:"rgba(255,255,255,0.45)",fontSize:11,fontWeight:500}}>CommandBridge</div>
          </div>
        </div>
      </div>
      <div style={{flex:1,paddingBottom:16}}>
        {NAV.map((item,i) => {
          if("section" in item) return <div key={i} className="nav-section">{item.section}</div>
          const Icon = item.icon
          const active = path===item.href||path.startsWith(item.href+"/")
          return (
            <Link key={item.href} href={item.href} className={`nav-item${active?" active":""}`}>
              <Icon size={16} strokeWidth={1.8}/>
              <span style={{flex:1}}>{item.label}</span>
              {active&&<ChevronRight size={13} style={{opacity:.5}}/>}
            </Link>
          )
        })}
      </div>
      <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",padding:"8px 0"}}>
        <Link href="/admin" className="nav-item"><Settings size={16} strokeWidth={1.8}/>Settings</Link>
        <button className="nav-item" style={{width:"100%",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}><LogOut size={16} strokeWidth={1.8}/>Sign out</button>
      </div>
      <div style={{margin:"0 12px 12px",background:"rgba(255,255,255,0.06)",borderRadius:8,padding:"8px 10px",fontSize:11,color:"rgba(255,255,255,0.4)"}}>
        <div style={{color:"rgba(255,255,255,0.7)",fontWeight:600,marginBottom:2}}>Owner access</div>
        <div>All modules visible</div>
      </div>
    </nav>
  )
}
