import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ApiKeysManager } from "@/components/api-keys/api-keys-manager"

export default async function ApiKeysPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: apiKeys } = await supabase
    .from("api_keys")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={data.user} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">API Keys</h1>
            <p className="text-muted-foreground mt-2 text-pretty">
              Manage your AI Safety API keys for secure integration
            </p>
          </div>

          <ApiKeysManager userId={data.user.id} initialKeys={apiKeys || []} />
        </div>
      </main>
    </div>
  )
}
