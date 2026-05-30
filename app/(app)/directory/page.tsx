"use client"
import { useState } from "react"
import { EMPLOYEES, fullName, initials, fmtPay, fmtDate, statusBadge } from "@/lib/data"
import { Search, Plus, Filter, MapPin, Mail, Phone } from "lucide-react"

const DEPTS = ["All","Operations","HR","Support","Finance"]

export default function Directory() {
  const [search,setSearch] = useState("")
  const [dept,setDept] = useState("All")
  const [view,setView] = useState<"grid"|"table">("table")

  const filtered = EMPLOYEES.filter(e=>{
    const q = search.toLowerCase()
    const matchSearch = fullName(e).toLowerCase().includes(q)||e.role.toLowerCase().includes(q)||e.email.toLowerCase().includes(q)
    const matchDept = dept==="All"||e.department===dept
    return matchSearch && matchDept
  })

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div>
          <div className="page-title">Employee directory</div>
          <div className="page-sub">{EMPLOYEES.length} employees across 2 Connecteam accounts</div>
        </div>
        <a href="/onboarding" className="btn btn-primary"><Plus size={15}/>New enrollment</a>
      </div>

      {/* Filters */}
      <div className="card" style={{marginBottom:16}}>
        <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:200,background:"#f4f6fa",borderRadius:8,padding:"7px 12px",border:"1px solid #e8ecf4"}}>
            <Search size={14} color="#94a3b8"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, role, email..." style={{border:"none",background:"none",fontSize:13,color:"#1B2B4B",outline:"none",width:"100%"}}/>
          </div>
          <div style={{display:"flex",gap:6}}>
            {DEPTS.map(d=>(
              <button key={d} onClick={()=>setDept(d)} className="btn btn-sm" style={{background:dept===d?"#1B2B4B":"#fff",color:dept===d?"#fff":"#1B2B4B",borderColor:dept===d?"#1B2B4B":"#e8ecf4"}}>{d}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
            <button onClick={()=>setView("table")} className="btn btn-sm" style={{background:view==="table"?"#1B2B4B":"#fff",color:view==="table"?"#fff":"#1B2B4B"}}>Table</button>
            <button onClick={()=>setView("grid")} className="btn btn-sm" style={{background:view==="grid"?"#1B2B4B":"#fff",color:view==="grid"?"#fff":"#1B2B4B"}}>Cards</button>
          </div>
        </div>
      </div>

      {view==="table"?(
        <div className="card" style={{padding:0,overflow:"hidden"}}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th><th>Role</th><th>Department</th><th>Location</th>
                <th>Pay</th><th>Start date</th><th>Account</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp=>(
                <tr key={emp.id}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div className="avatar">{initials(emp)}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:13}}>{fullName(emp)}</div>
                        <div style={{fontSize:11,color:"#64748b"}}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{fontSize:13}}>{emp.role}</td>
                  <td><span className="badge badge-navy">{emp.department}</span></td>
                  <td style={{fontSize:13,color:"#64748b"}}>{emp.location}</td>
                  <td style={{fontSize:13,fontWeight:500}}>{fmtPay(emp.payRate,emp.rateType)}</td>
                  <td style={{fontSize:12,color:"#64748b"}}>{fmtDate(emp.startDate)}</td>
                  <td><span className={`badge ${emp.connecteamAccount===1?"badge-blue":"badge-purple"}`}>CT {emp.connecteamAccount}</span></td>
                  <td><span className={`badge ${statusBadge(emp.status)}`}>{emp.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
          {filtered.map(emp=>(
            <div key={emp.id} className="card" style={{cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div className="avatar" style={{width:44,height:44,fontSize:14}}>{initials(emp)}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:14,color:"#1B2B4B"}}>{fullName(emp)}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>{emp.role}</div>
                </div>
                <span className={`badge ${statusBadge(emp.status)}`}>{emp.status}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                <div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"#64748b"}}><Mail size={12}/>{emp.email}</div>
                <div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"#64748b"}}><Phone size={12}/>{emp.phone}</div>
                <div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"#64748b"}}><MapPin size={12}/>{emp.location}</div>
              </div>
              <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid #f1f5f9",display:"flex",gap:6}}>
                <span className="badge badge-navy">{emp.department}</span>
                <span className={`badge ${emp.connecteamAccount===1?"badge-blue":"badge-purple"}`}>CT {emp.connecteamAccount}</span>
                <span style={{marginLeft:"auto",fontSize:12,fontWeight:600,color:"#1B2B4B"}}>{fmtPay(emp.payRate,emp.rateType)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
