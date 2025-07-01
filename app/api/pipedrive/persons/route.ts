import { type NextRequest, NextResponse } from "next/server"
import { PipedriveReadOnlyClient } from "@/lib/pipedrive-client"

const pipedrive = new PipedriveReadOnlyClient(process.env.PIPEDRIVE_API_TOKEN!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const params = {
      limit: Number.parseInt(searchParams.get("limit") || "50"),
      start: Number.parseInt(searchParams.get("start") || "0"),
    }

    const persons = await pipedrive.getPersons(params)

    return NextResponse.json({
      success: true,
      data: persons.data,
      pagination: persons.additional_data?.pagination,
    })
  } catch (error) {
    console.error("Error fetching persons:", error)
    return NextResponse.json({ error: "Failed to fetch persons" }, { status: 500 })
  }
}
