'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

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
}

export default function NoPaginationExample() {
  const [allDeals, setAllDeals] = useState<Deal[]>([])
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('title')

  const fetchAllDeals = async () => {
    setLoading(true)
    try {
      // Usando a API original que já funciona
      const response = await fetch('/api/pipedrive/deals?start=0&limit=100')
      const result = await response.json()
      
      if (result.success) {
        setAllDeals(result.data)
        setFilteredDeals(result.data)
        console.log(`Loaded ${result.data.length} deals`)
      } else {
        console.error('API returned error:', result.error)
        alert(`Erro ao carregar dados: ${result.error}`)
      }
    } catch (error) {
      console.error('Erro ao buscar deals:', error)
      alert('Erro de conexão. Verifique se o servidor está rodando.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllDeals()
  }, [])

  // Filtro e busca em tempo real
  useEffect(() => {
    let filtered = allDeals

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(deal => deal.status === statusFilter)
    }

    // Busca por texto
    if (searchTerm) {
      filtered = filtered.filter(deal => 
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.person_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.org_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'value':
          return b.value - a.value
        case 'status':
          return a.status.localeCompare(b.status)
        case 'date':
          return new Date(b.add_time).getTime() - new Date(a.add_time).getTime()
        default:
          return 0
      }
    })

    setFilteredDeals(filtered)
  }, [allDeals, searchTerm, statusFilter, sortBy])

  const handleRefresh = () => {
    fetchAllDeals()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'won': return 'bg-green-100 text-green-800'
      case 'lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Deals Sem Paginação - Primeiros 100 Registros</CardTitle>
        <p className="text-sm text-gray-600">
          Total: {filteredDeals.length} deals (de {allDeals.length} total) - Máximo 100 por requisição
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <Progress className="w-full max-w-md" />
            <span className="text-gray-500">Carregando todos os deals...</span>
          </div>
        ) : (
          <>
            {/* Controles */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Buscar por título, pessoa ou organização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="open">Abertos</SelectItem>
                  <SelectItem value="won">Ganhos</SelectItem>
                  <SelectItem value="lost">Perdidos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Título</SelectItem>
                  <SelectItem value="value">Valor</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleRefresh} variant="outline">
                🔄 Atualizar
              </Button>
            </div>

            {/* Lista de Dados */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredDeals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum deal encontrado com os filtros aplicados
                </div>
              ) : (
                filteredDeals.map((deal) => (
                  <div key={deal.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{deal.title}</h3>
                        <p className="text-sm text-gray-600">
                          {deal.person_name && `Pessoa: ${deal.person_name}`}
                          {deal.org_name && ` | Organização: ${deal.org_name}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          Estágio: {deal.stage_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {deal.value.toLocaleString()} {deal.currency}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                          {deal.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Estatísticas */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Estatísticas:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong>Total de Deals:</strong> {allDeals.length}
                </div>
                <div>
                  <strong>Deals Abertos:</strong> {allDeals.filter(d => d.status === 'open').length}
                </div>
                <div>
                  <strong>Deals Ganhos:</strong> {allDeals.filter(d => d.status === 'won').length}
                </div>
                <div>
                  <strong>Valor Total:</strong> {allDeals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
} 