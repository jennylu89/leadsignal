import { JobListing, LeadScore, JobType, JobSource } from "@/types";

// ---- Remotive API (free, no auth) ----
interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

async function scrapeRemotive(): Promise<JobListing[]> {
  try {
    const res = await fetch(
      "https://remotive.com/api/remote-jobs?category=design&limit=20"
    );
    if (!res.ok) return [];
    const data = await res.json();
    const jobs: RemotiveJob[] = data.jobs || [];

    // Show jobs from last 30 days (design jobs are less frequent)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    return jobs
      .filter((job) => {
        const posted = new Date(job.publication_date).getTime();
        return posted >= thirtyDaysAgo;
      })
      .filter((job) => {
        const text = `${job.title} ${job.description}`.toLowerCase();
        return (
          text.includes("product design") ||
          text.includes("ux") ||
          text.includes("ui") ||
          text.includes("freelance") ||
          text.includes("contract")
        );
      })
      .map((job) => ({
        id: `remotive-${job.id}`,
        title: job.title,
        company_name: job.company_name,
        company_url: null,
        description: stripHtml(job.description).slice(0, 300),
        location: job.candidate_required_location || "Remote",
        job_type: mapJobType(job.job_type),
        source: "weworkremotely" as JobSource, // closest match in our types
        source_url: job.url,
        posted_date: job.publication_date,
        score: scoreJob(job.title, job.description, job.candidate_required_location),
        tags: extractTags(job.title, job.description, job.tags),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

// ---- Hacker News "Who is Hiring" (Algolia API, free) ----
async function scrapeHackerNews(): Promise<JobListing[]> {
  try {
    const sevenDaysAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
    const queries = [
      "freelance product designer",
      "contract product designer",
      "freelance UX designer",
      "product designer Pittsburgh",
    ];

    const allJobs: JobListing[] = [];

    for (const query of queries) {
      const res = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=comment&numericFilters=created_at_i>${sevenDaysAgo}&hitsPerPage=10`
      );
      if (!res.ok) continue;
      const data = await res.json();

      for (const hit of data.hits || []) {
        const text = hit.comment_text || "";
        const plainText = stripHtml(text);

        // Only include if it looks like a job posting
        if (plainText.length < 50) continue;

        const companyMatch = plainText.match(
          /^([A-Z][A-Za-z0-9\s&.]+?)(?:\s*\||\s*-|\s*\()/
        );
        const companyName = companyMatch ? companyMatch[1].trim() : "HN Listing";

        allJobs.push({
          id: `hn-${hit.objectID}`,
          title: extractTitle(plainText) || `Design Role at ${companyName}`,
          company_name: companyName,
          company_url: null,
          description: plainText.slice(0, 300),
          location: extractLocation(plainText),
          job_type: detectJobType(plainText),
          source: "wellfound" as JobSource, // using as HN proxy
          source_url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
          posted_date: hit.created_at,
          score: scoreJob(plainText, "", extractLocation(plainText) || ""),
          tags: extractTags(plainText, "", []),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    // Deduplicate by objectID
    const seen = new Set<string>();
    return allJobs.filter((j) => {
      if (seen.has(j.id)) return false;
      seen.add(j.id);
      return true;
    });
  } catch {
    return [];
  }
}

// ---- Jobicy API (free, no auth, fresh jobs) ----
interface JobicyJob {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  jobIndustry: string[];
  jobType: string[];
  jobGeo: string;
  jobLevel: string;
  jobExcerpt: string;
  jobDescription: string;
  pubDate: string;
  annualSalaryMin: string;
  annualSalaryMax: string;
  salaryCurrency: string;
}

async function scrapeJobicy(): Promise<JobListing[]> {
  try {
    const res = await fetch(
      "https://jobicy.com/api/v2/remote-jobs?count=20&tag=design"
    );
    if (!res.ok) return [];
    const data = await res.json();
    const jobs: JobicyJob[] = data.jobs || [];

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return jobs
      .filter((job) => {
        const posted = new Date(job.pubDate).getTime();
        return posted >= sevenDaysAgo;
      })
      .filter((job) => {
        const text =
          `${job.jobTitle} ${job.jobExcerpt} ${job.jobDescription}`.toLowerCase();
        return (
          text.includes("product design") ||
          text.includes("ux") ||
          text.includes("ui design") ||
          text.includes("designer")
        );
      })
      .map((job) => {
        const salary =
          job.annualSalaryMin && job.annualSalaryMax
            ? `${job.salaryCurrency || "$"}${job.annualSalaryMin}-${job.annualSalaryMax}`
            : null;
        const desc = salary
          ? `${stripHtml(job.jobExcerpt).slice(0, 250)} | Salary: ${salary}`
          : stripHtml(job.jobExcerpt).slice(0, 300);

        return {
          id: `jobicy-${job.id}`,
          title: job.jobTitle,
          company_name: job.companyName,
          company_url: null,
          description: desc,
          location: job.jobGeo || "Remote",
          job_type: mapJobType(
            (job.jobType || []).join(" ") || "full_time"
          ),
          source: "indeed" as JobSource, // using Indeed slot for Jobicy
          source_url: job.url,
          posted_date: job.pubDate,
          score: scoreJob(
            job.jobTitle,
            job.jobExcerpt,
            job.jobGeo || ""
          ),
          tags: extractTags(job.jobTitle, job.jobExcerpt, job.jobIndustry || []),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });
  } catch {
    return [];
  }
}

// ---- LinkedIn via Google (backup, may not always work) ----
async function scrapeLinkedInViaGoogle(): Promise<JobListing[]> {
  const queries = [
    'site:linkedin.com/jobs "freelance product designer"',
    'site:linkedin.com/jobs "freelance product designer" Pittsburgh',
    'site:linkedin.com/jobs "contract product designer" remote',
  ];

  const results: JobListing[] = [];

  for (const query of queries) {
    try {
      const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbs=qdr:w&num=10`;
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (!res.ok) continue;
      const html = await res.text();

      // Try to extract results
      const pattern = /<a href="\/url\?q=(https?:\/\/[^"&]+)[^"]*"[^>]*>.*?<h3[^>]*>(.*?)<\/h3>/gs;
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const resultUrl = decodeURIComponent(match[1]);
        const title = match[2]?.replace(/<[^>]+>/g, "").trim();
        if (!title || !resultUrl.includes("linkedin.com")) continue;

        results.push({
          id: `linkedin-${Date.now()}-${results.length}`,
          title,
          company_name: extractCompanyFromTitle(title),
          company_url: null,
          description: title,
          location: extractLocation(title),
          job_type: detectJobType(title),
          source: "linkedin" as JobSource,
          source_url: resultUrl,
          posted_date: new Date().toISOString(),
          score: scoreJob(title, "", extractLocation(title) || ""),
          tags: extractTags(title, "", []),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch {
      continue;
    }
  }

  return results;
}

// ---- Helper functions ----

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapJobType(type: string): JobType {
  const lower = type.toLowerCase();
  if (lower.includes("freelance")) return "freelance";
  if (lower.includes("contract")) return "contract";
  if (lower.includes("part")) return "part_time";
  if (lower.includes("full")) return "full_time";
  return "contract";
}

function detectJobType(text: string): JobType {
  const lower = text.toLowerCase();
  if (lower.includes("freelance")) return "freelance";
  if (lower.includes("contract")) return "contract";
  if (lower.includes("part-time") || lower.includes("part time"))
    return "part_time";
  return "freelance";
}

function extractLocation(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("pittsburgh")) return "Pittsburgh, PA";
  if (lower.includes("remote")) return "Remote";
  if (lower.includes("new york") || lower.includes("nyc")) return "New York, NY";
  if (lower.includes("san francisco") || lower.includes("sf")) return "San Francisco, CA";
  if (lower.includes("worldwide")) return "Remote (Worldwide)";
  return "Remote";
}

function extractTitle(text: string): string | null {
  // Try to find a job title-like pattern
  const patterns = [
    /((?:senior|junior|lead|principal|staff)?\s*(?:product|ux|ui|ux\/ui)\s*designer)/i,
    /((?:freelance|contract)\s+(?:product|ux|ui)\s*(?:\/\s*ux)?\s*designer)/i,
  ];
  for (const p of patterns) {
    const match = text.match(p);
    if (match) return match[1].trim();
  }
  return null;
}

function extractCompanyFromTitle(title: string): string {
  const atMatch = title.match(/at\s+(.+?)(?:\s*[-|·]|$)/i);
  if (atMatch) return atMatch[1].trim();
  const dashMatch = title.match(/^(.+?)\s*[-|·]\s*/);
  if (dashMatch && dashMatch[1].length < 40) return dashMatch[1].trim();
  return "Unknown Company";
}

function scoreJob(title: string, description: string, location: string): LeadScore {
  const text = `${title} ${description} ${location}`.toLowerCase();
  let score = 0;

  if (text.includes("freelance")) score += 3;
  if (text.includes("contract")) score += 2;
  if (text.includes("product designer")) score += 2;
  if (text.includes("ux/ui") || text.includes("ui/ux")) score += 1;
  if (text.includes("pittsburgh")) score += 3;
  if (text.includes("remote")) score += 1;
  if (text.includes("immediately") || text.includes("asap") || text.includes("urgent"))
    score += 2;

  if (score >= 5) return "hot";
  if (score >= 3) return "warm";
  return "cool";
}

function extractTags(
  title: string,
  description: string,
  existingTags: string[]
): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tags = new Set<string>(
    existingTags.map((t) => t.toLowerCase()).filter((t) => t.length < 20)
  );

  const keywords = [
    "freelance", "contract", "remote", "product designer", "UX",
    "UI", "mobile", "web", "SaaS", "B2B", "startup", "fintech",
    "health tech", "AI", "e-commerce", "design system", "figma",
    "Pittsburgh",
  ];

  for (const kw of keywords) {
    if (text.includes(kw.toLowerCase())) tags.add(kw.toLowerCase());
  }

  return [...tags].slice(0, 8);
}

// ---- Main handler ----
export async function POST() {
  try {
    // Run all scrapers in parallel
    const [remotiveJobs, jobicyJobs, hnJobs, linkedinJobs] = await Promise.all([
      scrapeRemotive(),
      scrapeJobicy(),
      scrapeHackerNews(),
      scrapeLinkedInViaGoogle(),
    ]);

    const allJobs = [...remotiveJobs, ...jobicyJobs, ...hnJobs, ...linkedinJobs];

    // Deduplicate by source_url
    const seen = new Set<string>();
    const uniqueJobs = allJobs.filter((j) => {
      if (seen.has(j.source_url)) return false;
      seen.add(j.source_url);
      return true;
    });

    // Sort: hot first, then by date
    const scoreOrder = { hot: 0, warm: 1, cool: 2 };
    uniqueJobs.sort(
      (a, b) =>
        scoreOrder[a.score] - scoreOrder[b.score] ||
        new Date(b.posted_date || 0).getTime() -
          new Date(a.posted_date || 0).getTime()
    );

    return Response.json({
      success: true,
      leads_found: uniqueJobs.length,
      leads: uniqueJobs,
      sources: {
        remotive: remotiveJobs.length,
        jobicy: jobicyJobs.length,
        hackernews: hnJobs.length,
        linkedin: linkedinJobs.length,
      },
    });
  } catch (error) {
    return Response.json(
      { error: "Scrape failed", details: String(error) },
      { status: 500 }
    );
  }
}
