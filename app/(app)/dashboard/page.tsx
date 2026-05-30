"use client"
import { EMPLOYEES, PTO_REQUESTS, TIME_ENTRIES, ANNOUNCEMENTS, SHIFTS, fmtDate, statusBadge, fullName, getEmployee, initials } from "@/lib/data"
import { Users, Clock, Umbrella, UserPlus, TrendingUp, AlertCircle, CheckCircle2, Calendar, Zap } from "lucide-react"

export default function Dashboard() {
  const active = EMPLOYEES.filter(e=>e.status==="active").length
  const onboarding = EMPLOYEES.filter(e=>e.status==="onboarding").length
  const pendingPTO = PTO_REQUESTS.filter(p=>p.status==="pending").length
  const pendingTime = TIME_ENTRIES.filter(t=>t.status==="pending").length
  const todayShifts = SHIFTS.filter(s=>s.date==="2026-05-29").length
  const hoursThisWeek = TIME_ENTRIES.reduce((a,t)=>a+t.hours,0).toFixed(1)
  const pinned = ANNOUNCEMENTS.find(a=>a.pinned)

  return (
    <div>
      <div style={{marginBottom:"1.5rem"}}>
        <div className="page-title">Good morning, Jasmine 👋</div>
        <div className="page-sub">Here&apos;s what&apos;s happening at OptiSolutions today — Friday, May 29, 2026</div>
      </div>

      {/* KPI grid */}
      <div className="kpi-grid">
        {[
          {label:"Active employees",value:active,icon:Users,delta:"+1 this month",up:true,color:"#1B2B4B"},
          {label:"Onboarding",value:onboarding,icon:UserPlus,delta:"In progress",up:true,color:"#b45309"},
          {label:"Shifts today",value:todayShifts,icon:Calendar,delta:"Across 2 accounts",up:true,color:"#1d4ed8"},
          {label:"Hours this week",value:hoursThisWeek,icon:Clock,delta:"Pending approval: "+pendingTime,up:false,color:"#1B2B4B"},
          {label:"PTO requests",value:pendingPTO,icon:Umbrella,delta:"Needs review",up:false,color:"#C0392B"},
        ].map(k=>{
          const Icon = k.icon
          return (
            <div key={k.label} className="kpi-card">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{width:36,height:36,borderRadius:9,background:"#f4f6fa",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon size={18} color={k.color}/>
                </div>
              </div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
              <div className={`kpi-delta ${k.up?"up":"down"}`}>{k.delta}</div>
            </div>
          )
        })}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {/* Connecteam status */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div className="card-title" style={{display:"flex",alignItems:"center",gap:8}}><Zap size={15} color="#C0392B"/> Connecteam status</div>
          </div>
          {[{id:1,dept:"Operations (RI)",emp:EMPLOYEES.filter(e=>e.connecteamAccount===1&&e.status==="active").length,shifts:SHIFTS.filter(s=>s.connecteamAccount===1&&s.date==="2026-05-29").length},{id:2,dept:"HR / Support / Finance (MA)",emp:EMPLOYEES.filter(e=>e.connecteamAccount===2&&e.status==="active").length,shifts:SHIFTS.filter(s=>s.connecteamAccount===2&&s.date==="2026-05-29").length}].map(ct=>(
            <div key={ct.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#16a34a",flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:"#1B2B4B"}}>Account {ct.id} — {ct.dept}</div>
                <div style={{fontSize:12,color:"#64748b"}}>{ct.emp} employees · {ct.shifts} shifts today</div>
              </div>
              <span className="badge badge-green">Live</span>
            </div>
          ))}
        </div>

        {/* Today shifts */}
        <div className="card">
          <div className="card-title" style={{marginBottom:12}}>Shifts today</div>
          {SHIFTS.filter(s=>s.date==="2026-05-29").slice(0,4).map(s=>{
            const emp = getEmployee(s.employeeId)
            if(!emp) return null
            return (
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
                <div className="avatar" style={{width:28,height:28,fontSize:10}}>{initials(emp)}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500,color:"#1B2B4B"}}>{fullName(emp)}</div>
                  <div style={{fontSize:11,color:"#64748b"}}>{s.startTime}–{s.endTime} · {s.location}</div>
                </div>
                <span className={`badge ${statusBadge(s.status)}`}>{s.status}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {/* Pending PTO */}
        <div className="card">
          <div className="card-title" style={{marginBottom:12}}>Pending PTO requests</div>
          {PTO_REQUESTS.filter(p=>p.status==="pending").map(p=>{
            const emp = getEmployee(p.employeeId)
            if(!emp) return null
            return (
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
                <div className="avatar" style={{width:28,height:28,fontSize:10}}>{initials(emp)}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500}}>{fullName(emp)}</div>
                  <div style={{fontSize:11,color:"#64748b"}}>{p.type} · {p.days} day{p.days>1?"s":""} · {fmtDate(p.startDate)}</div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button className="btn btn-sm btn-primary" style={{fontSize:11}}>Approve</button>
                  <button className="btn btn-sm" style={{fontSize:11}}>Deny</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Pinned announcement + quick actions */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {pinned&&(
            <div className="card" style={{borderLeft:"3px solid #C0392B"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <AlertCircle size={14} color="#C0392B"/>
                <span style={{fontSize:11,fontWeight:700,color:"#C0392B",textTransform:"uppercase",letterSpacing:"0.04em"}}>Pinned</span>
              </div>
              <div style={{fontSize:14,fontWeight:600,color:"#1B2B4B",marginBottom:4}}>{pinned.title}</div>
              <div style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>{pinned.body.slice(0,120)}...</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:6}}>By {pinned.author} · {new Date(pinned.publishedAt).toLocaleDateString()}</div>
            </div>
          )}
          <div className="card">
            <div className="card-title" style={{marginBottom:10}}>Quick actions</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {label:"New enrollment",href:"/onboarding",color:"#1B2B4B"},
                {label:"Approve time",href:"/time-tracking",color:"#1d4ed8"},
                {label:"Post announcement",href:"/announcements",color:"#15803d"},
                {label:"View analytics",href:"/analytics",color:"#6d28d9"},
              ].map(a=>(
                <a key={a.label} href={a.href} style={{display:"block",padding:"10px 12px",borderRadius:8,border:"1px solid #e8ecf4",fontSize:13,fontWeight:500,color:a.color,textDecoration:"none",transition:"background .15s",background:"#f8fafc"}}>
                  {a.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
