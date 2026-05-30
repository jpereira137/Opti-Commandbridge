"use client"
import { EMPLOYEES, SHIFTS, TIME_ENTRIES, fmtDate } from "@/lib/data"
import { Zap, CheckCircle2, RefreshCw, ExternalLink, Clock, Users, Calendar } from "lucide-react"

export default function Connecteam() {
  const ct1Emps = EMPLOYEES.filter(e=>e.connecteamAccount===1)
  const ct2Emps = EMPLOYEES.filter(e=>e.connecteamAccount===2)
  const ct1Shifts = SHIFTS.filter(s=>s.connecteamAccount===1)
  const ct2Shifts = SHIFTS.filter(s=>s.connecteamAccount===2)

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div>
          <div className="page-title">Connecteam integration</div>
          <div className="page-sub">Live data pulled from your 2 Connecteam accounts via API</div>
        </div>
        <button className="btn"><RefreshCw size={14}/>Sync now</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {[
          {id:1,name:"Account 1 — Operations",dept:"Operations",location:"Providence, RI",emps:ct1Emps,shifts:ct1Shifts,color:"#1d4ed8",bg:"#dbeafe"},
          {id:2,name:"Account 2 — HR/Support/Finance",dept:"HR · Support · Finance",location:"Boston, MA",emps:ct2Emps,shifts:ct2Shifts,color:"#6d28d9",bg:"#ede9fe"},
        ].map(ct=>(
          <div key={ct.id} className="card">
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:40,height:40,borderRadius:10,background:ct.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Zap size={20} color={ct.color}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:"#1B2B4B"}}>{ct.name}</div>
                <div style={{fontSize:12,color:"#64748b"}}>{ct.location} · {ct.dept}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,color:"#16a34a"}}>
                <CheckCircle2 size={14}/>Connected
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              {[
                {label:"Employees",value:ct.emps.length,icon:Users},
                {label:"Shifts this week",value:ct.shifts.length,icon:Calendar},
                {label:"Hours tracked",value:TIME_ENTRIES.filter(t=>t.connecteamAccount===ct.id).reduce((a,t)=>a+t.hours,0).toFixed(0),icon:Clock},
              ].map(s=>{
                const Icon = s.icon
                return (
                  <div key={s.label} style={{background:"#f8fafc",borderRadius:8,padding:"10px",textAlign:"center"}}>
                    <Icon size={14} color="#64748b" style={{margin:"0 auto 4px"}}/>
                    <div style={{fontSize:18,fontWeight:700,color:"#1B2B4B"}}>{s.value}</div>
                    <div style={{fontSize:10,color:"#94a3b8"}}>{s.label}</div>
                  </div>
                )
              })}
            </div>
            <div style={{fontSize:12,fontWeight:600,color:"#64748b",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.04em"}}>Active employees</div>
            {ct.emps.filter(e=>e.status==="active").map(e=>(
              <div key={e.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #f1f5f9",fontSize:13}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:ct.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:ct.color}}>{e.firstName[0]}{e.lastName[0]}</div>
                <span style={{flex:1,fontWeight:500}}>{e.firstName} {e.lastName}</span>
                <span style={{color:"#64748b",fontSize:12}}>{e.role}</span>
              </div>
            ))}
            <a href="https://app.connecteam.com" target="_blank" rel="noreferrer" className="btn" style={{marginTop:12,width:"100%",justifyContent:"center"}}>
              <ExternalLink size={13}/>Open in Connecteam
            </a>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title" style={{marginBottom:12}}>API configuration</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[1,2].map(ct=>(
            <div key={ct} style={{background:"#f8fafc",borderRadius:10,padding:"14px"}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:10,color:"#1B2B4B"}}>Account {ct} API settings</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:4}}>API Key</div>
                  <input type="password" value="••••••••••••••••••••••" readOnly style={{width:"100%",height:34,padding:"0 10px",border:"1.5px solid #e2e8f0",borderRadius:7,fontSize:13,background:"#fff",color:"#1B2B4B",outline:"none"}}/>
                </div>
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:4}}>Sync frequency</div>
                  <select style={{width:"100%",height:34,padding:"0 10px",border:"1.5px solid #e2e8f0",borderRadius:7,fontSize:13,background:"#fff",color:"#1B2B4B",outline:"none"}}>
                    <option>Every 15 minutes</option>
                    <option>Every hour</option>
                    <option>Every 6 hours</option>
                    <option>Manual only</option>
                  </select>
                </div>
                <div style={{fontSize:12,color:"#94a3b8"}}>Last synced: just now · Status: healthy</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
