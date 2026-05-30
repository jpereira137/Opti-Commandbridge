"use client"

import { FolderOpen, Upload, FileText, Download } from "lucide-react"
import Header from "@/components/layout/Header"
import { Card, Button } from "@/components/ui"
import { MOCK_DOCUMENTS, MOCK_EMPLOYEES } from "@/lib/data"

export default function DocumentsPage() {
  const needsSignature = MOCK_DOCUMENTS.filter(d => d.signatureRequired && d.signedBy.length < MOCK_EMPLOYEES.length)

  return (
    <div className="animate-in">
      <Header
        title="Documents"
        subtitle="Company policies and employee documents"
        notificationCount={needsSignature.length}
        actions={
          <Button variant="primary" size="sm"><Upload size={14} /> Upload</Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total documents", value: MOCK_DOCUMENTS.length, color: "bg-blue-50 text-blue-700 border-blue-200" },
            { label: "Needs signature", value: needsSignature.length, color: "bg-amber-50 text-amber-700 border-amber-200" },
            { label: "Policies", value: MOCK_DOCUMENTS.filter(d => d.category === "Policy").length, color: "bg-slate-50 text-slate-600 border-slate-200" },
            { label: "Benefits", value: MOCK_DOCUMENTS.filter(d => d.category === "Benefits").length, color: "bg-green-50 text-green-700 border-green-200" },
          ].map(s => (
            <Card key={s.label} className={`p-4 border ${s.color}`}>
              <p className="text-2xl font-bold font-display">{s.value}</p>
              <p className="text-xs font-medium mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Documents list */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FolderOpen size={16} className="text-blue-600" />
              All documents
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {MOCK_DOCUMENTS.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FileText size={18} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.category} · {doc.size} · Uploaded {doc.uploadedAt}</p>
                </div>
                {doc.signatureRequired && (
                  <span className={`badge ${doc.signedBy.length >= MOCK_EMPLOYEES.length ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {doc.signedBy.length}/{MOCK_EMPLOYEES.length} signed
                  </span>
                )}
                <Button variant="ghost" size="sm"><Download size={14} /></Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
