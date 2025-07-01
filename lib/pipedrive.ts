interface PipedriveConfig {
  apiToken: string
  baseUrl?: string
}

interface Deal {
  title: string
  value: number
  currency: string
  person_id?: number
  stage_id?: number
}

export class PipedriveClient {
  private apiToken: string
  private baseUrl: string

  constructor(config: PipedriveConfig) {
    this.apiToken = config.apiToken
    this.baseUrl = config.baseUrl || "https://api.pipedrive.com/v1"
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}?api_token=${this.apiToken}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`Pipedrive API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getDeals() {
    return this.request("/deals")
  }

  async createDeal(deal: Deal) {
    return this.request("/deals", {
      method: "POST",
      body: JSON.stringify(deal),
    })
  }

  async updateDeal(id: number, deal: Partial<Deal>) {
    return this.request(`/deals/${id}`, {
      method: "PUT",
      body: JSON.stringify(deal),
    })
  }

  async getPersons() {
    return this.request("/persons")
  }

  async createPerson(person: { name: string; email?: string; phone?: string }) {
    return this.request("/persons", {
      method: "POST",
      body: JSON.stringify(person),
    })
  }
}
