import { NextResponse } from "next/server"
import { PipedriveClient } from "@/lib/pipedrive"

const pipedrive = new PipedriveClient({
  apiToken: process.env.PIPEDRIVE_API_TOKEN!,
})

export async function POST() {
  try {
    // Sincronização automática
    const deals = await pipedrive.getDeals()
    const persons = await pipedrive.getPersons()

    // Processar e salvar no seu banco de dados
    // await saveToDatabase(deals, persons);

    return NextResponse.json({
      success: true,
      synced: {
        deals: deals.data?.length || 0,
        persons: persons.data?.length || 0,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
