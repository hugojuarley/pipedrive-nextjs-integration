import { type NextRequest, NextResponse } from "next/server"
import { PipedriveExplorer } from "@/lib/pipedrive-explorer"

const explorer = new PipedriveExplorer(process.env.PIPEDRIVE_API_TOKEN!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get("endpoint")
    const id = searchParams.get("id")

    let data

    switch (endpoint) {
      case "deals":
        data = await explorer.getDeals()
        break
      case "persons":
        data = await explorer.getPersons()
        break
      case "organizations":
        data = await explorer.getOrganizations()
        break
      case "activities":
        data = await explorer.getActivities()
        break
      case "pipelines":
        data = await explorer.getPipelines()
        break
      case "stages":
        data = await explorer.getStages()
        break
      case "users":
        data = await explorer.getUsers()
        break
      case "products":
        data = await explorer.getProducts()
        break
      case "notes":
        data = await explorer.getNotes()
        break
      case "files":
        data = await explorer.getFiles()
        break
      case "deal-activities":
        if (!id) throw new Error("ID required for deal-activities")
        data = await explorer.getDealActivities(Number.parseInt(id))
        break
      case "deal-persons":
        if (!id) throw new Error("ID required for deal-persons")
        data = await explorer.getDealPersons(Number.parseInt(id))
        break
      case "person-deals":
        if (!id) throw new Error("ID required for person-deals")
        data = await explorer.getPersonDeals(Number.parseInt(id))
        break
      case "person-activities":
        if (!id) throw new Error("ID required for person-activities")
        data = await explorer.getPersonActivities(Number.parseInt(id))
        break
      case "org-deals":
        if (!id) throw new Error("ID required for org-deals")
        data = await explorer.getOrganizationDeals(Number.parseInt(id))
        break
      case "org-persons":
        if (!id) throw new Error("ID required for org-persons")
        data = await explorer.getOrganizationPersons(Number.parseInt(id))
        break
      case "deals-timeline":
        data = await explorer.getDealsTimeline()
        break
      case "activities-stats":
        data = await explorer.getActivitiesStatistics()
        break
      case "deal-fields":
        data = await explorer.getDealFields()
        break
      case "person-fields":
        data = await explorer.getPersonFields()
        break
      case "org-fields":
        data = await explorer.getOrganizationFields()
        break
      case "activity-fields":
        data = await explorer.getActivityFields()
        break
      default:
        throw new Error("Invalid endpoint")
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error exploring Pipedrive:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
