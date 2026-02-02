import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const headersList = await headers();
    const pathname = headersList.get("x-url") || "/";
    const redirectUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
    redirect(redirectUrl);
  }

  return <>{children}</>;
}
