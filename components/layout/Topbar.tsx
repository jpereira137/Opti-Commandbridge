"use client"
import { Bell, Search, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"

const TITLES: Record<string,string> = {
  "/dashboard":"Dashboard","/directory":"Employee directory",
  "/onboarding":"Payroll onboarding","/scheduling":"Scheduling",
  "/time-tracking":"Time tracking","/pto":"PTO & leave",
  "/performance":"Performance","/documents":"Documents",
  "/announcements":"Announcements","/analytics":"Analytics","/connecteam":"Connecteam",
}

export default function Topbar() {
  const path = usePathname()
  const title = TITLES[path] || "CommandBridge"
  return (
    <header className="cb-topbar">
      <div style={{flex:1}}>
        <span style={{fontWeight:600,fontSize:16,color:"#1B2B4B"}}>{title}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8,background:"#f4f6fa",borderRadius:8,padding:"6px 12px",border:"1px solid #e8ecf4"}}>
          <Search size={14} color="#94a3b8"/>
          <input placeholder="Search..." style={{border:"none",background:"none",fontSize:13,color:"#1B2B4B",outline:"none",width:160}} />
        </div>
        <button style={{position:"relative",background:"none",border:"none",cursor:"pointer",padding:6}}>
          <Bell size={18} color="#64748b"/>
          <span style={{position:"absolute",top:4,right:4,width:7,height:7,borderRadius:"50%",background:"#C0392B",border:"2px solid #fff"}}/>
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"4px 8px",borderRadius:8,border:"1px solid #e8ecf4"}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:"#1B2B4B",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>JR</div>
          <span style={{fontSize:13,fontWeight:500,color:"#1B2B4B"}}>Jasmine R.</span>
          <ChevronDown size={13} color="#94a3b8"/>
        </div>
      </div>
    </header>
  )
}
