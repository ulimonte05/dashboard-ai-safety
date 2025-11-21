import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, sessionId } = await req.json()

    // Content safety check - simple example
    const toxicWords = ["hack", "exploit", "illegal"]
    const hasToxicContent = toxicWords.some((word) => message.toLowerCase().includes(word))

    if (hasToxicContent) {
      // Log safety alert
      await supabase.from("safety_alerts").insert({
        user_id: user.id,
        alert_type: "toxic_content",
        severity: "high",
        description: `Potentially harmful content detected in chat: "${message.substring(0, 50)}..."`,
        metadata: { session_id: sessionId, message },
      })

      return NextResponse.json({
        message: "I cannot respond to that request as it may violate our safety policies.",
        blocked: true,
      })
    }

    // Call AI with safety wrapper
    const startTime = Date.now()

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: message,
      system:
        "You are a helpful AI assistant with built-in safety monitoring. Always provide safe, accurate, and helpful responses.",
    })

    const responseTime = Date.now() - startTime

    return NextResponse.json({
      message: text,
      model: "gpt-4o-mini",
      response_time: responseTime,
      usage: {
        prompt_tokens: Math.ceil(message.length / 4),
        completion_tokens: Math.ceil(text.length / 4),
        total_tokens: Math.ceil((message.length + text.length) / 4),
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
