"use client"
import { useState } from "react"
import { SHIFTS, EMPLOYEES, getEmployee, fullName, initials, statusBadge } from "@/lib/data"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

const DAYS = ["Mon 5/25","Tue 5/26","Wed 5/27","Thu 5/28","Fri 5/29","Sat 5/30","Sun 5/31"]
const DATES = ["2026-05-25","2026-05-26","2026-05-27","2026-05-28","2026-05-29","2026-05-30","2026-05-31"]

export default function Scheduling() {
  const [ctFilter,setCtFilter] = useState<"all"|"A"|"B">("all")

  const filteredShifts = ctFilter==="all"?SHIFTS:SHIFTS.filter(s=>s.connecteamAccount===ctFilter)

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div>
          <div className="page-title">Scheduling</div>
          <div className="page-sub">Week of May 25 – 31, 2026 · Data pulled from Connecteam</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <div style={{display:"flex",gap:6}}>
            {[{v:"all" as const,l:"All"},{v:"A" as const,l:"Account A"},{v:"B" as const,l:"Account B"}].map(f=>(
              <button key={f.v} onClick={()=>setCtFilter(f.v)} className="btn btn-sm" style={{background:ctFilter===f.v?"#1B2B4B":"#fff",color:ctFilter===f.v?"#fff":"#1B2B4B"}}>{f.l}</button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm"><Plus size={13}/>Add shift</button>
        </div>
      </div>

      {/* Connecteam sync badge */}
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        {(["A","B"] as const).map(ct=>(
          <div key={ct} style={{display:"flex",alignItems:"center",gap:8,background:"#fff",border:"1px solid #e8ecf4",borderRadius:10,padding:"8px 14px",fontSize:13}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#16a34a"}}/>
            <span style={{fontWeight:600,color:"#1B2B4B"}}>Connecteam Account {ct}</span>
            <span style={{color:"#64748b"}}>· {EMPLOYEES.filter(e=>e.connecteamAccount===ct&&e.status==="active").length} active employees</span>
            <span className="badge badge-green" style={{fontSize:10}}>Synced</span>
          </div>
        ))}
      </div>

      {/* Weekly calendar grid */}
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"140px repeat(7,1fr)",borderBottom:"1px solid #e8ecf4"}}>
          <div style={{padding:"12px 16px",background:"#f8fafc",borderRight:"1px solid #e8ecf4"}}>
            <span style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase"}}>Employee</span>
          </div>
          {DAYS.map(d=>(
            <div key={d} style={{padding:"12px 8px",background:"#f8fafc",borderRight:"1px solid #f1f5f9",textAlign:"center",fontSize:12,fontWeight:600,color:d.includes("5/29")?"#1B2B4B":"#64748b",borderBottom:d.includes("5/29")?"2px solid #C0392B":"none"}}>
              {d}
            </div>
          ))}
        </div>
        {EMPLOYEES.filter(e=>(ctFilter==="all"||e.connecteamAccount===ctFilter)&&e.status!=="onboarding").map(emp=>(
          <div key={emp.id} style={{display:"grid",gridTemplateColumns:"140px repeat(7,1fr)",borderBottom:"1px solid #f1f5f9"}}>
            <div style={{padding:"10px 12px",borderRight:"1px solid #e8ecf4",display:"flex",alignItems:"center",gap:8}}>
              <div className="avatar" style={{width:26,height:26,fontSize:10}}>{initials(emp)}</div>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#1B2B4B",lineHeight:1.2}}>{emp.firstName}</div>
                <div style={{fontSize:10,color:"#94a3b8"}}>{emp.role.split(" ")[0]}</div>
              </div>
            </div>
            {DATES.map(date=>{
              const shift = filteredShifts.find(s=>s.employeeId===emp.id&&s.date===date)
              return (
                <div key={date} style={{padding:"6px 4px",borderRight:"1px solid #f1f5f9",minHeight:52,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {shift?(
                    <div style={{background:shift.connecteamAccount==="A"?"#dbeafe":"#ede9fe",borderRadius:6,padding:"4px 6px",width:"100%",textAlign:"center"}}>
                      <div style={{fontSize:10,fontWeight:700,color:shift.connecteamAccount==="A"?"#1d4ed8":"#6d28d9"}}>{shift.startTime}–{shift.endTime}</div>
                      <div style={{fontSize:9,color:shift.connecteamAccount==="A"?"#3b82f6":"#8b5cf6",marginTop:1}}>{shift.location.split(",")[0]}</div>
                    </div>
                  ):(
                    <div style={{width:"100%",height:36,borderRadius:6,border:"1px dashed #e8ecf4",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:16,color:"#e8ecf4"}}>+</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
