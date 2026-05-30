"use client"
import { useState } from "react"
import { PTO_REQUESTS, getEmployee, fullName, initials, statusBadge, fmtDate } from "@/lib/data"
import { CheckCircle2, XCircle, Plus, Umbrella } from "lucide-react"

const TYPE_COLORS: Record<string,string> = { vacation:"badge-blue", sick:"badge-amber", personal:"badge-navy", bereavement:"badge-purple" }

export default function PTO() {
  const [requests,setRequests] = useState(PTO_REQUESTS)
  const [filter,setFilter] = useState("all")

  const updateStatus = (id:string, status:"approved"|"denied") =>
    setRequests(prev=>prev.map(p=>p.id===id?{...p,status}:p))

  const filtered = filter==="all"?requests:requests.filter(p=>p.status===filter)

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div>
          <div className="page-title">PTO & leave</div>
          <div className="page-sub">Manage time-off requests for all employees</div>
        </div>
        <button className="btn btn-primary"><Plus size={14}/>New request</button>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
        {[
          {label:"All requests",value:requests.length,color:"#1B2B4B"},
          {label:"Pending",value:requests.filter(p=>p.status==="pending").length,color:"#b45309"},
          {label:"Approved",value:requests.filter(p=>p.status==="approved").length,color:"#15803d"},
          {label:"Denied",value:requests.filter(p=>p.status==="denied").length,color:"#C0392B"},
        ].map(k=>(
          <div key={k.label} className="kpi-card">
            <div className="kpi-value" style={{color:k.color}}>{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {["all","pending","approved","denied"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className="btn btn-sm" style={{background:filter===f?"#1B2B4B":"#fff",color:filter===f?"#fff":"#1B2B4B",textTransform:"capitalize"}}>{f}</button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(p=>{
          const emp = getEmployee(p.employeeId)
          if(!emp) return null
          return (
            <div key={p.id} className="card" style={{display:"flex",alignItems:"center",gap:14}}>
              <div className="avatar" style={{width:40,height:40}}>{initials(emp)}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontSize:14,fontWeight:600,color:"#1B2B4B"}}>{fullName(emp)}</span>
                  <span className={`badge ${TYPE_COLORS[p.type]||"badge-gray"}`}>{p.type}</span>
                  <span className={`badge ${statusBadge(p.status)}`}>{p.status}</span>
                </div>
                <div style={{fontSize:12,color:"#64748b"}}>
                  {fmtDate(p.startDate)} → {fmtDate(p.endDate)} · {p.days} day{p.days>1?"s":""} · Submitted {fmtDate(p.submittedDate)}
                  {p.note&&<span> · &quot;{p.note}&quot;</span>}
                </div>
              </div>
              {p.status==="pending"&&(
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>updateStatus(p.id,"approved")} className="btn btn-sm btn-primary"><CheckCircle2 size={13}/>Approve</button>
                  <button onClick={()=>updateStatus(p.id,"denied")} className="btn btn-sm btn-red"><XCircle size={13}/>Deny</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
