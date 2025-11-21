"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Plus, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  created_at: string
}

interface Session {
  id: string
  title: string
  created_at: string
}

interface ChatInterfaceProps {
  userId: string
  sessions: Session[]
}

export function ChatInterface({ userId, sessions: initialSessions }: ChatInterfaceProps) {
  const [sessions, setSessions] = useState(initialSessions)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(initialSessions[0]?.id || null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const createNewSession = async () => {
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: userId,
        title: "New Chat",
      })
      .select()
      .single()

    if (data) {
      setSessions([data, ...sessions])
      setCurrentSessionId(data.id)
      setMessages([])
    }
  }

  const loadMessages = async (sessionId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    if (data) {
      setMessages(data)
    }
  }

  const handleSessionSelect = async (sessionId: string) => {
    setCurrentSessionId(sessionId)
    await loadMessages(sessionId)
  }

  const handleSend = async () => {
    if (!input.trim() || !currentSessionId || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message to UI
    const tempUserMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userMessage,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempUserMessage])

    try {
      // Save user message to database
      await supabase.from("chat_messages").insert({
        session_id: currentSessionId,
        user_id: userId,
        role: "user",
        content: userMessage,
      })

      // Call AI endpoint with safety wrapper
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          sessionId: currentSessionId,
        }),
      })

      const data = await response.json()

      // Add assistant response
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Save assistant message
      await supabase.from("chat_messages").insert({
        session_id: currentSessionId,
        user_id: userId,
        role: "assistant",
        content: data.message,
      })

      // Log the request for safety monitoring
      await supabase.from("ai_requests").insert({
        api_key_id: null,
        user_id: userId,
        model: data.model || "gpt-4",
        provider: "openai",
        prompt_tokens: data.usage?.prompt_tokens || 0,
        completion_tokens: data.usage?.completion_tokens || 0,
        total_tokens: data.usage?.total_tokens || 0,
        response_time_ms: data.response_time || 0,
        status: "success",
      })
    } catch (error) {
      console.error("Chat error:", error)

      // Log failed request
      await supabase.from("ai_requests").insert({
        api_key_id: null,
        user_id: userId,
        model: "gpt-4",
        provider: "openai",
        status: "error",
      })

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid h-[calc(100vh-12rem)] gap-6 lg:grid-cols-[280px_1fr]">
      {/* Sidebar with sessions */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 h-full">
          <Button onClick={createNewSession} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleSessionSelect(session.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentSessionId === session.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  {session.title}
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-accent" />
              <span>AI Safety Enabled</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Chat area */}
      <Card className="flex flex-col">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">AI Safety Chat</h2>
              <p className="text-xs text-muted-foreground">Protected by real-time safety monitoring</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
              <Shield className="h-3 w-3" />
              Safe Mode Active
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="rounded-full bg-primary/10 p-6">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Start a Safe Conversation</h3>
                <p className="text-sm text-muted-foreground text-pretty max-w-md">
                  Your messages are monitored for safety violations, toxic content, and policy compliance in real-time.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 bg-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`rounded-lg px-4 py-3 max-w-[80%] ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 bg-accent">
                      <AvatarFallback className="bg-accent text-accent-foreground text-xs">You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4">
                  <Avatar className="h-8 w-8 bg-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-4 py-3 bg-muted">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading || !currentSessionId}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !currentSessionId || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
