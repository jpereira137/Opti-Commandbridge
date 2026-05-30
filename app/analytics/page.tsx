"use client"
import { EMPLOYEES, TIME_ENTRIES, PTO_REQUESTS, REVIEWS } from "@/lib/data"

function Bar({ label, value, max, color }: { label:string; value:number; max:number; color:string }) {
  const pct = Math.round((value/max)*100)
  return (
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:13,color:"#1B2B4B"}}>{label}</span>
        <span style={{fontSize:13,fontWeight:600,color:"#1B2B4B"}}>{value}</span>
      </div>
      <div style={{height:8,background:"#f1f5f9",borderRadius:4,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:4,transition:"width .5s ease"}}/>
      </div>
    </div>
  )
}

export default function Analytics() {
  const byDept = ["Operations","HR","Support","Finance"].map(d=>({
    dept:d, count:EMPLOYEES.filter(e=>e.department===d&&e.status==="active").length
  }))
  const byType = ["Full-time salaried","Full-time hourly","Part-time hourly","Seasonal"].map(t=>({
    type:t.replace("Full-time ","FT ").replace("Part-time ","PT "),
    count:EMPLOYEES.filter(e=>e.employmentType===t).length
  }))
  const ct1 = EMPLOYEES.filter(e=>e.connecteamAccount===1&&e.status==="active").length
  const ct2 = EMPLOYEES.filter(e=>e.connecteamAccount===2&&e.status==="active").length
  const avgRating = (REVIEWS.filter(r=>r.overallRating>0).reduce((a,r)=>a+r.overallRating,0)/REVIEWS.filter(r=>r.overallRating>0).length).toFixed(1)
  const ptoUsed = PTO_REQUESTS.filter(p=>p.status==="approved").reduce((a,p)=>a+p.days,0)
  const totalHours = TIME_ENTRIES.reduce((a,t)=>a+t.hours,0)

  return (
    <div>
      <div style={{marginBottom:"1.5rem"}}>
        <div className="page-title">Analytics & reporting</div>
        <div className="page-sub">Workforce insights across all departments and Connecteam accounts</div>
      </div>

      <div className="kpi-grid">
        {[
          {label:"Total headcount",value:EMPLOYEES.length,sub:"Active + onboarding"},
          {label:"Active employees",value:EMPLOYEES.filter(e=>e.status==="active").length,sub:"Currently working"},
          {label:"Avg performance",value:avgRating+"/5",sub:"Q1 2026 reviews"},
          {label:"PTO days used",value:ptoUsed,sub:"Approved requests"},
          {label:"Hours tracked",value:totalHours.toFixed(0),sub:"This pay period"},
          {label:"Pending approvals",value:TIME_ENTRIES.filter(t=>t.status==="pending").length+PTO_REQUESTS.filter(p=>p.status==="pending").length,sub:"Time + PTO"},
        ].map(k=>(
          <div key={k.label} className="kpi-card">
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
            <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
        <div className="card">
          <div className="card-title" style={{marginBottom:16}}>Headcount by department</div>
          {byDept.map(d=><Bar key={d.dept} label={d.dept} value={d.count} max={6} color="#1B2B4B"/>)}
        </div>
        <div className="card">
          <div className="card-title" style={{marginBottom:16}}>Employment type breakdown</div>
          {byType.map(t=><Bar key={t.type} label={t.type} value={t.count} max={6} color="#C0392B"/>)}
        </div>
        <div className="card">
          <div className="card-title" style={{marginBottom:16}}>Connecteam distribution</div>
          <Bar label="Account 1 — Operations" value={ct1} max={10} color="#1d4ed8"/>
          <Bar label="Account 2 — HR/Support/Finance" value={ct2} max={10} color="#6d28d9"/>
          <div style={{marginTop:16,padding:"12px",background:"#f8fafc",borderRadius:8}}>
            <div style={{fontSize:12,color:"#64748b",marginBottom:8,fontWeight:600}}>PTO by type</div>
            {["vacation","sick","personal","bereavement"].map(t=>(
              <Bar key={t} label={t.charAt(0).toUpperCase()+t.slice(1)} value={PTO_REQUESTS.filter(p=>p.type===t as "vacation").reduce((a,p)=>a+p.days,0)} max={10} color="#16a34a"/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
