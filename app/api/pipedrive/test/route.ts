import { NextResponse } from "next/server"
import { PipedriveReadOnlyClient } from "@/lib/pipedrive-client"

const pipedrive = new PipedriveReadOnlyClient(process.env.PIPEDRIVE_API_TOKEN!)

export async function GET() {
  try {
    console.log('Testing Pipedrive API connection...')
    console.log('API Token exists:', !!process.env.PIPEDRIVE_API_TOKEN)
    
    // Testa uma requisição simples primeiro
    const testResponse = await pipedrive.getDeals({ limit: 1 })
    
    console.log('Test response:', {
      success: testResponse.success,
      dataLength: testResponse.data?.length,
      hasPagination: !!testResponse.additional_data?.pagination
    })

    return NextResponse.json({
      success: true,
      message: "API connection successful",
      testData: {
        dealsCount: testResponse.data?.length || 0,
        hasPagination: !!testResponse.additional_data?.pagination,
        paginationInfo: testResponse.additional_data?.pagination
      }
    })
  } catch (error) {
    console.error("Error testing Pipedrive API:", error)
    
    return NextResponse.json({ 
      success: false,
      error: "Failed to connect to Pipedrive API",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 