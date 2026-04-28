import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe/subscription";
import { PLANS } from "@/lib/stripe/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const { plan } = await req.json();

    if (plan !== "pro" && plan !== "premium") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planConfig = PLANS[plan];
    if (!planConfig.priceId) {
      return NextResponse.json({ error: "Price not configured" }, { status: 500 });
    }

    // Ensure user exists in DB
    const supabase = createServerSupabaseClient();
    await supabase.from("users").upsert(
      {
        clerk_id: userId,
        email: user?.emailAddresses[0]?.emailAddress ?? "",
        full_name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
        avatar_url: user?.imageUrl,
      },
      { onConflict: "clerk_id" }
    );

    const { data: dbUser } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    const url = await createCheckoutSession(
      dbUser!.id,
      user?.emailAddresses[0]?.emailAddress ?? "",
      planConfig.priceId,
      plan
    );

    return NextResponse.json({ url });
  } catch (error) {
    console.error("checkout error:", error);
    return NextResponse.json({ error: "Checkout failed." }, { status: 500 });
  }
}
