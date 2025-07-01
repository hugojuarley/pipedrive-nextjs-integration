interface PipedriveResponse<T> {
  success: boolean
  data: T[]
  additional_data?: {
    pagination?: {
      start: number
      limit: number
      more_items_in_collection: boolean
    }
  }
}

interface Deal {
  id: number
  title: string
  value: number
  currency: string
  status: string
  stage_name: string
  person_name: string
  org_name: string
  add_time: string
  update_time: string
}

interface Person {
  id: number
  name: string
  email: Array<{ value: string; primary: boolean }>
  phone: Array<{ value: string; primary: boolean }>
  org_name: string
  add_time: string
}

interface Activity {
  id: number
  subject: string
  type: string
  due_date: string
  done: boolean
  person_name: string
  deal_title: string
}

export class PipedriveReadOnlyClient {
  private apiToken: string
  private baseUrl: string

  constructor(apiToken: string) {
    this.apiToken = apiToken
    this.baseUrl = "https://api.pipedrive.com/v1"
  }

  private async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<PipedriveResponse<T>> {
    const searchParams = new URLSearchParams({
      api_token: this.apiToken,
      ...params,
    })

    const url = `${this.baseUrl}${endpoint}?${searchParams}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Pipedrive API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // DEALS
  async getDeals(
    params: {
      status?: "open" | "won" | "lost" | "deleted" | "all_not_deleted"
      start?: number
      limit?: number
      sort?: string
    } = {},
  ) {
    return this.get<Deal>("/deals", {
      status: "all_not_deleted",
      limit: 100,
      ...params,
    })
  }

  // Buscar TODOS os deals sem paginação
  async getAllDeals(
    params: {
      status?: "open" | "won" | "lost" | "deleted" | "all_not_deleted"
      sort?: string
    } = {},
  ): Promise<Deal[]> {
    const allDeals: Deal[] = []
    let start = 0
    const limit = 100 // Máximo permitido pela API
    let hasMore = true
    let requestCount = 0

    try {
      while (hasMore && requestCount < 10) { // Limite de segurança
        console.log(`Fetching deals: start=${start}, limit=${limit}`)
        
        const response = await this.get<Deal>("/deals", {
          status: "all_not_deleted",
          limit,
          start,
          ...params,
        })

        if (response.data && response.data.length > 0) {
          allDeals.push(...response.data)
          console.log(`Fetched ${response.data.length} deals, total: ${allDeals.length}`)
        }

        // Verifica se há mais dados
        hasMore = response.additional_data?.pagination?.more_items_in_collection || false
        start += limit
        requestCount++

        // Pequena pausa para não sobrecarregar a API
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      console.log(`Total deals fetched: ${allDeals.length}`)
      return allDeals
    } catch (error) {
      console.error('Error in getAllDeals:', error)
      // Se houver erro, retorna pelo menos os dados que conseguiu buscar
      return allDeals
    }
  }

  async getDealById(id: number) {
    const response = await this.get<Deal>(`/deals/${id}`)
    return response.data?.[0] || null
  }

  // PERSONS
  async getPersons(
    params: {
      start?: number
      limit?: number
      sort?: string
    } = {},
  ) {
    return this.get<Person>("/persons", {
      limit: 100,
      ...params,
    })
  }

  // Buscar TODAS as persons sem paginação
  async getAllPersons(
    params: {
      sort?: string
    } = {},
  ): Promise<Person[]> {
    const allPersons: Person[] = []
    let start = 0
    const limit = 100 // Máximo permitido pela API
    let hasMore = true

    while (hasMore) {
      const response = await this.get<Person>("/persons", {
        limit,
        start,
        ...params,
      })

      allPersons.push(...response.data)

      // Verifica se há mais dados
      hasMore = response.additional_data?.pagination?.more_items_in_collection || false
      start += limit
    }

    return allPersons
  }

  async getPersonById(id: number) {
    const response = await this.get<Person>(`/persons/${id}`)
    return response.data?.[0] || null
  }

  // ACTIVITIES
  async getActivities(
    params: {
      start?: number
      limit?: number
      done?: 0 | 1
      type?: string
    } = {},
  ) {
    return this.get<Activity>("/activities", {
      limit: 100,
      ...params,
    })
  }

  // PIPELINE & STAGES
  async getPipelines() {
    return this.get("/pipelines")
  }

  async getStages(pipelineId?: number) {
    const endpoint = pipelineId ? `/pipelines/${pipelineId}/stages` : "/stages"
    return this.get(endpoint)
  }

  // SEARCH
  async searchDeals(term: string) {
    return this.get("/deals/search", { term })
  }

  async searchPersons(term: string) {
    return this.get("/persons/search", { term })
  }

  // STATISTICS
  async getDealsStatistics(
    params: {
      start_date?: string
      end_date?: string
      user_id?: number
    } = {},
  ) {
    return this.get("/deals/timeline", params)
  }
}
