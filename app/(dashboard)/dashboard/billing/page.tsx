import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BillingView } from "@/components/dashboard/billing-view";

export default async function BillingPage() {
  const { userId } = await auth();
  const supabase = createServerSupabaseClient();

  const { data: dbUser } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId!)
    .single();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", dbUser?.id ?? "")
    .single();

  return <BillingView subscription={sub} />;
}
