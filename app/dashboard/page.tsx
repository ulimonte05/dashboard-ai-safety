import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { SafetyScoreCard } from "@/components/dashboard/safety-score-card"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch dashboard data
  const [alertsResult, statsResult, interactionsResult] = await Promise.all([
    supabase
      .from("safety_alerts")
      .select("*")
      .eq("user_id", data.user.id)
      .order("triggered_at", { ascending: false })
      .limit(5),
    supabase
      .from("safety_stats")
      .select("*")
      .eq("user_id", data.user.id)
      .order("stat_date", { ascending: false })
      .limit(7),
    supabase
      .from("ai_interactions")
      .select("*")
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: false })
      .limit(100),
  ])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={data.user} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">AI Safety Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-pretty">
              Monitor your AI applications in real-time with comprehensive safety analytics
            </p>
          </div>

          <StatsOverview stats={statsResult.data || []} interactions={interactionsResult.data || []} />

          <div className="grid gap-6 lg:grid-cols-2">
            <ActivityChart stats={statsResult.data || []} />
            <SafetyScoreCard interactions={interactionsResult.data || []} />
          </div>

          <AlertsPanel alerts={alertsResult.data || []} />
        </div>
      </main>
    </div>
  )
}
