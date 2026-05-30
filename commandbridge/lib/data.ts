export type EmpStatus = "active" | "inactive" | "onboarding"

export interface Employee {
  id: string; firstName: string; lastName: string; email: string; phone: string;
  role: string; department: string; employmentType: string; startDate: string;
  status: EmpStatus; manager: string; location: string; payRate: number;
  rateType: string; connecteamAccount: 1|2;
}
export interface Shift {
  id:string; employeeId:string; date:string; startTime:string; endTime:string;
  department:string; location:string; status:"scheduled"|"completed"|"missed"; connecteamAccount:1|2;
}
export interface PTORequest {
  id:string; employeeId:string; type:"vacation"|"sick"|"personal"|"bereavement";
  startDate:string; endDate:string; days:number; status:"pending"|"approved"|"denied";
  note:string; submittedDate:string;
}
export interface TimeEntry {
  id:string; employeeId:string; date:string; clockIn:string; clockOut:string;
  hours:number; status:"pending"|"approved"; connecteamAccount:1|2;
}
export interface Announcement {
  id:string; title:string; body:string; author:string;
  audience:"all"|"dept-a"|"dept-b"; publishedAt:string; readBy:string[]; pinned:boolean;
}
export interface PerformanceReview {
  id:string; employeeId:string; reviewerId:string; period:string; overallRating:number;
  status:"draft"|"submitted"|"acknowledged";
  goals:{id:string;title:string;progress:number;due:string}[];
  submittedAt?:string;
}
export interface Document {
  id:string; name:string; category:string; uploadedBy:string; uploadedAt:string;
  size:string; signatureRequired:boolean; signedBy:string[]; url:string;
}

export const EMPLOYEES: Employee[] = [
  {id:"e1",firstName:"Sarah",lastName:"Marchetti",email:"s.marchetti@optisolutions.com",phone:"(401) 555-0101",role:"Operations Manager",department:"Operations",employmentType:"Full-time salaried",startDate:"2021-03-15",status:"active",manager:"—",location:"Providence, RI",payRate:72000,rateType:"Annual salary",connecteamAccount:1},
  {id:"e2",firstName:"David",lastName:"Chen",email:"d.chen@optisolutions.com",phone:"(401) 555-0102",role:"Field Technician",department:"Operations",employmentType:"Full-time hourly",startDate:"2022-07-01",status:"active",manager:"Sarah Marchetti",location:"Providence, RI",payRate:24.50,rateType:"Hourly",connecteamAccount:1},
  {id:"e3",firstName:"Jasmine",lastName:"Rivera",email:"j.rivera@optisolutions.com",phone:"(617) 555-0103",role:"HR Specialist",department:"HR",employmentType:"Full-time salaried",startDate:"2020-11-08",status:"active",manager:"—",location:"Boston, MA",payRate:65000,rateType:"Annual salary",connecteamAccount:2},
  {id:"e4",firstName:"Marcus",lastName:"Thompson",email:"m.thompson@optisolutions.com",phone:"(401) 555-0104",role:"Field Technician",department:"Operations",employmentType:"Full-time hourly",startDate:"2023-01-23",status:"active",manager:"Sarah Marchetti",location:"Providence, RI",payRate:22.00,rateType:"Hourly",connecteamAccount:1},
  {id:"e5",firstName:"Priya",lastName:"Nair",email:"p.nair@optisolutions.com",phone:"(617) 555-0105",role:"Customer Success",department:"Support",employmentType:"Full-time salaried",startDate:"2022-04-11",status:"active",manager:"Jasmine Rivera",location:"Boston, MA",payRate:58000,rateType:"Annual salary",connecteamAccount:2},
  {id:"e6",firstName:"Tyler",lastName:"Okafor",email:"t.okafor@optisolutions.com",phone:"(401) 555-0106",role:"Field Technician",department:"Operations",employmentType:"Part-time hourly",startDate:"2023-09-05",status:"active",manager:"Sarah Marchetti",location:"Providence, RI",payRate:19.00,rateType:"Hourly",connecteamAccount:1},
  {id:"e7",firstName:"Amanda",lastName:"Walsh",email:"a.walsh@optisolutions.com",phone:"(617) 555-0107",role:"Billing Coordinator",department:"Finance",employmentType:"Full-time salaried",startDate:"2021-06-14",status:"active",manager:"Jasmine Rivera",location:"Boston, MA",payRate:55000,rateType:"Annual salary",connecteamAccount:2},
  {id:"e8",firstName:"Kevin",lastName:"Santos",email:"k.santos@optisolutions.com",phone:"(401) 555-0108",role:"Field Technician",department:"Operations",employmentType:"Full-time hourly",startDate:"2024-02-19",status:"onboarding",manager:"Sarah Marchetti",location:"Providence, RI",payRate:22.00,rateType:"Hourly",connecteamAccount:1},
  {id:"e9",firstName:"Diane",lastName:"Park",email:"d.park@optisolutions.com",phone:"(617) 555-0109",role:"Support Specialist",department:"Support",employmentType:"Full-time hourly",startDate:"2023-05-30",status:"active",manager:"Priya Nair",location:"Boston, MA",payRate:20.50,rateType:"Hourly",connecteamAccount:2},
  {id:"e10",firstName:"Luis",lastName:"Gomez",email:"l.gomez@optisolutions.com",phone:"(401) 555-0110",role:"Field Technician",department:"Operations",employmentType:"Seasonal",startDate:"2024-05-01",status:"active",manager:"Sarah Marchetti",location:"Providence, RI",payRate:18.00,rateType:"Hourly",connecteamAccount:1},
]

export const SHIFTS: Shift[] = [
  {id:"s1",employeeId:"e2",date:"2026-05-29",startTime:"08:00",endTime:"16:00",department:"Operations",location:"Providence, RI",status:"scheduled",connecteamAccount:1},
  {id:"s2",employeeId:"e4",date:"2026-05-29",startTime:"09:00",endTime:"17:00",department:"Operations",location:"Providence, RI",status:"scheduled",connecteamAccount:1},
  {id:"s3",employeeId:"e6",date:"2026-05-29",startTime:"12:00",endTime:"18:00",department:"Operations",location:"Providence, RI",status:"scheduled",connecteamAccount:1},
  {id:"s4",employeeId:"e5",date:"2026-05-29",startTime:"08:30",endTime:"16:30",department:"Support",location:"Boston, MA",status:"scheduled",connecteamAccount:2},
  {id:"s5",employeeId:"e9",date:"2026-05-29",startTime:"10:00",endTime:"18:00",department:"Support",location:"Boston, MA",status:"scheduled",connecteamAccount:2},
  {id:"s6",employeeId:"e10",date:"2026-05-30",startTime:"07:00",endTime:"15:00",department:"Operations",location:"Providence, RI",status:"scheduled",connecteamAccount:1},
  {id:"s7",employeeId:"e7",date:"2026-05-29",startTime:"09:00",endTime:"17:00",department:"Finance",location:"Boston, MA",status:"scheduled",connecteamAccount:2},
  {id:"s8",employeeId:"e2",date:"2026-05-28",startTime:"08:00",endTime:"16:00",department:"Operations",location:"Providence, RI",status:"completed",connecteamAccount:1},
]

export const TIME_ENTRIES: TimeEntry[] = [
  {id:"t1",employeeId:"e2",date:"2026-05-27",clockIn:"08:02",clockOut:"16:05",hours:8.0,status:"approved",connecteamAccount:1},
  {id:"t2",employeeId:"e4",date:"2026-05-27",clockIn:"09:01",clockOut:"17:10",hours:8.1,status:"approved",connecteamAccount:1},
  {id:"t3",employeeId:"e6",date:"2026-05-27",clockIn:"12:00",clockOut:"18:00",hours:6.0,status:"pending",connecteamAccount:1},
  {id:"t4",employeeId:"e5",date:"2026-05-27",clockIn:"08:35",clockOut:"16:40",hours:8.1,status:"approved",connecteamAccount:2},
  {id:"t5",employeeId:"e9",date:"2026-05-27",clockIn:"10:00",clockOut:"18:05",hours:8.1,status:"pending",connecteamAccount:2},
  {id:"t6",employeeId:"e10",date:"2026-05-27",clockIn:"07:00",clockOut:"15:00",hours:8.0,status:"approved",connecteamAccount:1},
  {id:"t7",employeeId:"e2",date:"2026-05-28",clockIn:"08:00",clockOut:"16:00",hours:8.0,status:"pending",connecteamAccount:1},
  {id:"t8",employeeId:"e7",date:"2026-05-27",clockIn:"09:00",clockOut:"17:00",hours:8.0,status:"approved",connecteamAccount:2},
]

export const PTO_REQUESTS: PTORequest[] = [
  {id:"p1",employeeId:"e2",type:"vacation",startDate:"2026-06-15",endDate:"2026-06-19",days:5,status:"pending",note:"Family trip",submittedDate:"2026-05-20"},
  {id:"p2",employeeId:"e5",type:"sick",startDate:"2026-05-30",endDate:"2026-05-30",days:1,status:"approved",note:"Doctor appointment",submittedDate:"2026-05-29"},
  {id:"p3",employeeId:"e9",type:"personal",startDate:"2026-06-03",endDate:"2026-06-03",days:1,status:"pending",note:"Personal errand",submittedDate:"2026-05-28"},
  {id:"p4",employeeId:"e4",type:"vacation",startDate:"2026-07-04",endDate:"2026-07-08",days:5,status:"approved",note:"Fourth of July week",submittedDate:"2026-05-15"},
  {id:"p5",employeeId:"e7",type:"bereavement",startDate:"2026-05-26",endDate:"2026-05-28",days:3,status:"approved",note:"Family bereavement",submittedDate:"2026-05-25"},
  {id:"p6",employeeId:"e6",type:"sick",startDate:"2026-06-02",endDate:"2026-06-02",days:1,status:"denied",note:"",submittedDate:"2026-05-27"},
]

export const ANNOUNCEMENTS: Announcement[] = [
  {id:"a1",title:"Welcome to CommandBridge!",body:"We are excited to launch OptiSolutions CommandBridge — your new central hub for HR, payroll, scheduling, and team management. All employees can now submit PTO requests, view schedules, and access documents in one place.",author:"Jasmine Rivera",audience:"all",publishedAt:"2026-05-28T09:00:00Z",readBy:["e1","e2","e3","e4","e5"],pinned:true},
  {id:"a2",title:"Q2 performance reviews due June 15",body:"All managers: Q2 performance reviews must be submitted by June 15. Please review your direct reports and complete all goal assessments. Training sessions are available on request.",author:"Jasmine Rivera",audience:"all",publishedAt:"2026-05-25T14:00:00Z",readBy:["e1","e3","e7"],pinned:false},
  {id:"a3",title:"Operations team: updated shift schedule June 1",body:"Effective June 1, all Operations team members will follow the updated shift rotation. Please review the new schedule in the Scheduling module and confirm your availability by May 31.",author:"Sarah Marchetti",audience:"dept-a",publishedAt:"2026-05-22T11:00:00Z",readBy:["e2","e4","e6"],pinned:false},
  {id:"a4",title:"Boston office: parking update",body:"Starting June 3, the north parking lot will be under renovation through August. Please use the public garage on State Street. Expense reimbursement is available — submit through Finance.",author:"Amanda Walsh",audience:"dept-b",publishedAt:"2026-05-20T10:00:00Z",readBy:["e3","e5","e7","e9"],pinned:false},
]

export const REVIEWS: PerformanceReview[] = [
  {id:"r1",employeeId:"e2",reviewerId:"e1",period:"Q1 2026",overallRating:4,status:"acknowledged",goals:[{id:"g1",title:"Complete 95% of assigned tickets on time",progress:92,due:"2026-03-31"},{id:"g2",title:"Complete safety certification",progress:100,due:"2026-02-28"}],submittedAt:"2026-04-05"},
  {id:"r2",employeeId:"e4",reviewerId:"e1",period:"Q1 2026",overallRating:3,status:"submitted",goals:[{id:"g3",title:"Reduce callback rate by 10%",progress:65,due:"2026-03-31"},{id:"g4",title:"Team mentoring hours",progress:80,due:"2026-03-31"}],submittedAt:"2026-04-08"},
  {id:"r3",employeeId:"e5",reviewerId:"e3",period:"Q1 2026",overallRating:5,status:"acknowledged",goals:[{id:"g5",title:"Achieve 95% CSAT score",progress:97,due:"2026-03-31"},{id:"g6",title:"Document 20 new SOPs",progress:100,due:"2026-03-31"}],submittedAt:"2026-04-10"},
  {id:"r4",employeeId:"e6",reviewerId:"e1",period:"Q2 2026",overallRating:0,status:"draft",goals:[{id:"g7",title:"Attendance improvement plan",progress:0,due:"2026-06-30"}],submittedAt:undefined},
]

export const DOCUMENTS: Document[] = [
  {id:"d1",name:"Employee Handbook 2026",category:"Policy",uploadedBy:"Jasmine Rivera",uploadedAt:"2026-01-02",size:"2.4 MB",signatureRequired:true,signedBy:["e1","e2","e3","e4","e5","e6","e7"],url:"#"},
  {id:"d2",name:"SIMPLE IRA Plan Summary",category:"Benefits",uploadedBy:"Jasmine Rivera",uploadedAt:"2026-01-15",size:"1.1 MB",signatureRequired:false,signedBy:[],url:"#"},
  {id:"d3",name:"PTO Policy — Flexible Bank",category:"Policy",uploadedBy:"Jasmine Rivera",uploadedAt:"2026-02-01",size:"412 KB",signatureRequired:true,signedBy:["e1","e2","e3","e4","e5"],url:"#"},
  {id:"d4",name:"Safety & Compliance Training Cert",category:"Certification",uploadedBy:"Sarah Marchetti",uploadedAt:"2026-02-28",size:"580 KB",signatureRequired:false,signedBy:[],url:"#"},
  {id:"d5",name:"Direct Deposit Authorization Form",category:"Payroll",uploadedBy:"Jasmine Rivera",uploadedAt:"2026-03-01",size:"220 KB",signatureRequired:true,signedBy:["e1","e2","e3","e4","e5","e6","e7","e9","e10"],url:"#"},
  {id:"d6",name:"Non-Disclosure Agreement 2026",category:"Legal",uploadedBy:"Jasmine Rivera",uploadedAt:"2026-01-10",size:"340 KB",signatureRequired:true,signedBy:["e1","e2","e3","e5","e7"],url:"#"},
]

export const getEmployee = (id:string) => EMPLOYEES.find(e=>e.id===id)
export const fullName = (e:Employee) => `${e.firstName} ${e.lastName}`
export const initials = (e:Employee) => `${e.firstName[0]}${e.lastName[0]}`.toUpperCase()
export const fmtPay = (rate:number,type:string) => type==="Hourly"?`$${rate.toFixed(2)}/hr`:`$${rate.toLocaleString()}/yr`
export const fmtDate = (d:string) => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
export const statusBadge = (s:string) => ({active:"badge-green",inactive:"badge-gray",onboarding:"badge-amber",pending:"badge-amber",approved:"badge-green",denied:"badge-red",scheduled:"badge-blue",completed:"badge-green",missed:"badge-red",draft:"badge-gray",submitted:"badge-blue",acknowledged:"badge-green"}[s]||"badge-gray")
