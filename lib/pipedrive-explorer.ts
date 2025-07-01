export class PipedriveExplorer {
  private apiToken: string
  private baseUrl: string

  constructor(apiToken: string) {
    this.apiToken = apiToken
    this.baseUrl = "https://api.pipedrive.com/v1"
  }

  private async request(endpoint: string, params: Record<string, any> = {}) {
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

  // ENDPOINTS PRINCIPAIS
  async getDeals(limit = 5) {
    return this.request("/deals", { limit })
  }

  async getPersons(limit = 5) {
    return this.request("/persons", { limit })
  }

  async getOrganizations(limit = 5) {
    return this.request("/organizations", { limit })
  }

  async getActivities(limit = 5) {
    return this.request("/activities", { limit })
  }

  async getPipelines() {
    return this.request("/pipelines")
  }

  async getStages() {
    return this.request("/stages")
  }

  async getUsers() {
    return this.request("/users")
  }

  async getProducts(limit = 5) {
    return this.request("/products", { limit })
  }

  async getNotes(limit = 5) {
    return this.request("/notes", { limit })
  }

  async getFiles(limit = 5) {
    return this.request("/files", { limit })
  }

  // ENDPOINTS DE RELACIONAMENTO
  async getDealActivities(dealId: number) {
    return this.request(`/deals/${dealId}/activities`)
  }

  async getDealPersons(dealId: number) {
    return this.request(`/deals/${dealId}/persons`)
  }

  async getPersonDeals(personId: number) {
    return this.request(`/persons/${personId}/deals`)
  }

  async getPersonActivities(personId: number) {
    return this.request(`/persons/${personId}/activities`)
  }

  async getOrganizationDeals(orgId: number) {
    return this.request(`/organizations/${orgId}/deals`)
  }

  async getOrganizationPersons(orgId: number) {
    return this.request(`/organizations/${orgId}/persons`)
  }

  // ENDPOINTS DE ESTATÍSTICAS
  async getDealsTimeline() {
    return this.request("/deals/timeline")
  }

  async getActivitiesStatistics() {
    return this.request("/activities/statistics")
  }

  // CAMPOS CUSTOMIZADOS
  async getDealFields() {
    return this.request("/dealFields")
  }

  async getPersonFields() {
    return this.request("/personFields")
  }

  async getOrganizationFields() {
    return this.request("/organizationFields")
  }

  async getActivityFields() {
    return this.request("/activityFields")
  }
}
