"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { CheckCircle2, AlertTriangle, Info, ShieldCheck, Building2, Calendar, FileText, User, PenLine, Trash2, UserPlus, ChevronDown } from "lucide-react"

const STEP_LABELS = ["Personal","Employment","I-9","Pay & Tax","Benefits","Signature","Checklist"]

const initialForm = {
  firstName:"",middleName:"",lastName:"",preferredName:"",dob:"",ssn:"",
  personalEmail:"",phone:"",homeAddress:"",ecName:"",ecPhone:"",ecRelationship:"",
  jobTitle:"",department:"",employmentType:"",startDate:"",workLocation:"",
  manager:"",workEmail:"",hoursPerWeek:"",flsaStatus:"",eeoCategory:"",
  citizenStatus:"",uscisNumber:"",workAuthExpiry:"",listADoc:"",docNumber:"",
  issuingAuthority:"",docExpiry:"",verificationDate:"",listBDocs:[] as string[],
  listCDocs:[] as string[],i9RepName:"",i9RepTitle:"",i9BizName:"",i9BizAddress:"",i9Certified:false,
  payRate:"",rateType:"",payFrequency:"Bi-weekly",paymentMethod:"",bankRouting:"",
  bankAccount:"",accountType:"Checking",fedFilingStatus:"",multipleJobs:"No",
  dependentsCredit:"",otherIncome:"",extraWithholding:"",fedExempt:"No",
  riFilingStatus:"",riAllowances:"",riExtraWithholding:"",riExempt:"No",
  maFilingStatus:"",maPersonalExemption:"",maDependents:"",maAge65:"No",
  maBlind:"No",maExtraWithholding:"",maExempt:"No",
  simpleIRA:false,iraContributionPct:"",iraBeneficiary:"",iraBeneficiaryRel:"",
  flexPTO:false,ptoStartDate:"",ptoPlan:"Flexible (use as needed)",
  sigTypedName:"",sigDate:"",sigDrawnData:"",sigEmpName:"",sigEmpTitle:"",
}

const CHECKLIST_ITEMS = [
  {cat:"Documents & forms",id:"w4",label:"Federal W-4 completed & signed",sub:"Withholding elections in iSolved"},
  {cat:"Documents & forms",id:"riw4",label:"Rhode Island W-4 completed",sub:"RI state withholding recorded"},
  {cat:"Documents & forms",id:"maw4",label:"Massachusetts M-4 completed",sub:"MA state withholding recorded"},
  {cat:"Documents & forms",id:"i9s1",label:"I-9 Section 1 completed by employee",sub:"Citizenship status attested"},
  {cat:"Documents & forms",id:"i9s2",label:"I-9 Section 2 completed by employer",sub:"Documents verified within 3 days"},
  {cat:"Documents & forms",id:"esig",label:"Electronic signature obtained",sub:"Signed via CommandBridge"},
  {cat:"Documents & forms",id:"dd",label:"Direct deposit / pay method set up",sub:"Banking verified in iSolved"},
  {cat:"Benefits",id:"ira",label:"SIMPLE IRA enrollment processed",sub:"Contribution & beneficiary on file"},
  {cat:"Benefits",id:"pto",label:"Flexible PTO bank activated",sub:"Full-time employees"},
  {cat:"Benefits",id:"bsum",label:"Benefits summary sent to employee",sub:"Via email or iSolved portal"},
  {cat:"HR setup",id:"prof",label:"Employee profile created in iSolved",sub:"All fields populated"},
  {cat:"HR setup",id:"nhr",label:"New hire reported to state agency",sub:"RI & MA within 20 days"},
  {cat:"HR setup",id:"sys",label:"Work email and system access set up",sub:"Credentials delivered"},
  {cat:"HR setup",id:"hb",label:"Employee handbook acknowledged",sub:"Signed copy on file"},
  {cat:"First day",id:"ori",label:"Orientation scheduled",sub:"Date, time, location confirmed"},
  {cat:"First day",id:"team",label:"Manager / team intro arranged",sub:"Welcome meeting planned"},
  {cat:"First day",id:"ws",label:"Workspace / equipment prepared",sub:"Desk, laptop, or uniform ready"},
  {cat:"First day",id:"pay1",label:"First payroll date confirmed",sub:"Employee knows when to expect pay"},
]

function Field({ label, req, children }: { label:string; req?:boolean; children:React.ReactNode }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      <label style={{fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.04em"}}>
        {label}{req&&<span style={{color:"#C0392B",marginLeft:2}}>*</span>}
      </label>
      {children}
    </div>
  )
}

function FInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{height:38,padding:"0 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:14,outline:"none",width:"100%",background:"#fff",color:"#1B2B4B",...props.style}} onFocus={e=>{e.target.style.borderColor="#1B2B4B"}} onBlur={e=>{e.target.style.borderColor="#e2e8f0"}}/>
}

function FSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{height:38,padding:"0 10px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:14,outline:"none",width:"100%",background:"#fff",color:"#1B2B4B",appearance:"none",...props.style}}>{children}</select>
}

function RadioOpt({ sel, onSel, label, desc }: { sel:boolean; onSel:()=>void; label:string; desc?:string }) {
  return (
    <div onClick={onSel} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",border:`1.5px solid ${sel?"#1B2B4B":"#e2e8f0"}`,borderRadius:8,background:sel?"#eef1f7":"#fff",cursor:"pointer",marginBottom:6}}>
      <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${sel?"#1B2B4B":"#cbd5e1"}`,background:sel?"#1B2B4B":"#fff",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {sel&&<div style={{width:6,height:6,borderRadius:"50%",background:"#fff"}}/>}
      </div>
      <div>
        <div style={{fontSize:13,fontWeight:500,color:sel?"#1B2B4B":"#334155"}}>{label}</div>
        {desc&&<div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{desc}</div>}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked:boolean; onChange:(v:boolean)=>void }) {
  return (
    <div onClick={()=>onChange(!checked)} style={{width:42,height:24,borderRadius:12,background:checked?"#1B2B4B":"#e2e8f0",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
      <div style={{position:"absolute",top:3,left:checked?22:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
    </div>
  )
}

function InfoBox({ type="info", children }: { type?:"info"|"warn"|"ok"|"purple"; children:React.ReactNode }) {
  const s = {info:{bg:"#dbeafe",border:"#93c5fd",color:"#1d4ed8"},warn:{bg:"#fef3c7",border:"#fcd34d",color:"#b45309"},ok:{bg:"#dcfce7",border:"#86efac",color:"#15803d"},purple:{bg:"#ede9fe",border:"#c4b5fd",color:"#6d28d9"}}[type]
  return <div style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:8,padding:"10px 12px",fontSize:12.5,color:s.color,display:"flex",gap:8,marginBottom:12,lineHeight:1.5}}><Info size={14} style={{flexShrink:0,marginTop:1}}/><span>{children}</span></div>
}

function SubSec({ children }: { children:React.ReactNode }) {
  return <div style={{background:"#f8fafc",border:"1px solid #f1f5f9",borderRadius:10,padding:"14px 16px",marginBottom:12}}>{children}</div>
}

function SHd({ children }: { children:React.ReactNode }) {
  return <div style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10,marginTop:16}}>{children}</div>
}

function Grid({ children }: { children:React.ReactNode }) {
  return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:12}}>{children}</div>
}

function StepActions({ onBack, onNext, nextLabel="Next →" }: { onBack?:()=>void; onNext:()=>void; nextLabel?:string }) {
  return (
    <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:"1.5rem",paddingTop:"1.25rem",borderTop:"1px solid #f1f5f9"}}>
      {onBack&&<button onClick={onBack} className="btn">← Back</button>}
      <button onClick={onNext} className="btn btn-primary">{nextLabel}</button>
    </div>
  )
}

export default function Onboarding() {
  const [step,setStep] = useState(0)
  const [form,setForm] = useState(initialForm)
  const [enrolled,setEnrolled] = useState<typeof initialForm[]>([])
  const [showRoster,setShowRoster] = useState(false)
  const [checked,setChecked] = useState<Record<string,boolean>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasSig,setHasSig] = useState(false)
  const [drawing,setDrawing] = useState(false)
  const [lastP,setLastP] = useState({x:0,y:0})

  const u = (k:string,v:unknown) => setForm(p=>({...p,[k]:v}))
  const pct = Math.round((step/6)*100)
  const next = ()=>setStep(s=>Math.min(s+1,6))
  const back = ()=>setStep(s=>Math.max(s-1,0))

  useEffect(()=>{
    const c = canvasRef.current
    if(!c||step!==5) return
    c.width=c.offsetWidth; c.height=130
    const ctx=c.getContext("2d")!
    ctx.fillStyle="#fff"; ctx.fillRect(0,0,c.width,c.height)
    ctx.beginPath(); ctx.moveTo(20,100); ctx.lineTo(c.width-20,100)
    ctx.strokeStyle="#e2e8f0"; ctx.lineWidth=1; ctx.stroke()
    ctx.font="11px monospace"; ctx.fillStyle="#cbd5e1"; ctx.fillText("Sign here",20,116)
  },[step])

  const getXY = (e: React.MouseEvent<HTMLCanvasElement>|React.TouchEvent<HTMLCanvasElement>) => {
    const c=canvasRef.current!; const r=c.getBoundingClientRect()
    const sx=c.width/r.width; const sy=c.height/r.height
    const src = "touches" in e ? e.touches[0] : e
    return {x:(src.clientX-r.left)*sx, y:(src.clientY-r.top)*sy}
  }
  const startDraw = useCallback((e: React.MouseEvent<HTMLCanvasElement>|React.TouchEvent<HTMLCanvasElement>)=>{ e.preventDefault(); setDrawing(true); setLastP(getXY(e)) },[])
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>|React.TouchEvent<HTMLCanvasElement>)=>{
    if(!drawing) return; e.preventDefault()
    const c=canvasRef.current!; const ctx=c.getContext("2d")!; const p=getXY(e)
    ctx.beginPath(); ctx.moveTo(lastP.x,lastP.y); ctx.lineTo(p.x,p.y)
    ctx.strokeStyle="#1B2B4B"; ctx.lineWidth=2.5; ctx.lineCap="round"; ctx.stroke()
    setLastP(p); if(!hasSig){setHasSig(true); u("sigDrawnData","signed")}
  },[drawing,lastP,hasSig])
  const stopDraw = useCallback(()=>setDrawing(false),[])
  const clearSig = ()=>{
    const c=canvasRef.current!; const ctx=c.getContext("2d")!
    ctx.clearRect(0,0,c.width,c.height); ctx.fillStyle="#fff"; ctx.fillRect(0,0,c.width,c.height)
    ctx.beginPath(); ctx.moveTo(20,100); ctx.lineTo(c.width-20,100)
    ctx.strokeStyle="#e2e8f0"; ctx.lineWidth=1; ctx.stroke()
    ctx.font="11px monospace"; ctx.fillStyle="#cbd5e1"; ctx.fillText("Sign here",20,116)
    setHasSig(false); u("sigDrawnData","")
  }

  const doneCount = CHECKLIST_ITEMS.filter(i=>checked[i.id]).length
  const cats = [...new Set(CHECKLIST_ITEMS.map(i=>i.cat))]

  if(showRoster) return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div><div className="page-title">Payroll onboarding</div><div className="page-sub">{enrolled.length} employee{enrolled.length!==1?"s":""} enrolled</div></div>
        <button onClick={()=>{setShowRoster(false);setStep(0);setForm(initialForm)}} className="btn btn-primary"><UserPlus size={14}/>New enrollment</button>
      </div>
      {enrolled.length===0?(
        <div style={{textAlign:"center",padding:"4rem 2rem",border:"2px dashed #e8ecf4",borderRadius:16,color:"#94a3b8"}}>
          <UserPlus size={40} style={{margin:"0 auto 12px",opacity:.3}}/><p>No enrollments yet. Click &quot;New enrollment&quot; to start.</p>
        </div>
      ):enrolled.map((emp,i)=>(
        <div key={i} className="card" style={{marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:"#eef1f7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#1B2B4B"}}>{emp.firstName[0]||"?"}{emp.lastName[0]||"?"}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:14}}>{emp.firstName} {emp.lastName}</div>
              <div style={{fontSize:12,color:"#64748b"}}>{emp.jobTitle} · Start: {emp.startDate||"—"}</div>
            </div>
            <span className="badge badge-green"><CheckCircle2 size={11}/>Enrolled</span>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem"}}>
        <div><div className="page-title">Payroll onboarding</div><div className="page-sub">iSolved 7-step new hire enrollment</div></div>
        <button onClick={()=>setShowRoster(true)} className="btn">View roster ({enrolled.length})</button>
      </div>

      <div className="card">
        {/* Stepper */}
        <div style={{marginBottom:"1.25rem"}}>
          <div style={{height:3,background:"#f1f5f9",borderRadius:2,marginBottom:"1rem",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#1B2B4B,#C0392B)",borderRadius:2,transition:"width .4s"}}/>
          </div>
          <div style={{display:"flex",alignItems:"flex-start",overflowX:"auto",gap:0}}>
            {STEP_LABELS.map((label,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",flexShrink:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,background:i<step?"#15803d":i===step?"#1B2B4B":"#f1f5f9",color:i<step||i===step?"#fff":"#94a3b8",boxShadow:i===step?"0 0 0 3px rgba(27,43,75,0.15)":"none",transition:"all .2s"}}>
                    {i<step?<CheckCircle2 size={13}/>:i+1}
                  </div>
                  <span style={{fontSize:9.5,color:i===step?"#1B2B4B":i<step?"#15803d":"#94a3b8",fontWeight:i===step?600:400,whiteSpace:"nowrap"}}>{label}</span>
                </div>
                {i<STEP_LABELS.length-1&&<div style={{height:2,width:32,marginTop:12,background:i<step?"#16a34a":"#f1f5f9",transition:"background .3s",flexShrink:0}}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Personal */}
        {step===0&&<div>
          <h2 style={{fontSize:18,fontWeight:600,color:"#1B2B4B",marginBottom:4}}>Personal information</h2>
          <p style={{fontSize:13,color:"#64748b",marginBottom:"1.25rem"}}>Legal name and contact details — must match government-issued ID</p>
          <Grid>
            <Field label="First name" req><FInput value={form.firstName} onChange={e=>u("firstName",e.target.value)} placeholder="Legal first name"/></Field>
            <Field label="Middle name"><FInput value={form.middleName} onChange={e=>u("middleName",e.target.value)} placeholder="Optional"/></Field>
            <Field label="Last name" req><FInput value={form.lastName} onChange={e=>u("lastName",e.target.value)} placeholder="Legal last name"/></Field>
            <Field label="Date of birth" req><FInput type="date" value={form.dob} onChange={e=>u("dob",e.target.value)}/></Field>
            <Field label="SSN" req><FInput value={form.ssn} onChange={e=>u("ssn",e.target.value)} placeholder="XXX-XX-XXXX" maxLength={11}/></Field>
            <Field label="Personal email" req><FInput type="email" value={form.personalEmail} onChange={e=>u("personalEmail",e.target.value)} placeholder="employee@email.com"/></Field>
            <Field label="Phone"><FInput type="tel" value={form.phone} onChange={e=>u("phone",e.target.value)} placeholder="(555) 000-0000"/></Field>
          </Grid>
          <div style={{marginTop:12}}><Field label="Home address" req><FInput value={form.homeAddress} onChange={e=>u("homeAddress",e.target.value)} placeholder="Street, City, State, ZIP"/></Field></div>
          <SHd>Emergency contact</SHd>
          <Grid>
            <Field label="Name"><FInput value={form.ecName} onChange={e=>u("ecName",e.target.value)} placeholder="Full name"/></Field>
            <Field label="Phone"><FInput value={form.ecPhone} onChange={e=>u("ecPhone",e.target.value)} placeholder="(555) 000-0000"/></Field>
            <Field label="Relationship"><FInput value={form.ecRelationship} onChange={e=>u("ecRelationship",e.target.value)} placeholder="e.g. Spouse"/></Field>
          </Grid>
          <InfoBox type="info">SSN and date of birth are required by iSolved for payroll tax filing and stored securely.</InfoBox>
          <StepActions onNext={next} nextLabel="Employment details →"/>
        </div>}

        {/* Step 2: Employment */}
        {step===1&&<div>
          <h2 style={{fontSize:18,fontWeight:600,color:"#1B2B4B",marginBottom:4}}>Employment details</h2>
          <p style={{fontSize:13,color:"#64748b",marginBottom:"1.25rem"}}>Job classification for iSolved</p>
          <Grid>
            <Field label="Job title" req><FInput value={form.jobTitle} onChange={e=>u("jobTitle",e.target.value)} placeholder="e.g. Field Technician"/></Field>
            <Field label="Department"><FInput value={form.department} onChange={e=>u("department",e.target.value)} placeholder="e.g. Operations"/></Field>
            <Field label="Employment type" req><FSelect value={form.employmentType} onChange={e=>u("employmentType",e.target.value)}><option value="">Select</option>{["Full-time salaried","Full-time hourly","Part-time hourly","Seasonal","Contractor (1099)"].map(t=><option key={t}>{t}</option>)}</FSelect></Field>
            <Field label="Start date" req><FInput type="date" value={form.startDate} onChange={e=>u("startDate",e.target.value)}/></Field>
            <Field label="Work location"><FInput value={form.workLocation} onChange={e=>u("workLocation",e.target.value)} placeholder="Office, Remote, Address"/></Field>
            <Field label="Manager"><FInput value={form.manager} onChange={e=>u("manager",e.target.value)} placeholder="Full name"/></Field>
            <Field label="Work email"><FInput type="email" value={form.workEmail} onChange={e=>u("workEmail",e.target.value)} placeholder="name@optisolutions.com"/></Field>
            <Field label="Hours per week"><FInput type="number" value={form.hoursPerWeek} onChange={e=>u("hoursPerWeek",e.target.value)} placeholder="40"/></Field>
            <Field label="FLSA status" req><FSelect value={form.flsaStatus} onChange={e=>u("flsaStatus",e.target.value)}><option value="">Select</option><option>Exempt (salaried)</option><option>Non-exempt (hourly)</option></FSelect></Field>
          </Grid>
          <StepActions onBack={back} onNext={next} nextLabel="I-9 verification →"/>
        </div>}

        {/* Step 3: I-9 */}
        {step===2&&<div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <h2 style={{fontSize:18,fontWeight:600,color:"#1B2B4B"}}>Form I-9 — employment eligibility</h2>
            <span className="badge badge-purple">USCIS</span>
          </div>
          <p style={{fontSize:13,color:"#64748b",marginBottom:"1rem"}}>Required by federal law for all new hires</p>
          <div style={{background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:8,padding:"10px 12px",fontSize:12.5,color:"#b45309",display:"flex",gap:8,marginBottom:12}}>
            <AlertTriangle size={14} style={{flexShrink:0,marginTop:1}}/><span>Must be completed by the employee&apos;s first day. Document verification required within <strong>3 business days</strong>.</span>
          </div>
          <SHd>Section 1 — employee attestation</SHd>
          <SubSec>
            <Grid><Field label="Other last names"><FInput value={form.uscisNumber} onChange={e=>u("otherLastNames",e.target.value)} placeholder="Former names, if any"/></Field></Grid>
            <div style={{marginTop:10}}>
              <div style={{fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:8}}>Citizenship status <span style={{color:"#C0392B"}}>*</span></div>
              {[{v:"citizen",l:"U.S. citizen"},{v:"national",l:"U.S. non-citizen national"},{v:"lpr",l:"Lawful permanent resident",d:"USCIS / A-Number required"},{v:"alien",l:"Alien authorized to work",d:"Expiration date required"}].map(o=>(
                <RadioOpt key={o.v} sel={form.citizenStatus===o.v} onSel={()=>u("citizenStatus",o.v)} label={o.l} desc={o.d}/>
              ))}
            </div>
            {form.citizenStatus==="lpr"&&<div style={{marginTop:10}}><Field label="USCIS / Alien Registration Number" req><FInput value={form.uscisNumber} onChange={e=>u("uscisNumber",e.target.value)} placeholder="A-Number or I-94"/></Field></div>}
            {form.citizenStatus==="alien"&&<Grid style={{marginTop:10}}><Field label="Work authorization expiry" req><FInput type="date" value={form.workAuthExpiry} onChange={e=>u("workAuthExpiry",e.target.value)}/></Field><Field label="USCIS number"><FInput value={form.uscisNumber} onChange={e=>u("uscisNumber",e.target.value)} placeholder="A-Number or I-94"/></Field></Grid>}
          </SubSec>
          <SHd>Section 2 — document verification</SHd>
          <InfoBox type="info">Employee must present <strong>original</strong> documents. List A alone OR List B + List C together.</InfoBox>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,textAlign:"center",background:"#f8fafc",borderRadius:7,padding:"6px",marginBottom:8}}>List A — identity & work auth</div>
              {[{v:"passport",l:"U.S. passport / passport card"},{v:"greencard",l:"Permanent resident card (I-551)"},{v:"ead",l:"Employment auth. document (I-766)"},{v:"forpass",l:"Foreign passport with I-94"},{v:"",l:"Not using List A — will use B+C"}].map(o=>(
                <RadioOpt key={o.v||"none"} sel={form.listADoc===o.v} onSel={()=>u("listADoc",o.v)} label={o.l}/>
              ))}
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,textAlign:"center",background:"#f8fafc",borderRadius:7,padding:"6px",marginBottom:8}}>List B + List C</div>
              <div style={{fontSize:10,fontWeight:600,color:"#64748b",marginBottom:6,textTransform:"uppercase"}}>List B — identity</div>
              {[{v:"dl",l:"Driver's license / state ID"},{v:"govid",l:"Federal/state/local govt ID"},{v:"military",l:"U.S. military card"}].map(o=>{
                const chk = form.listBDocs.includes(o.v)
                return <div key={o.v} onClick={()=>u("listBDocs",chk?form.listBDocs.filter(x=>x!==o.v):[...form.listBDocs,o.v])} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",border:`1.5px solid ${chk?"#1B2B4B":"#e2e8f0"}`,borderRadius:7,background:chk?"#eef1f7":"#fff",cursor:"pointer",marginBottom:5,fontSize:12}}><input type="checkbox" readOnly checked={chk} style={{accentColor:"#1B2B4B"}}/>{o.l}</div>
              })}
              <div style={{fontSize:10,fontWeight:600,color:"#64748b",marginBottom:6,marginTop:10,textTransform:"uppercase"}}>List C — work auth</div>
              {[{v:"sscard",l:"Social Security card (unrestricted)"},{v:"birth",l:"U.S. birth certificate"},{v:"tribal",l:"Native American tribal document"}].map(o=>{
                const chk = form.listCDocs.includes(o.v)
                return <div key={o.v} onClick={()=>u("listCDocs",chk?form.listCDocs.filter(x=>x!==o.v):[...form.listCDocs,o.v])} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",border:`1.5px solid ${chk?"#1B2B4B":"#e2e8f0"}`,borderRadius:7,background:chk?"#eef1f7":"#fff",cursor:"pointer",marginBottom:5,fontSize:12}}><input type="checkbox" readOnly checked={chk} style={{accentColor:"#1B2B4B"}}/>{o.l}</div>
              })}
            </div>
          </div>
          <Grid>
            <Field label="Document number"><FInput value={form.docNumber} onChange={e=>u("docNumber",e.target.value)} placeholder="Doc number"/></Field>
            <Field label="Issuing authority"><FInput value={form.issuingAuthority} onChange={e=>u("issuingAuthority",e.target.value)} placeholder="e.g. U.S. Dept of State"/></Field>
            <Field label="Document expiry"><FInput type="date" value={form.docExpiry} onChange={e=>u("docExpiry",e.target.value)}/></Field>
            <Field label="Verification date" req><FInput type="date" value={form.verificationDate} onChange={e=>u("verificationDate",e.target.value)}/></Field>
          </Grid>
          <SHd>Employer certification</SHd>
          <SubSec>
            <Grid>
              <Field label="Authorized rep name" req><FInput value={form.i9RepName} onChange={e=>u("i9RepName",e.target.value)} placeholder="Full name"/></Field>
              <Field label="Title"><FInput value={form.i9RepTitle} onChange={e=>u("i9RepTitle",e.target.value)} placeholder="e.g. HR Manager"/></Field>
              <Field label="Business name" req><FInput value={form.i9BizName} onChange={e=>u("i9BizName",e.target.value)} placeholder="OptiSolutions"/></Field>
              <Field label="Business address"><FInput value={form.i9BizAddress} onChange={e=>u("i9BizAddress",e.target.value)} placeholder="Street, City, State, ZIP"/></Field>
            </Grid>
            <label style={{display:"flex",alignItems:"flex-start",gap:10,marginTop:12,cursor:"pointer"}}>
              <input type="checkbox" checked={form.i9Certified} onChange={e=>u("i9Certified",e.target.checked)} style={{marginTop:3,accentColor:"#1B2B4B",width:15,height:15,flexShrink:0}}/>
              <span style={{fontSize:12.5,color:"#475569",lineHeight:1.6}}>I attest, under penalty of perjury, that I have examined the document(s) presented, that they appear genuine and relate to the employee named, and that to the best of my knowledge this employee is authorized to work in the United States.</span>
            </label>
          </SubSec>
          <div style={{fontSize:12,color:"#94a3b8",background:"#f8fafc",borderRadius:8,padding:"8px 12px"}}>🔒 Retain completed I-9 for 3 years after hire or 1 year after employment ends — whichever is later.</div>
          <StepActions onBack={back} onNext={next} nextLabel="Pay & Tax →"/>
        </div>}

        {/* Step 4: Pay & Tax */}
        {step===3&&<div>
          <h2 style={{fontSize:18,fontWeight:600,color:"#1B2B4B",marginBottom:4}}>Pay & tax setup</h2>
          <p style={{fontSize:13,color:"#64748b",marginBottom:"1.25rem"}}>Compensation · Federal W-4 · Rhode Island W-4 · Massachusetts W-4</p>
          <SHd>Compensation</SHd>
          <Grid>
            <Field label="Pay rate" req><FInput type="number" value={form.payRate} onChange={e=>u("payRate",e.target.value)} placeholder="e.g. 50000 or 18.50"/></Field>
            <Field label="Rate type" req><FSelect value={form.rateType} onChange={e=>u("rateType",e.target.value)}><option value="">Select</option><option>Annual salary</option><option>Hourly</option><option>Commission</option></FSelect></Field>
            <Field label="Pay frequency"><FSelect value={form.payFrequency} onChange={e=>u("payFrequency",e.target.value)}><option>Bi-weekly</option><option>Weekly</option><option>Semi-monthly</option><option>Monthly</option></FSelect></Field>
            <Field label="Payment method" req><FSelect value={form.paymentMethod} onChange={e=>u("paymentMethod",e.target.value)}><option value="">Select</option><option>Direct deposit</option><option>Paper check</option><option>Pay card</option></FSelect></Field>
            {form.paymentMethod==="Direct deposit"&&<>
              <Field label="Routing number"><FInput value={form.bankRouting} onChange={e=>u("bankRouting",e.target.value)} placeholder="9-digit routing number" maxLength={9}/></Field>
              <Field label="Account number"><FInput value={form.bankAccount} onChange={e=>u("bankAccount",e.target.value)} placeholder="Account number"/></Field>
              <Field label="Account type"><FSelect value={form.accountType} onChange={e=>u("accountType",e.target.value)}><option>Checking</option><option>Savings</option></FSelect></Field>
            </>}
          </Grid>
          <SHd>Federal W-4</SHd>
          <SubSec>
            <Grid>
              <Field label="Filing status" req><FSelect value={form.fedFilingStatus} onChange={e=>u("fedFilingStatus",e.target.value)}><option value="">Select</option><option>Single or MFS</option><option>Married filing jointly</option><option>Head of household</option></FSelect></Field>
              <Field label="Multiple jobs/spouse works"><FSelect value={form.multipleJobs} onChange={e=>u("multipleJobs",e.target.value)}><option>No</option><option>Yes</option></FSelect></Field>
              <Field label="Dependents credit ($)"><FInput type="number" value={form.dependentsCredit} onChange={e=>u("dependentsCredit",e.target.value)} placeholder="0.00"/></Field>
              <Field label="Extra withholding ($)"><FInput type="number" value={form.extraWithholding} onChange={e=>u("extraWithholding",e.target.value)} placeholder="0.00"/></Field>
              <Field label="Exempt?"><FSelect value={form.fedExempt} onChange={e=>u("fedExempt",e.target.value)}><option>No</option><option>Yes — claim exemption</option></FSelect></Field>
            </Grid>
          </SubSec>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:14,marginBottom:8}}><span style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em"}}>Rhode Island W-4</span><span className="badge badge-blue">RI</span></div>
          <SubSec>
            <Grid>
              <Field label="RI filing status" req><FSelect value={form.riFilingStatus} onChange={e=>u("riFilingStatus",e.target.value)}><option value="">Select</option><option>Single</option><option>Married</option><option>Married — withhold at Single rate</option></FSelect></Field>
              <Field label="RI allowances claimed"><FInput type="number" value={form.riAllowances} onChange={e=>u("riAllowances",e.target.value)} placeholder="0"/></Field>
              <Field label="Additional RI withholding ($)"><FInput type="number" value={form.riExtraWithholding} onChange={e=>u("riExtraWithholding",e.target.value)} placeholder="0.00"/></Field>
              <Field label="Exempt from RI?"><FSelect value={form.riExempt} onChange={e=>u("riExempt",e.target.value)}><option>No</option><option>Yes — claim exemption</option></FSelect></Field>
            </Grid>
          </SubSec>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:14,marginBottom:8}}><span style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em"}}>Massachusetts W-4 / M-4</span><span className="badge badge-green">MA</span></div>
          <SubSec>
            <Grid>
              <Field label="MA filing status" req><FSelect value={form.maFilingStatus} onChange={e=>u("maFilingStatus",e.target.value)}><option value="">Select</option><option>Single</option><option>Married filing jointly</option><option>Married filing separately</option><option>Head of household</option></FSelect></Field>
              <Field label="Personal exemption (line A)"><FSelect value={form.maPersonalExemption} onChange={e=>u("maPersonalExemption",e.target.value)}><option value="">Select</option><option>$4,400 — Single</option><option>$8,800 — Married jointly</option><option>$4,400 — Married separately</option><option>$6,800 — Head of household</option></FSelect></Field>
              <Field label="Dependent exemptions (line C)"><FInput type="number" value={form.maDependents} onChange={e=>u("maDependents",e.target.value)} placeholder="0"/></Field>
              <Field label="Age 65+ (line D)"><FSelect value={form.maAge65} onChange={e=>u("maAge65",e.target.value)}><option>No</option><option>Yes — employee</option><option>Yes — both spouses</option></FSelect></Field>
              <Field label="Blind exemption (line E)"><FSelect value={form.maBlind} onChange={e=>u("maBlind",e.target.value)}><option>No</option><option>Yes — employee</option><option>Yes — both spouses</option></FSelect></Field>
              <Field label="Additional MA withholding ($)"><FInput type="number" value={form.maExtraWithholding} onChange={e=>u("maExtraWithholding",e.target.value)} placeholder="0.00"/></Field>
            </Grid>
          </SubSec>
          <StepActions onBack={back} onNext={next} nextLabel="Benefits →"/>
        </div>}

        {/* Step 5: Benefits */}
        {step===4&&<div>
          <h2 style={{fontSize:18,fontWeight:600,color:"#1B2B4B",marginBottom:4}}>Benefits enrollment</h2>
          <p style={{fontSize:13,color:"#64748b",marginBottom:"1.5rem"}}>Select benefits for this employee</p>
          {/* SIMPLE IRA */}
          <div style={{border:`1.5px solid ${form.simpleIRA?"#1B2B4B":"#e2e8f0"}`,borderRadius:12,padding:"1.25rem",marginBottom:12,background:form.simpleIRA?"#f8f9fb":"#fff",transition:"all .2s"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:40,height:40,borderRadius:10,background:form.simpleIRA?"#1B2B4B":"#f4f6fa",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}><Building2 size={18} color={form.simpleIRA?"#fff":"#64748b"}/></div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14,color:"#1B2B4B",marginBottom:2}}>SIMPLE IRA</div>
                <div style={{fontSize:12,color:"#64748b"}}>Employer matches 100% of contributions up to 3% of compensation. Pre-tax deduction.</div>
              </div>
              <Toggle checked={form.simpleIRA} onChange={v=>u("simpleIRA",v)}/>
            </div>
            {form.simpleIRA&&<div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #e2e8f0"}}>
              <InfoBox type="info">Employer matches up to <strong>3%</strong> of gross pay. You may contribute above 3% — match is capped at 3%.</InfoBox>
              <Grid>
                <Field label="Employee contribution %"><FInput type="number" value={form.iraContributionPct} onChange={e=>u("iraContributionPct",e.target.value)} placeholder="e.g. 3" min={0} max={100}/></Field>
                <Field label="Employer match (auto)"><FInput value={form.iraContributionPct?`${Math.min(parseFloat(form.iraContributionPct)||0,3).toFixed(1)}% employer match`:""} readOnly style={{background:"#f4f6fa",color:"#1B2B4B",fontWeight:500}}/></Field>
                <Field label="Beneficiary name"><FInput value={form.iraBeneficiary} onChange={e=>u("iraBeneficiary",e.target.value)} placeholder="Full legal name"/></Field>
                <Field label="Beneficiary relationship"><FInput value={form.iraBeneficiaryRel} onChange={e=>u("iraBeneficiaryRel",e.target.value)} placeholder="e.g. Spouse, Child"/></Field>
              </Grid>
            </div>}
          </div>
          {/* Flexible PTO */}
          <div style={{border:`1.5px solid ${form.flexPTO?"#1B2B4B":"#e2e8f0"}`,borderRadius:12,padding:"1.25rem",background:form.flexPTO?"#f8f9fb":"#fff",transition:"all .2s"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:40,height:40,borderRadius:10,background:form.flexPTO?"#1B2B4B":"#f4f6fa",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}><Calendar size={18} color={form.flexPTO?"#fff":"#64748b"}/></div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14,color:"#1B2B4B",marginBottom:2}}>Flexible PTO bank</div>
                <div style={{fontSize:12,color:"#64748b"}}>Full-time employees only. Vacation, sick, and personal days in one combined bank.</div>
              </div>
              <Toggle checked={form.flexPTO} onChange={v=>u("flexPTO",v)}/>
            </div>
            {form.flexPTO&&<div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #e2e8f0"}}>
              {!form.employmentType.includes("Full-time")&&form.employmentType?(
                <InfoBox type="warn">Flexible PTO is for full-time employees only. This employee is classified as &quot;{form.employmentType}&quot;.</InfoBox>
              ):<InfoBox type="ok">Eligible as a full-time employee.</InfoBox>}
              <Grid>
                <Field label="PTO start date"><FInput type="date" value={form.ptoStartDate} onChange={e=>u("ptoStartDate",e.target.value)}/></Field>
                <Field label="Accrual plan"><FSelect value={form.ptoPlan} onChange={e=>u("ptoPlan",e.target.value)}><option>Flexible (use as needed)</option><option>Accrual-based (hours per period)</option></FSelect></Field>
              </Grid>
            </div>}
          </div>
          <StepActions onBack={back} onNext={next} nextLabel="Signature →"/>
        </div>}

        {/* Step 6: Signature */}
        {step===5&&<div>
          <h2 style={{fontSize:18,fontWeight:600,color:"#1B2B4B",marginBottom:4}}>Electronic signature</h2>
          <p style={{fontSize:13,color:"#64748b",marginBottom:"1rem"}}>By signing, the employee acknowledges and consents to all enrollment information</p>
          <InfoBox type="purple">This electronic signature is legally binding under the <strong>E-SIGN Act (15 U.S.C. § 7001)</strong> — equivalent to a handwritten signature for all enrollment documents.</InfoBox>
          <SHd>Employee acknowledgment</SHd>
          <SubSec>
            <p style={{fontSize:13,color:"#475569",marginBottom:8}}>I, <strong style={{color:"#1B2B4B"}}>{[form.firstName,form.lastName].filter(Boolean).join(" ")||"[employee name]"}</strong>, confirm that:</p>
            <ul style={{paddingLeft:18,display:"flex",flexDirection:"column",gap:5}}>
              {["All information I have provided is true and accurate.","I authorize withholding elections on the Federal W-4, Rhode Island W-4, and Massachusetts M-4.","I understand my benefits elections including SIMPLE IRA and Flexible PTO (if selected).","I have presented original, unexpired documents for I-9 verification.","I consent to receive payroll and HR documents electronically through iSolved."].map((item,i)=>(
                <li key={i} style={{fontSize:12.5,color:"#64748b",lineHeight:1.6}}>{item}</li>
              ))}
            </ul>
          </SubSec>
          <Grid>
            <Field label="Full legal name (typed)" req><FInput value={form.sigTypedName} onChange={e=>u("sigTypedName",e.target.value)} placeholder="Type your full legal name"/></Field>
            <Field label="Date" req><FInput type="date" value={form.sigDate} onChange={e=>u("sigDate",e.target.value)}/></Field>
          </Grid>
          <SHd>Draw your signature <span style={{fontSize:11,fontWeight:400,color:"#94a3b8",textTransform:"none",letterSpacing:0}}>— mouse or touch</span></SHd>
          <div style={{border:`2px solid ${hasSig?"#1B2B4B":"#e2e8f0"}`,borderRadius:10,background:"#fff",marginBottom:8,overflow:"hidden",cursor:"crosshair",transition:"border-color .2s",touchAction:"none"}}>
            <canvas ref={canvasRef} style={{display:"block",width:"100%",height:130}}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1rem"}}>
            <button onClick={clearSig} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"#991b1b",background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:6,padding:"5px 10px",cursor:"pointer"}}><Trash2 size={12}/>Clear</button>
            <span style={{fontSize:12,color:hasSig?"#15803d":"#94a3b8",display:"flex",alignItems:"center",gap:5}}>
              {hasSig?<><CheckCircle2 size={13}/>Signature captured</>:"← Draw your signature above"}
            </span>
          </div>
          <SHd>Employer witness</SHd>
          <SubSec>
            <Grid>
              <Field label="Employer rep name" req><FInput value={form.sigEmpName} onChange={e=>u("sigEmpName",e.target.value)} placeholder="Full name"/></Field>
              <Field label="Title"><FInput value={form.sigEmpTitle} onChange={e=>u("sigEmpTitle",e.target.value)} placeholder="e.g. HR Manager"/></Field>
            </Grid>
          </SubSec>
          <StepActions onBack={back} onNext={next} nextLabel="New hire checklist →"/>
        </div>}

        {/* Step 7: Checklist */}
        {step===6&&<div>
          <h2 style={{fontSize:18,fontWeight:600,color:"#1B2B4B",marginBottom:4}}>New hire checklist</h2>
          <p style={{fontSize:13,color:"#64748b",marginBottom:"1rem"}}>Track completion of all onboarding tasks</p>
          <div style={{borderRadius:10,padding:"14px 16px",marginBottom:"1.25rem",background:doneCount===CHECKLIST_ITEMS.length?"#dcfce7":"#f8fafc",border:`1px solid ${doneCount===CHECKLIST_ITEMS.length?"#86efac":"#e8ecf4"}`,transition:"all .3s"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13,fontWeight:600,color:doneCount===CHECKLIST_ITEMS.length?"#15803d":"#1B2B4B"}}>
                {doneCount===CHECKLIST_ITEMS.length?"🎉 All tasks complete!":` ${doneCount} of ${CHECKLIST_ITEMS.length} tasks complete`}
              </span>
              <span style={{fontSize:13,fontWeight:700,color:doneCount===CHECKLIST_ITEMS.length?"#16a34a":"#1B2B4B"}}>{Math.round((doneCount/CHECKLIST_ITEMS.length)*100)}%</span>
            </div>
            <div style={{height:8,background:"#fff",borderRadius:4,overflow:"hidden",border:"1px solid #e8ecf4"}}>
              <div style={{height:"100%",width:`${Math.round((doneCount/CHECKLIST_ITEMS.length)*100)}%`,background:doneCount===CHECKLIST_ITEMS.length?"#16a34a":"#1B2B4B",borderRadius:4,transition:"width .4s ease"}}/>
            </div>
          </div>
          {cats.map(cat=>(
            <div key={cat} style={{marginBottom:"1.25rem"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>{cat}</div>
              {CHECKLIST_ITEMS.filter(i=>i.cat===cat).map(item=>{
                const done = !!checked[item.id]
                return (
                  <div key={item.id} onClick={()=>setChecked(p=>({...p,[item.id]:!p[item.id]}))} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",border:`1.5px solid ${done?"#86efac":"#e8ecf4"}`,borderRadius:9,background:done?"#f0fdf4":"#fff",cursor:"pointer",marginBottom:6,transition:"all .15s"}}>
                    <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${done?"#16a34a":"#cbd5e1"}`,background:done?"#16a34a":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all .2s"}}>
                      {done&&<svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                    </div>
                    <div>
                      <div style={{fontSize:13,fontWeight:500,color:done?"#15803d":"#1B2B4B",textDecoration:done?"line-through":"none",textDecorationColor:"#86efac"}}>{item.label}</div>
                      <div style={{fontSize:11,color:done?"#4ade80":"#94a3b8",marginTop:1}}>{item.sub}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:"1.5rem",paddingTop:"1.25rem",borderTop:"1px solid #f1f5f9",flexWrap:"wrap"}}>
            <button onClick={back} className="btn">← Back</button>
            <button onClick={()=>alert("Export enrollment packet as PDF")} className="btn">↓ Export packet</button>
            <button onClick={()=>{setEnrolled(p=>[...p,form]);setForm(initialForm);setStep(0);setChecked({});setShowRoster(true)}} className="btn btn-primary btn-red">
              <CheckCircle2 size={14}/>Complete enrollment
            </button>
          </div>
        </div>}
      </div>
    </div>
  )
}
