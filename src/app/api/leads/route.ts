import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const score = searchParams.get("score");
  const stage = searchParams.get("stage");
  const source = searchParams.get("source");
  const search = searchParams.get("search");

  let query = supabase
    .from("companies")
    .select(
      `
      *,
      leads (*)
    `
    )
    .order("created_at", { ascending: false });

  if (score && score !== "all") {
    query = query.eq("score", score);
  }
  if (stage && stage !== "all") {
    query = query.eq("stage", stage);
  }
  if (source && source !== "all") {
    query = query.eq("source", source);
  }
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%,industry.ilike.%${search}%`
    );
  }

  const { data, error } = await query.limit(50);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
