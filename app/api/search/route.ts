import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { Lead } from "@/types";

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_BASE = "https://api.apify.com/v2";
const POLL_INTERVAL = 3000;
const MAX_POLL_TIME = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { keyword, city, state, limit } = body;

  if (!keyword || !city || !state || !limit) {
    return NextResponse.json(
      { error: "Missing required fields: keyword, city, state, limit" },
      { status: 400 }
    );
  }

  // Start the Apify Actor run
  const startRes = await fetch(
    `${APIFY_BASE}/acts/compass~crawler-google-places/runs?token=${APIFY_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchStringsArray: [keyword],
        locationQuery: `${city}, ${state}`,
        maxCrawledPlacesPerSearch: limit,
        scrapeContacts: true,
      }),
    }
  );

  if (!startRes.ok) {
    return NextResponse.json(
      { error: "Failed to start Apify actor" },
      { status: 500 }
    );
  }

  const startData = await startRes.json();
  const runId = startData.data.id;
  const startTime = Date.now();

  // Poll until the run completes
  let status = startData.data.status;
  let defaultDatasetId = startData.data.defaultDatasetId;

  while (status !== "SUCCEEDED" && status !== "FAILED") {
    if (Date.now() - startTime > MAX_POLL_TIME) {
      return NextResponse.json(
        { error: "Apify actor timed out" },
        { status: 504 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));

    const pollRes = await fetch(
      `${APIFY_BASE}/actor-runs/${runId}?token=${APIFY_TOKEN}`
    );
    const pollData = await pollRes.json();
    status = pollData.data.status;
    defaultDatasetId = pollData.data.defaultDatasetId;
  }

  if (status === "FAILED") {
    return NextResponse.json(
      { error: "Apify actor run failed" },
      { status: 500 }
    );
  }

  // Fetch the dataset results
  const datasetRes = await fetch(
    `${APIFY_BASE}/datasets/${defaultDatasetId}/items?token=${APIFY_TOKEN}`
  );
  const results = await datasetRes.json();

  // Map Apify results to our Lead type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leads: Lead[] = results.map((item: any) => ({
    businessName: item.title || "",
    phone: item.phone || "",
    website: item.website || "",
    email: item.email || item.emails?.[0] || "",
    address: item.street || item.address || "",
    city: item.city || "",
    state: item.state || "",
    rating: item.totalScore || 0,
    reviewsCount: item.reviewsCount || 0,
    categories: item.categories || [],
    googleMapsUrl: item.url || "",
    categoryName: item.categoryName || "",
  }));

  // Save search to Firestore
  await db.collection("searchHistory").add({
    keyword,
    city,
    state,
    resultCount: leads.length,
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ leads });
}
