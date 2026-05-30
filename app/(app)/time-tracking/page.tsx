"use client"
import { useState } from "react"
import { TIME_ENTRIES, getEmployee, fullName, initials, statusBadge, fmtDate } from "@/lib/data"
import { CheckCircle2, Clock, Download } from "lucide-react"

export default function TimeTracking() {
  const [entries,setEntries] = useState(TIME_ENTRIES)
  const approve = (id:string) => setEntries(prev=>prev.map(t=>t.id===id?{...t,status:"approved" as const}:t))
  const pending = entries.filter(t=>t.status==="pending").length
  const totalHours = entries.reduce((a,t)=>a+t.hours,0).toFixed(1)

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div>
          <div className="page-title">Time tracking</div>
          <div className="page-sub">Timesheets pulled from Connecteam · Pay period: May 25 – 31, 2026</div>
        </div>
        <button className="btn"><Download size={14}/>Export CSV</button>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
        {[
          {label:"Total hours",value:totalHours,color:"#1B2B4B"},
          {label:"Entries",value:entries.length,color:"#1d4ed8"},
          {label:"Pending approval",value:pending,color:"#b45309"},
          {label:"Approved",value:entries.length-pending,color:"#15803d"},
        ].map(k=>(
          <div key={k.label} className="kpi-card">
            <div className="kpi-value" style={{color:k.color}}>{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid #e8ecf4",display:"flex",gap:10}}>
          <span style={{fontWeight:600,fontSize:14,color:"#1B2B4B"}}>All time entries</span>
          <span className="badge badge-amber" style={{marginLeft:4}}>{pending} pending</span>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Employee</th><th>Date</th><th>Clock in</th><th>Clock out</th><th>Hours</th><th>CT Account</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {entries.map(t=>{
              const emp = getEmployee(t.employeeId)
              if(!emp) return null
              return (
                <tr key={t.id}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <div className="avatar" style={{width:28,height:28,fontSize:10}}>{initials(emp)}</div>
                      <span style={{fontSize:13,fontWeight:500}}>{fullName(emp)}</span>
                    </div>
                  </td>
                  <td style={{fontSize:13}}>{fmtDate(t.date)}</td>
                  <td style={{fontSize:13,fontFamily:"monospace"}}>{t.clockIn}</td>
                  <td style={{fontSize:13,fontFamily:"monospace"}}>{t.clockOut}</td>
                  <td style={{fontSize:13,fontWeight:700,color:"#1B2B4B"}}>{t.hours.toFixed(1)} hrs</td>
                  <td><span className={`badge ${t.connecteamAccount===1?"badge-blue":"badge-purple"}`}>CT {t.connecteamAccount}</span></td>
                  <td><span className={`badge ${statusBadge(t.status)}`}>{t.status}</span></td>
                  <td>
                    {t.status==="pending"?(
                      <button onClick={()=>approve(t.id)} className="btn btn-sm btn-primary" style={{gap:5}}>
                        <CheckCircle2 size={12}/>Approve
                      </button>
                    ):(
                      <span style={{fontSize:12,color:"#16a34a",fontWeight:500}}>✓ Approved</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
