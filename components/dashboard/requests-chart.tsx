"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useMemo } from "react"

interface Request {
  created_at: string
  status: string
}

interface RequestsChartProps {
  requests: Request[]
}

export function RequestsChart({ requests }: RequestsChartProps) {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    return last7Days.map((date) => {
      const dayRequests = requests.filter((r) => r.created_at.startsWith(date))
      const successful = dayRequests.filter((r) => r.status === "success").length
      const failed = dayRequests.filter((r) => r.status === "error").length
      const blocked = dayRequests.filter((r) => r.status === "blocked").length

      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        successful,
        failed,
        blocked,
        total: dayRequests.length,
      }
    })
  }, [requests])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Activity</CardTitle>
        <CardDescription>AI API requests over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--card-foreground))",
              }}
            />
            <Area
              type="monotone"
              dataKey="successful"
              stackId="1"
              stroke="hsl(var(--accent))"
              fill="hsl(var(--accent))"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="failed"
              stackId="1"
              stroke="hsl(var(--destructive))"
              fill="hsl(var(--destructive))"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="blocked"
              stackId="1"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
