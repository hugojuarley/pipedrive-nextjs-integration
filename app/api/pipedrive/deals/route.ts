import { type NextRequest, NextResponse } from "next/server"
import { PipedriveReadOnlyClient } from "@/lib/pipedrive-client"

const pipedrive = new PipedriveReadOnlyClient(process.env.PIPEDRIVE_API_TOKEN!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const params = {
      status: (searchParams.get("status") as any) || "all_not_deleted",
      limit: Number.parseInt(searchParams.get("limit") || "50"),
      start: Number.parseInt(searchParams.get("start") || "0"),
    }

    const deals = await pipedrive.getDeals(params)

    return NextResponse.json({
      success: true,
      data: deals.data,
      pagination: deals.additional_data?.pagination,
    })
  } catch (error) {
    console.error("Error fetching deals:", error)
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 })
  }
}
