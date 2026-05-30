"use client"

import { Settings, Users, Zap, Shield, Bell, Database } from "lucide-react"
import Header from "@/components/layout/Header"
import { Card, Button } from "@/components/ui"

export default function AdminPage() {
  const sections = [
    { 
      title: "User management", 
      description: "Manage user accounts, roles, and permissions",
      icon: Users,
      items: ["Add/remove users", "Assign roles", "Reset passwords"]
    },
    { 
      title: "Integrations", 
      description: "Connect external services and APIs",
      icon: Zap,
      items: ["Connecteam API", "Payroll integration", "Calendar sync"]
    },
    { 
      title: "Security", 
      description: "Configure security settings and audit logs",
      icon: Shield,
      items: ["Two-factor auth", "Session management", "Audit logs"]
    },
    { 
      title: "Notifications", 
      description: "Email and push notification preferences",
      icon: Bell,
      items: ["Email templates", "Notification rules", "Digest settings"]
    },
    { 
      title: "Data & backup", 
      description: "Export data and manage backups",
      icon: Database,
      items: ["Export employees", "Download reports", "Backup settings"]
    },
  ]

  return (
    <div className="animate-in">
      <Header
        title="Settings"
        subtitle="System configuration and administration"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map(section => (
            <Card key={section.title} className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-navy-100 transition-colors">
                  <section.icon size={18} className="text-slate-500 group-hover:text-navy-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 group-hover:text-navy-900 transition-colors">{section.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{section.description}</p>
                  <ul className="mt-3 space-y-1">
                    {section.items.map(item => (
                      <li key={item} className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
