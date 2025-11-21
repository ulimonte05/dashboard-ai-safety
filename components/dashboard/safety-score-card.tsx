"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, CheckCircle, AlertTriangle } from "lucide-react"

interface AIInteraction {
  id: string
  model: string
  provider: string
  safety_score: number
  flagged: boolean
  created_at: string
}

interface SafetyScoreCardProps {
  interactions: AIInteraction[]
}

export function SafetyScoreCard({ interactions }: SafetyScoreCardProps) {
  const recentInteractions = interactions.slice(0, 20)

  const avgSafetyScore =
    recentInteractions.length > 0
      ? recentInteractions.reduce((sum, i) => sum + (i.safety_score || 0), 0) / recentInteractions.length
      : 0

  const flaggedCount = recentInteractions.filter((i) => i.flagged).length
  const safeCount = recentInteractions.filter((i) => !i.flagged).length

  const safetyPercentage = Math.round(avgSafetyScore * 100)

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-600 dark:text-green-400"
    if (score >= 0.7) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreStatus = (score: number) => {
    if (score >= 0.9) return "Excellent"
    if (score >= 0.7) return "Good"
    return "Needs Attention"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Safety Score</CardTitle>
        <CardDescription>Average safety score from recent AI interactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className={`text-3xl font-bold ${getScoreColor(avgSafetyScore)}`}>{safetyPercentage}%</div>
              <p className="text-sm text-muted-foreground">{getScoreStatus(avgSafetyScore)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Safety Level</span>
            <span className="font-medium">{safetyPercentage}%</span>
          </div>
          <Progress value={safetyPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-muted-foreground">Safe</span>
            </div>
            <div className="text-2xl font-bold">{safeCount}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-muted-foreground">Flagged</span>
            </div>
            <div className="text-2xl font-bold">{flaggedCount}</div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">Based on the last {recentInteractions.length} AI interactions</p>
        </div>
      </CardContent>
    </Card>
  )
}
