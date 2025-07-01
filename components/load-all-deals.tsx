'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

interface PaginationInfo {
  start: number
  limit: number
  more_items_in_collection: boolean
}

interface ApiResponse {
  success: boolean
  data: Deal[]
  pagination?: PaginationInfo
  error?: string
}

export default function LoadAllDeals() {
  const [allDeals, setAllDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const loadAllDeals = async () => {
    setLoading(true)
    setError(null)
    setProgress(0)
    setCurrentPage(0)
    
    const allDealsData: Deal[] = []
    let start = 0
    const limit = 100
    let hasMore = true
    let pageCount = 0

    try {
      while (hasMore && pageCount < 50) { // Limite de segurança
        console.log(`Carregando página ${pageCount + 1}: start=${start}, limit=${limit}`)
        
        const response = await fetch(`/api/pipedrive/deals?start=${start}&limit=${limit}`)
        const result: ApiResponse = await response.json()
        
        if (result.success && result.data) {
          allDealsData.push(...result.data)
          pageCount++
          setCurrentPage(pageCount)
          
          // Calcula progresso
          const estimatedTotal = result.pagination?.more_items_in_collection 
            ? start + result.data.length + 100 
            : start + result.data.length
          const progressPercent = Math.min((start + result.data.length) / estimatedTotal * 100, 100)
          setProgress(progressPercent)
          
          console.log(`Página ${pageCount}: ${result.data.length} deals, Total: ${allDealsData.length}`)
          
          // Verifica se há mais dados
          hasMore = result.pagination?.more_items_in_collection || false
          start += limit
          
          // Pequena pausa para não sobrecarregar
          if (hasMore) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        } else {
          throw new Error(result.error || 'Erro na requisição')
        }
      }
      
      setAllDeals(allDealsData)
      setTotalPages(pageCount)
      setProgress(100)
      console.log(`Carregamento completo: ${allDealsData.length} deals em ${pageCount} páginas`)
      
    } catch (error) {
      console.error('Erro ao carregar todos os deals:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
      // Retorna pelo menos os dados que conseguiu carregar
      if (allDealsData.length > 0) {
        setAllDeals(allDealsData)
        setTotalPages(pageCount)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadAllDeals()
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Carregar TODOS os Deals</CardTitle>
        <p className="text-sm text-gray-600">
          Carrega todos os deals fazendo múltiplas requisições automaticamente
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Progress value={progress} className="w-full max-w-md" />
              <div className="text-center">
                <p className="text-gray-600">
                  Carregando página {currentPage}...
                </p>
                <p className="text-sm text-gray-500">
                  {allDeals.length} deals carregados até agora
                </p>
                <p className="text-sm text-gray-500">
                  Progresso: {Math.round(progress)}%
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">Erro:</p>
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">
                  Total de Deals: {allDeals.length}
                </p>
                <p className="text-sm text-gray-600">
                  Carregados em {totalPages} páginas
                </p>
              </div>
              
              <Button onClick={handleRefresh} variant="outline">
                🔄 Carregar Todos Novamente
              </Button>
            </div>

            {allDeals.length > 0 && (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {allDeals.map((deal) => (
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          deal.status === 'open' ? 'bg-blue-100 text-blue-800' :
                          deal.status === 'won' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {deal.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && allDeals.length === 0 && !error && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum deal carregado ainda.</p>
                <Button onClick={handleRefresh} className="mt-4">
                  🚀 Carregar Todos os Deals
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 