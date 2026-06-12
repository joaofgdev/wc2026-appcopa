import { NextResponse } from "next/server";
import { getWorldCupFixtures } from "@/lib/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  
  if (secret !== "copa2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Force get fixtures (this will trigger the background saves if details_saved is false)
  // But wait, getWorldCupFixtures only returns promisesToSave and we don't await them.
  // We can just sleep for 5 seconds to let the background promises resolve.
  
  const fixtures = await getWorldCupFixtures();
  
  await new Promise(r => setTimeout(r, 5000));

  return NextResponse.json({ success: true });
}
