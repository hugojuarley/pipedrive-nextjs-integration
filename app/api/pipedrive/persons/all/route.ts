import { type NextRequest, NextResponse } from "next/server"
import { PipedriveReadOnlyClient } from "@/lib/pipedrive-client"

const pipedrive = new PipedriveReadOnlyClient(process.env.PIPEDRIVE_API_TOKEN!)

export async function GET(request: NextRequest) {
  try {
    console.log('Starting getAllPersons request...')
    
    const { searchParams } = new URL(request.url)

    const params = {
      limit: 100, // Máximo aceito pela API do Pipedrive
      start: 0,
      sort: searchParams.get("sort") || undefined,
    }

    console.log('Params:', params)

    // Usa o método original que já funciona
    const response = await pipedrive.getPersons(params)

    console.log(`Successfully fetched ${response.data?.length || 0} persons`)

    return NextResponse.json({
      success: true,
      data: response.data || [],
      total: response.data?.length || 0,
      pagination: response.additional_data?.pagination,
      message: "Persons carregadas (método simplificado)"
    })
  } catch (error) {
    console.error("Error in persons/all route:", error)
    
    // Retorna erro mais detalhado
    return NextResponse.json({ 
      error: "Failed to fetch persons",
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 })
  }
} 