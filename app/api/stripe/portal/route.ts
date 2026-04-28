import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createPortalSession } from "@/lib/stripe/subscription";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const url = await createPortalSession(sub.stripe_customer_id);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("portal error:", error);
    return NextResponse.json({ error: "Portal failed." }, { status: 500 });
  }
}
