import { Button } from "@/components/ui/button"
import { Shield, Zap, Lock, BarChart3, Code, FileText } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="flex flex-col items-center text-center gap-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI Safety Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance max-w-4xl">
            Secure Your AI Applications with Confidence
          </h1>

          <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
            Enterprise-grade AI safety monitoring and control. Wrap cutting-edge AI SDKs with real-time safety
            analytics, alerts, and compliance tracking.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="gap-2">
                Get Started
                <Zap className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">Comprehensive AI Safety</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Shield}
            title="Content Safety"
            description="Real-time content filtering and moderation with customizable safety policies"
          />
          <FeatureCard
            icon={BarChart3}
            title="Analytics Dashboard"
            description="Monitor AI usage, costs, and safety metrics with intuitive visualizations"
          />
          <FeatureCard
            icon={Lock}
            title="API Key Management"
            description="Secure API key generation and management with granular access controls"
          />
          <FeatureCard
            icon={Zap}
            title="Rate Limiting"
            description="Protect your infrastructure with intelligent rate limiting and throttling"
          />
          <FeatureCard
            icon={Code}
            title="Multi-SDK Support"
            description="Wrap OpenAI, Vercel AI SDK, and other providers with unified safety layer"
          />
          <FeatureCard
            icon={FileText}
            title="NPM & Python Libraries"
            description="Easy integration with npm and Python packages for seamless adoption"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your AI?</h2>
          <p className="text-muted-foreground mb-8 text-pretty">
            Join developers building safer AI applications with comprehensive monitoring and control
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg">Start Building Safely</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors">
      <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-pretty">{description}</p>
    </div>
  )
}
