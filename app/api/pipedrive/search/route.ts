import { type NextRequest, NextResponse } from "next/server"
import { PipedriveReadOnlyClient } from "@/lib/pipedrive-client"

const pipedrive = new PipedriveReadOnlyClient(process.env.PIPEDRIVE_API_TOKEN!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const term = searchParams.get("term")
    const type = searchParams.get("type") || "deals" // 'deals' or 'persons'

    if (!term) {
      return NextResponse.json({ error: "Search term is required" }, { status: 400 })
    }

    let results
    if (type === "persons") {
      results = await pipedrive.searchPersons(term)
    } else {
      results = await pipedrive.searchDeals(term)
    }

    return NextResponse.json({
      success: true,
      data: results.data,
      term,
      type,
    })
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
