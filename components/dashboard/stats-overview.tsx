import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

interface StatsOverviewProps {
  userId: string
}

export async function StatsOverview({ userId }: StatsOverviewProps) {
  const supabase = await createClient()

  // Fetch real-time stats
  const [totalRequestsResult, alertsResult, successRateResult] = await Promise.all([
    supabase.from("ai_requests").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase
      .from("safety_alerts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("resolved", false),
    supabase.from("ai_requests").select("status").eq("user_id", userId),
  ])

  const totalRequests = totalRequestsResult.count || 0
  const activeAlerts = alertsResult.count || 0
  const requests = successRateResult.data || []
  const successfulRequests = requests.filter((r) => r.status === "success").length
  const successRate = requests.length > 0 ? Math.round((successfulRequests / requests.length) * 100) : 0

  const stats = [
    {
      title: "Total Requests",
      value: totalRequests.toLocaleString(),
      icon: Activity,
      description: "AI API calls processed",
      trend: "+12% from last week",
    },
    {
      title: "Active Alerts",
      value: activeAlerts.toString(),
      icon: AlertTriangle,
      description: "Unresolved safety issues",
      trend: activeAlerts > 0 ? "Requires attention" : "All clear",
      variant: activeAlerts > 0 ? "destructive" : "default",
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      icon: CheckCircle2,
      description: "Successful completions",
      trend: "Healthy performance",
    },
    {
      title: "Safety Score",
      value: "98.5",
      icon: TrendingUp,
      description: "Overall safety rating",
      trend: "+2.1 from last month",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              <p className={`text-xs mt-2 ${stat.variant === "destructive" ? "text-destructive" : "text-accent"}`}>
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
