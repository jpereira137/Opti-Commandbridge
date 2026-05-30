"use client"

import { Megaphone, Plus, Pin, Clock } from "lucide-react"
import Header from "@/components/layout/Header"
import { Card, Button } from "@/components/ui"
import { MOCK_ANNOUNCEMENTS } from "@/lib/data"
import { formatDistanceToNow } from "date-fns"

export default function AnnouncementsPage() {
  const pinned = MOCK_ANNOUNCEMENTS.filter(a => a.pinned)
  const recent = MOCK_ANNOUNCEMENTS.filter(a => !a.pinned)

  return (
    <div className="animate-in">
      <Header
        title="Announcements"
        subtitle="Company-wide communications"
        actions={
          <Button variant="primary" size="sm"><Plus size={14} /> New announcement</Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Pin size={12} /> Pinned
            </h3>
            {pinned.map(a => (
              <Card key={a.id} className="p-5 border-l-4 border-l-amber-400">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-slate-800">{a.title}</h4>
                  <span className="badge bg-amber-100 text-amber-700 capitalize">{a.audience === "all" ? "Everyone" : a.audience}</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{a.body}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>By {a.authorName}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {formatDistanceToNow(new Date(a.publishedAt))} ago</span>
                  <span>{a.readBy.length} read</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Recent */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent</h3>
          {recent.map(a => (
            <Card key={a.id} className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-slate-800">{a.title}</h4>
                <span className="badge bg-slate-100 text-slate-600 capitalize">{a.audience === "all" ? "Everyone" : a.audience}</span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{a.body}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>By {a.authorName}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {formatDistanceToNow(new Date(a.publishedAt))} ago</span>
                <span>{a.readBy.length} read</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
