import { supabase } from "@/lib/supabase";
import { SignalType, LeadScore } from "@/types";

interface ProductHuntPost {
  name: string;
  tagline: string;
  url: string;
  votesCount: number;
  website: string;
  topics: { name: string }[];
  makers: { name: string; headline: string }[];
}

function scorePost(post: ProductHuntPost): {
  score: LeadScore;
  signals: SignalType[];
} {
  const signals: SignalType[] = ["new_launch"];

  // Check if makers appear to be technical (no design keywords in headline)
  const hasDesigner = post.makers.some(
    (m) =>
      m.headline?.toLowerCase().includes("design") ||
      m.headline?.toLowerCase().includes("ux") ||
      m.headline?.toLowerCase().includes("ui")
  );

  if (!hasDesigner) {
    signals.push("technical_founders");
    signals.push("no_designer");
  }

  const score: LeadScore =
    !hasDesigner && post.makers.length <= 3 ? "hot" : hasDesigner ? "cool" : "warm";

  return { score, signals };
}

export async function POST() {
  try {
    // Product Hunt has a GraphQL API but for free scraping
    // we'll use their website data. In production, you'd use their API with a token.
    // For now, this demonstrates the scraper architecture.

    // Simulated scrape result — replace with real API call
    const mockScrapedPosts: ProductHuntPost[] = [
      {
        name: "CodePilot",
        tagline: "AI pair programmer for solo developers",
        url: "https://producthunt.com/posts/codepilot",
        votesCount: 245,
        website: "https://codepilot.dev",
        topics: [{ name: "Developer Tools" }, { name: "Artificial Intelligence" }],
        makers: [
          { name: "Alex Chen", headline: "Full-stack engineer, ex-Meta" },
        ],
      },
      {
        name: "MealPrep Pro",
        tagline: "AI meal planning for busy professionals",
        url: "https://producthunt.com/posts/mealprep-pro",
        votesCount: 180,
        website: "https://mealprepro.com",
        topics: [{ name: "Health" }, { name: "Productivity" }],
        makers: [
          { name: "Sarah Kim", headline: "Backend engineer" },
          { name: "Mike Park", headline: "ML engineer" },
        ],
      },
    ];

    let leadsFound = 0;

    for (const post of mockScrapedPosts) {
      const { score, signals } = scorePost(post);

      const { error } = await supabase.from("companies").upsert(
        {
          name: post.name,
          url: post.website,
          description: post.tagline,
          industry:
            post.topics.map((t) => t.name).join(", ") || null,
          stage: "pre_seed",
          team_size: post.makers.length,
          designer_count: 0,
          engineer_count: post.makers.length,
          source: "producthunt",
          source_url: post.url,
          score,
          signals,
        },
        { onConflict: "name" }
      );

      if (!error) leadsFound++;
    }

    // Log the scrape run
    await supabase.from("scrape_runs").insert({
      source: "producthunt",
      leads_found: leadsFound,
      status: "success",
    });

    return Response.json({
      success: true,
      leads_found: leadsFound,
    });
  } catch (error) {
    // Log failed run
    await supabase.from("scrape_runs").insert({
      source: "producthunt",
      leads_found: 0,
      status: "failed",
    });

    return Response.json(
      { error: "Scrape failed", details: String(error) },
      { status: 500 }
    );
  }
}
