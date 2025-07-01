"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { JsonViewer } from "./json-viewer"
import { Loader2, Database, Users, Building, Calendar, Settings, BarChart3 } from "lucide-react"

interface Endpoint {
  key: string
  name: string
  description: string
  needsId?: boolean
  category: string
  icon: React.ReactNode
}

const endpoints: Endpoint[] = [
  // Dados Principais
  {
    key: "deals",
    name: "Deals",
    description: "Todos os negócios",
    category: "main",
    icon: <Database className="w-4 h-4" />,
  },
  {
    key: "persons",
    name: "Persons",
    description: "Todos os contatos",
    category: "main",
    icon: <Users className="w-4 h-4" />,
  },
  {
    key: "organizations",
    name: "Organizations",
    description: "Todas as empresas",
    category: "main",
    icon: <Building className="w-4 h-4" />,
  },
  {
    key: "activities",
    name: "Activities",
    description: "Todas as atividades",
    category: "main",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    key: "products",
    name: "Products",
    description: "Todos os produtos",
    category: "main",
    icon: <Database className="w-4 h-4" />,
  },
  {
    key: "notes",
    name: "Notes",
    description: "Todas as anotações",
    category: "main",
    icon: <Database className="w-4 h-4" />,
  },
  {
    key: "files",
    name: "Files",
    description: "Todos os arquivos",
    category: "main",
    icon: <Database className="w-4 h-4" />,
  },

  // Configurações
  {
    key: "pipelines",
    name: "Pipelines",
    description: "Funis de vendas",
    category: "config",
    icon: <Settings className="w-4 h-4" />,
  },
  {
    key: "stages",
    name: "Stages",
    description: "Etapas dos funis",
    category: "config",
    icon: <Settings className="w-4 h-4" />,
  },
  {
    key: "users",
    name: "Users",
    description: "Usuários da conta",
    category: "config",
    icon: <Users className="w-4 h-4" />,
  },

  // Relacionamentos (precisam de ID)
  {
    key: "deal-activities",
    name: "Deal → Activities",
    description: "Atividades de um deal",
    needsId: true,
    category: "relations",
    icon: <Database className="w-4 h-4" />,
  },
  {
    key: "deal-persons",
    name: "Deal → Persons",
    description: "Contatos de um deal",
    needsId: true,
    category: "relations",
    icon: <Database className="w-4 h-4" />,
  },
  {
    key: "person-deals",
    name: "Person → Deals",
    description: "Deals de um contato",
    needsId: true,
    category: "relations",
    icon: <Database className="w-4 h-4" />,
  },
  {
    key: "person-activities",
    name: "Person → Activities",
    description: "Atividades de um contato",
    needsId: true,
    category: "relations",
    icon: <Database className="w-4 h-4" />,
  },
  {
    key: "org-deals",
    name: "Organization → Deals",
    description: "Deals de uma empresa",
    needsId: true,
    category: "relations",
    icon: <Database className="w-4 h-4" />,
  },
  {
    key: "org-persons",
    name: "Organization → Persons",
    description: "Contatos de uma empresa",
    needsId: true,
    category: "relations",
    icon: <Database className="w-4 h-4" />,
  },

  // Estatísticas
  {
    key: "deals-timeline",
    name: "Deals Timeline",
    description: "Timeline dos deals",
    category: "stats",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    key: "activities-stats",
    name: "Activities Stats",
    description: "Estatísticas de atividades",
    category: "stats",
    icon: <BarChart3 className="w-4 h-4" />,
  },

  // Campos Customizados
  {
    key: "deal-fields",
    name: "Deal Fields",
    description: "Campos customizados de deals",
    category: "fields",
    icon: <Settings className="w-4 h-4" />,
  },
  {
    key: "person-fields",
    name: "Person Fields",
    description: "Campos customizados de contatos",
    category: "fields",
    icon: <Settings className="w-4 h-4" />,
  },
  {
    key: "org-fields",
    name: "Organization Fields",
    description: "Campos customizados de empresas",
    category: "fields",
    icon: <Settings className="w-4 h-4" />,
  },
  {
    key: "activity-fields",
    name: "Activity Fields",
    description: "Campos customizados de atividades",
    category: "fields",
    icon: <Settings className="w-4 h-4" />,
  },
]

const categories = {
  main: { name: "Dados Principais", color: "bg-blue-100 text-blue-800" },
  config: { name: "Configurações", color: "bg-green-100 text-green-800" },
  relations: { name: "Relacionamentos", color: "bg-purple-100 text-purple-800" },
  stats: { name: "Estatísticas", color: "bg-orange-100 text-orange-800" },
  fields: { name: "Campos Customizados", color: "bg-gray-100 text-gray-800" },
}

export default function PipedriveExplorer() {
  const [loading, setLoading] = useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("")
  const [inputId, setInputId] = useState<string>("")
  const [jsonData, setJsonData] = useState<any>(null)
  const [error, setError] = useState<string>("")

  const fetchData = async (endpoint: string, id?: string) => {
    setLoading(true)
    setError("")
    setJsonData(null)

    try {
      const params = new URLSearchParams({ endpoint })
      if (id) params.append("id", id)

      const response = await fetch(`/api/pipedrive/explore?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar dados")
      }

      setJsonData(data)
      setSelectedEndpoint(endpoint)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const handleEndpointClick = (endpoint: Endpoint) => {
    if (endpoint.needsId && !inputId.trim()) {
      setError("Este endpoint precisa de um ID")
      return
    }
    fetchData(endpoint.key, endpoint.needsId ? inputId : undefined)
  }

  const groupedEndpoints = endpoints.reduce(
    (acc, endpoint) => {
      if (!acc[endpoint.category]) acc[endpoint.category] = []
      acc[endpoint.category].push(endpoint)
      return acc
    },
    {} as Record<string, Endpoint[]>,
  )

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Pipedrive API Explorer</h1>
        <p className="text-gray-600">Explore todos os endpoints e veja os JSONs reais da API</p>
      </div>

      {/* Input para IDs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ID para Relacionamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Digite um ID (ex: 1, 2, 3...) para endpoints que precisam de ID"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className="max-w-md"
          />
          <p className="text-sm text-gray-500 mt-2">
            Necessário para endpoints de relacionamento (Deal → Activities, Person → Deals, etc.)
          </p>
        </CardContent>
      </Card>

      {/* Endpoints por Categoria */}
      <div className="space-y-6">
        {Object.entries(groupedEndpoints).map(([categoryKey, categoryEndpoints]) => (
          <Card key={categoryKey}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge className={categories[categoryKey as keyof typeof categories].color}>
                  {categories[categoryKey as keyof typeof categories].name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryEndpoints.map((endpoint) => (
                  <Button
                    key={endpoint.key}
                    variant={selectedEndpoint === endpoint.key ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleEndpointClick(endpoint)}
                    disabled={loading}
                  >
                    <div className="flex items-start gap-2 text-left">
                      {endpoint.icon}
                      <div>
                        <div className="font-medium">{endpoint.name}</div>
                        <div className="text-xs text-gray-500">{endpoint.description}</div>
                        {endpoint.needsId && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Precisa ID
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Carregando dados da API...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-red-600">
              <strong>Erro:</strong> {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* JSON Viewer */}
      {jsonData && (
        <JsonViewer
          data={jsonData}
          title={`${endpoints.find((e) => e.key === selectedEndpoint)?.name || selectedEndpoint} - JSON Response`}
        />
      )}

      {/* Documentação das Relações */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Mapa de Relações do Pipedrive</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">🔗 Relações Principais:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  • <strong>Deal</strong> → Person, Organization, Activities, Products
                </li>
                <li>
                  • <strong>Person</strong> → Deals, Organization, Activities, Notes
                </li>
                <li>
                  • <strong>Organization</strong> → Deals, Persons, Activities
                </li>
                <li>
                  • <strong>Activity</strong> → Deal, Person, Organization
                </li>
                <li>
                  • <strong>Pipeline</strong> → Stages → Deals
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📊 Campos Importantes:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  • <strong>IDs:</strong> person_id, org_id, deal_id, stage_id
                </li>
                <li>
                  • <strong>Status:</strong> active_flag, done, status
                </li>
                <li>
                  • <strong>Datas:</strong> add_time, update_time, due_date
                </li>
                <li>
                  • <strong>Valores:</strong> value, currency, formatted_value
                </li>
                <li>
                  • <strong>Contatos:</strong> email[], phone[] (arrays com primary)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
