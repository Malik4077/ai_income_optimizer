import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { streamChatResponse } from "@/lib/ai/chat";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Chat requires premium
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", userId)
      .single();

    if (!sub || sub.plan !== "premium") {
      return NextResponse.json(
        { error: "AI Chat requires Premium plan." },
        { status: 403 }
      );
    }

    const { messages, userContext } = await req.json();

    // Save user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      await supabase.from("chat_messages").insert({
        user_id: userId,
        role: "user",
        content: lastMessage.content,
      });
    }

    const stream = await streamChatResponse(messages, userContext);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("chat error:", error);
    return NextResponse.json({ error: "Chat failed." }, { status: 500 });
  }
}
