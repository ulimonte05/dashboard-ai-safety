"use client"

import { Button } from "@/components/ui/button"
import { Bell, Settings, LogOut, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface DashboardHeaderProps {
  user: {
    email?: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-none">AI Safety</h2>
            <p className="text-xs text-muted-foreground">Platform</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="ghost" size="sm">
              Chat
            </Button>
          </Link>
          <Link href="/api-keys">
            <Button variant="ghost" size="sm">
              API Keys
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="ghost" size="sm">
              Docs
            </Button>
          </Link>

          <div className="ml-4 flex items-center gap-2 border-l border-border pl-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
