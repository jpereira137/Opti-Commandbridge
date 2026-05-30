"use client"
import { REVIEWS, EMPLOYEES, getEmployee, fullName, initials, statusBadge, fmtDate } from "@/lib/data"
import { Star } from "lucide-react"

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{display:"flex",gap:2}}>
      {[1,2,3,4,5].map(i=>(
        <Star key={i} size={14} fill={i<=rating?"#C0392B":"none"} color={i<=rating?"#C0392B":"#e2e8f0"} />
      ))}
    </div>
  )
}

export default function Performance() {
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div>
          <div className="page-title">Performance</div>
          <div className="page-sub">Reviews, goals, and feedback — Q1 & Q2 2026</div>
        </div>
        <button className="btn btn-primary">+ New review</button>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {REVIEWS.map(r=>{
          const emp = getEmployee(r.employeeId)
          const reviewer = getEmployee(r.reviewerId)
          if(!emp) return null
          return (
            <div key={r.id} className="card">
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <div className="avatar" style={{width:42,height:42}}>{initials(emp)}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:15,color:"#1B2B4B"}}>{fullName(emp)}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>{emp.role} · Reviewed by {reviewer?fullName(reviewer):"—"}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <span className={`badge ${statusBadge(r.status)}`}>{r.status}</span>
                  <div style={{fontSize:12,color:"#64748b",marginTop:4}}>{r.period}</div>
                </div>
              </div>

              {r.overallRating>0&&(
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"10px 14px",background:"#f8fafc",borderRadius:8}}>
                  <span style={{fontSize:12,color:"#64748b",fontWeight:500}}>Overall rating:</span>
                  <Stars rating={r.overallRating}/>
                  <span style={{fontSize:13,fontWeight:700,color:"#1B2B4B"}}>{r.overallRating}/5</span>
                  {r.submittedAt&&<span style={{marginLeft:"auto",fontSize:11,color:"#94a3b8"}}>Submitted {fmtDate(r.submittedAt)}</span>}
                </div>
              )}

              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:8}}>Goals</div>
                {r.goals.map(g=>(
                  <div key={g.id} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:13,color:"#1B2B4B"}}>{g.title}</span>
                      <span style={{fontSize:12,fontWeight:600,color:g.progress>=90?"#15803d":g.progress>=60?"#b45309":"#C0392B"}}>{g.progress}%</span>
                    </div>
                    <div style={{height:6,background:"#f1f5f9",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${g.progress}%`,background:g.progress>=90?"#16a34a":g.progress>=60?"#d97706":"#C0392B",borderRadius:3,transition:"width .4s ease"}}/>
                    </div>
                    <div style={{fontSize:11,color:"#94a3b8",marginTop:3}}>Due {fmtDate(g.due)}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
