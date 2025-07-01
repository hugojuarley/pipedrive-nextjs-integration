import { type NextRequest, NextResponse } from "next/server"
import { PipedriveReadOnlyClient } from "@/lib/pipedrive-client"

const pipedrive = new PipedriveReadOnlyClient(process.env.PIPEDRIVE_API_TOKEN!)

export async function GET(request: NextRequest) {
  try {
    console.log('Starting simple deals request...')
    const { searchParams } = new URL(request.url)
    const status = (searchParams.get("status") as any) || "all_not_deleted"
    const sort = searchParams.get("sort") || undefined

    // Usa apenas uma requisição com limite máximo
    const response = await pipedrive.getDeals({ 
      status, 
      sort, 
      start: 0, 
      limit: 100 
    })

    console.log(`Fetched ${response.data?.length || 0} deals`)

    return NextResponse.json({
      success: true,
      data: response.data || [],
      total: response.data?.length || 0,
      pagination: response.additional_data?.pagination,
      message: `Deals carregados: ${response.data?.length || 0} registros (máximo 100 por requisição)`
    })
  } catch (error) {
    console.error("Error in deals/simple route:", error)
    return NextResponse.json({ 
      error: "Failed to fetch deals",
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 })
  }
} 