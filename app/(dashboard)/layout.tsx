import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const supabase = createServerSupabaseClient();

  // Upsert user on every dashboard load
  await supabase.from("users").upsert(
    {
      clerk_id: userId,
      email: user?.emailAddresses[0]?.emailAddress ?? "",
      full_name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
      avatar_url: user?.imageUrl,
    },
    { onConflict: "clerk_id" }
  );

  // Ensure subscription row exists
  const { data: dbUser } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (dbUser) {
    await supabase
      .from("subscriptions")
      .upsert({ user_id: dbUser.id, plan: "free" }, { onConflict: "user_id", ignoreDuplicates: true });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
