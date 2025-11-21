"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Copy, Eye, EyeOff, Trash2, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ApiKey {
  id: string
  key_name: string
  api_key: string
  created_at: string
  last_used_at: string | null
  is_active: boolean
}

interface ApiKeysManagerProps {
  userId: string
  initialKeys: ApiKey[]
}

export function ApiKeysManager({ userId, initialKeys }: ApiKeysManagerProps) {
  const [keys, setKeys] = useState(initialKeys)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [keyName, setKeyName] = useState("")
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const supabase = createClient()

  const generateApiKey = () => {
    return `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
  }

  const handleCreateKey = async () => {
    if (!keyName.trim()) return

    const newApiKey = generateApiKey()

    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: userId,
        key_name: keyName,
        api_key: newApiKey,
      })
      .select()
      .single()

    if (data) {
      setKeys([data, ...keys])
      setKeyName("")
      setShowCreateDialog(false)
      setVisibleKeys(new Set([data.id]))
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    await supabase.from("api_keys").delete().eq("id", keyId)
    setKeys(keys.filter((k) => k.id !== keyId))
  }

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId)
    } else {
      newVisible.add(keyId)
    }
    setVisibleKeys(newVisible)
  }

  const copyToClipboard = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const maskKey = (key: string) => {
    return `${key.substring(0, 10)}${"•".repeat(20)}${key.substring(key.length - 4)}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>Create and manage API keys for your integrations</CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(!showCreateDialog)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateDialog && (
            <div className="mb-6 p-4 border border-border rounded-lg space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="Production API Key"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateKey}>Generate Key</Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {keys.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No API keys yet. Create your first key to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{key.key_name}</p>
                      <Badge variant={key.is_active ? "default" : "secondary"}>
                        {key.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {visibleKeys.has(key.id) ? key.api_key : maskKey(key.api_key)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => toggleKeyVisibility(key.id)}
                      >
                        {visibleKeys.has(key.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => copyToClipboard(key.api_key, key.id)}
                      >
                        {copiedKey === key.id ? (
                          <Check className="h-3 w-3 text-accent" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(key.created_at).toLocaleDateString()}
                      {key.last_used_at && ` • Last used ${new Date(key.last_used_at).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteKey(key.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
          <CardDescription>Use your API keys with our NPM and Python libraries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">NPM / Node.js</h4>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{`npm install @ai-safety/sdk

import { AISafety } from '@ai-safety/sdk';

const client = new AISafety({
  apiKey: 'your-api-key'
});

const response = await client.chat.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }]
});`}</code>
            </pre>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Python</h4>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{`pip install ai-safety

from ai_safety import AISafety

client = AISafety(api_key="your-api-key")

response = client.chat.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
