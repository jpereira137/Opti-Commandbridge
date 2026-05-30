"use client"
import { useState } from "react"
import { MOCK_ANNOUNCEMENTS, EMPLOYEES } from "@/lib/data"
import { Pin, Plus, Users, Eye } from "lucide-react"

export default function Announcements() {
  const [filter,setFilter] = useState("all")
  const filtered = filter==="all"?MOCK_ANNOUNCEMENTS:MOCK_ANNOUNCEMENTS.filter(a=>a.audience===filter||a.audience==="all")
  const [composing,setComposing] = useState(false)

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div>
          <div className="page-title">Announcements</div>
          <div className="page-sub">Company-wide news and team updates</div>
        </div>
        <button onClick={()=>setComposing(true)} className="btn btn-primary"><Plus size={14}/>New announcement</button>
      </div>

      {composing&&(
        <div className="card" style={{marginBottom:16,borderLeft:"3px solid #C0392B"}}>
          <div style={{fontWeight:600,fontSize:15,marginBottom:12,color:"#1B2B4B"}}>New announcement</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <input placeholder="Title..." style={{height:38,padding:"0 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:14,outline:"none"}} className="form-input"/>
            <textarea placeholder="Write your announcement..." style={{padding:"10px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:14,outline:"none",minHeight:100,resize:"vertical",fontFamily:"inherit"}}/>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <select className="form-select" style={{width:"auto"}}>
                <option value="all">All employees</option>
                <option value="dept-a">Account A — Operations</option>
                <option value="dept-b">Account B — HR/Support/Finance</option>
              </select>
              <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                <button onClick={()=>setComposing(false)} className="btn btn-sm">Cancel</button>
                <button onClick={()=>setComposing(false)} className="btn btn-sm btn-primary">Publish</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[{v:"all",l:"All"},{v:"dept-a",l:"Account A"},{v:"dept-b",l:"Account B"}].map(f=>(
          <button key={f.v} onClick={()=>setFilter(f.v)} className="btn btn-sm" style={{background:filter===f.v?"#1B2B4B":"#fff",color:filter===f.v?"#fff":"#1B2B4B"}}>{f.l}</button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map(a=>(
          <div key={a.id} className="card" style={{borderLeft:a.pinned?"3px solid #C0392B":"none"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  {a.pinned&&<Pin size={13} color="#C0392B"/>}
                  <span style={{fontSize:15,fontWeight:600,color:"#1B2B4B"}}>{a.title}</span>
                  <span className={`badge ${a.audience==="all"?"badge-green":a.audience==="dept-a"?"badge-blue":"badge-purple"}`}>
                    {a.audience==="all"?"All employees":a.audience==="dept-a"?"Account A":"Account B"}
                  </span>
                </div>
                <p style={{fontSize:13,color:"#475569",lineHeight:1.6,marginBottom:10}}>{a.body}</p>
                <div style={{display:"flex",alignItems:"center",gap:12,fontSize:12,color:"#94a3b8"}}>
                  <span>By {a.authorName}</span>
                  <span>{new Date(a.publishedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
                  <span style={{display:"flex",alignItems:"center",gap:4}}><Eye size={12}/>{a.readBy.length} read</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
