"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react"

interface Alert {
  id: string
  alert_type: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  created_at: string
  resolved: boolean
}

interface AlertsPanelProps {
  alerts: Alert[]
}

const severityConfig = {
  low: { icon: Info, color: "bg-blue-500/10 text-blue-500", label: "Low" },
  medium: { icon: AlertTriangle, color: "bg-yellow-500/10 text-yellow-500", label: "Medium" },
  high: { icon: AlertTriangle, color: "bg-orange-500/10 text-orange-500", label: "High" },
  critical: { icon: XCircle, color: "bg-destructive/10 text-destructive", label: "Critical" },
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Safety Alerts</CardTitle>
            <CardDescription>Recent security and safety notifications</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-lg font-semibold">No Active Alerts</h3>
            <p className="text-sm text-muted-foreground mt-2">Your AI systems are operating safely</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const config = severityConfig[alert.severity]
              const Icon = config.icon

              return (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className={`rounded-full p-2 ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{alert.alert_type.replace(/_/g, " ").toUpperCase()}</p>
                      <Badge variant="outline" className={config.color}>
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(alert.created_at).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Resolve
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
