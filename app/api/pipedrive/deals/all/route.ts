import { type NextRequest, NextResponse } from "next/server"
import { PipedriveReadOnlyClient } from "@/lib/pipedrive-client"

const pipedrive = new PipedriveReadOnlyClient(process.env.PIPEDRIVE_API_TOKEN!)

export async function GET(request: NextRequest) {
  try {
    console.log('Starting getAllDeals (robust version)...')
    const { searchParams } = new URL(request.url)
    const status = (searchParams.get("status") as any) || "all_not_deleted"
    const sort = searchParams.get("sort") || undefined

    let allDeals: any[] = []
    let start = 0
    const limit = 50 // Reduzindo para 50 para ser mais conservador
    let hasMore = true
    let requestCount = 0
    let errorCount = 0

    while (hasMore && requestCount < 10 && errorCount < 3) { // Limites mais conservadores
      try {
        console.log(`Fetching deals: start=${start}, limit=${limit}`)
        
        const response = await pipedrive.getDeals({ status, sort, start, limit })
        
        if (response.data && response.data.length > 0) {
          allDeals = allDeals.concat(response.data)
          console.log(`Fetched ${response.data.length} deals, total: ${allDeals.length}`)
        }

        hasMore = response.additional_data?.pagination?.more_items_in_collection || false
        start += limit
        requestCount++
        
        // Pausa maior entre requisições
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 200))
        }
        
      } catch (error) {
        console.error(`Error fetching deals at start=${start}:`, error)
        errorCount++
        
        // Se houver erro, tenta com um limite menor
        if (limit > 20) {
          console.log('Retrying with smaller limit...')
          continue
        }
        
        // Se já tentou com limite pequeno e ainda deu erro, para
        break
      }
    }

    console.log(`Finished fetching deals. Total: ${allDeals.length}, Requests: ${requestCount}, Errors: ${errorCount}`)

    return NextResponse.json({
      success: true,
      data: allDeals,
      total: allDeals.length,
      requests: requestCount,
      errors: errorCount,
      message: `Deals carregados: ${allDeals.length} registros em ${requestCount} requisições`
    })
  } catch (error) {
    console.error("Error in deals/all route:", error)
    return NextResponse.json({ 
      error: "Failed to fetch all deals",
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 })
  }
} 