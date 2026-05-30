"use client"
import { useState } from "react"
import { MOCK_DOCUMENTS, EMPLOYEES, fmtDate } from "@/lib/data"
import { Upload, FileText, Download, CheckCircle2, Clock, File } from "lucide-react"

const CATS = ["All","Policy","Benefits","Payroll","Legal","Certification"]

export default function Documents() {
  const [cat,setCat] = useState("All")
  const filtered = cat==="All"?MOCK_DOCUMENTS:MOCK_DOCUMENTS.filter(d=>d.category===cat)

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div>
          <div className="page-title">Documents</div>
          <div className="page-sub">Company policies, forms, and certifications</div>
        </div>
        <button className="btn btn-primary"><Upload size={14}/>Upload document</button>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className="btn btn-sm" style={{background:cat===c?"#1B2B4B":"#fff",color:cat===c?"#fff":"#1B2B4B"}}>{c}</button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(doc=>{
          const unsigned = EMPLOYEES.filter(e=>doc.signatureRequired&&!doc.signedBy.includes(e.id)&&e.status==="active")
          return (
            <div key={doc.id} className="card">
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:44,height:44,borderRadius:10,background:"#f4f6fa",border:"1px solid #e8ecf4",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <FileText size={20} color="#1B2B4B"/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:14,color:"#1B2B4B",marginBottom:3}}>{doc.name}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>
                    {doc.category} · {doc.size} · Uploaded by {doc.uploadedBy} · {fmtDate(doc.uploadedAt)}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {doc.signatureRequired&&(
                    <div style={{textAlign:"right"}}>
                      {unsigned.length===0?(
                        <span className="badge badge-green"><CheckCircle2 size={11}/>All signed</span>
                      ):(
                        <span className="badge badge-amber"><Clock size={11}/>{unsigned.length} unsigned</span>
                      )}
                    </div>
                  )}
                  <button className="btn btn-sm"><Download size={12}/>Download</button>
                  {doc.signatureRequired&&<button className="btn btn-sm btn-primary" style={{fontSize:12}}>Send for signature</button>}
                </div>
              </div>
              {doc.signatureRequired&&doc.signedBy.length>0&&(
                <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #f1f5f9"}}>
                  <div style={{fontSize:11,color:"#94a3b8",marginBottom:6}}>Signed by {doc.signedBy.length} of {EMPLOYEES.filter(e=>e.status==="active").length} active employees</div>
                  <div style={{height:5,background:"#f1f5f9",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.round(doc.signedBy.length/EMPLOYEES.filter(e=>e.status==="active").length*100)}%`,background:"#16a34a",borderRadius:3}}/>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
