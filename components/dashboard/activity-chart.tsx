"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

interface SafetyStat {
  id: string
  stat_date: string
  total_requests: number
  flagged_requests: number
  avg_safety_score: number
  critical_alerts: number
  warnings: number
  total_tokens: number
  avg_latency_ms: number
}

interface ActivityChartProps {
  stats: SafetyStat[]
}

export function ActivityChart({ stats }: ActivityChartProps) {
  const chartData = stats
    .slice()
    .reverse()
    .map((stat) => ({
      date: new Date(stat.stat_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      requests: stat.total_requests,
      flagged: stat.flagged_requests,
    }))

  const totalRequests = stats.reduce((sum, stat) => sum + stat.total_requests, 0)
  const avgRequests = stats.length > 0 ? Math.round(totalRequests / stats.length) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Activity</CardTitle>
        <CardDescription>Daily AI request volume over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            requests: {
              label: "Total Requests",
              color: "hsl(var(--chart-1))",
            },
            flagged: {
              label: "Flagged Requests",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFlagged" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorRequests)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="flagged"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorFlagged)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Average {avgRequests} requests per day</span>
        </div>
      </CardContent>
    </Card>
  )
}
