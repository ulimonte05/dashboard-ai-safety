import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/server"

interface SafetyMetricsProps {
  userId: string
}

export async function SafetyMetrics({ userId }: SafetyMetricsProps) {
  const supabase = await createClient()

  const { data: alerts } = await supabase.from("safety_alerts").select("alert_type, severity").eq("user_id", userId)

  const metrics = [
    {
      name: "Content Safety",
      value: 98,
      description: "Safe content filtering",
      color: "bg-accent",
    },
    {
      name: "Rate Limiting",
      value: 95,
      description: "Within rate limits",
      color: "bg-primary",
    },
    {
      name: "Cost Controls",
      value: 88,
      description: "Budget compliance",
      color: "bg-blue-500",
    },
    {
      name: "Model Safety",
      value: 100,
      description: "Approved models only",
      color: "bg-accent",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Safety Metrics</CardTitle>
        <CardDescription>Real-time safety compliance scores</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{metric.name}</p>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
              <div className="text-2xl font-bold">{metric.value}%</div>
            </div>
            <Progress value={metric.value} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
