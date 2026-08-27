import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();

    // Simple query to keep Supabase active
    await supabase.from("keepalive_log").insert({ pinged_at: new Date().toISOString() });

    // Clean up old logs (keep only last 10)
    const { data: logs } = await supabase
      .from("keepalive_log")
      .select("id")
      .order("pinged_at", { ascending: false });

    if (logs && logs.length > 10) {
      const idsToDelete = logs.slice(10).map((l) => l.id);
      await supabase.from("keepalive_log").delete().in("id", idsToDelete);
    }

    return NextResponse.json({ status: "alive", timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("keepalive_log")
      .select("*")
      .order("pinged_at", { ascending: false })
      .limit(1);

    return NextResponse.json({
      status: "alive",
      last_ping: data?.[0]?.pinged_at || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 });
  }
}
