'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PaginationInfo {
  start: number
  limit: number
  more_items_in_collection: boolean
}

interface ApiResponse<T> {
  success: boolean
  data: T[]
  pagination?: PaginationInfo
}

export default function PaginationExample() {
  const [data, setData] = useState<any[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage] = useState(20)

  const fetchData = async (start: number = 0) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/pipedrive/deals?start=${start}&limit=${itemsPerPage}`)
      const result: ApiResponse<any> = await response.json()
      
      if (result.success) {
        setData(result.data)
        setPagination(result.pagination || null)
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleNextPage = () => {
    if (pagination?.more_items_in_collection) {
      const nextStart = pagination.start + pagination.limit
      setCurrentPage(currentPage + 1)
      fetchData(nextStart)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      const prevStart = Math.max(0, pagination!.start - pagination!.limit)
      setCurrentPage(currentPage - 1)
      fetchData(prevStart)
    }
  }

  const handlePageChange = (page: number) => {
    const start = page * itemsPerPage
    setCurrentPage(page)
    fetchData(start)
  }

  const totalPages = pagination 
    ? Math.ceil((pagination.start + data.length + (pagination.more_items_in_collection ? 1 : 0)) / itemsPerPage)
    : 0

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Exemplo de Paginação - Deals</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <>
            {/* Lista de Dados */}
            <div className="space-y-2 mb-6">
              {data.map((deal) => (
                <div key={deal.id} className="p-3 border rounded-lg">
                  <h3 className="font-semibold">{deal.title}</h3>
                  <p className="text-sm text-gray-600">
                    Valor: {deal.value} {deal.currency}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {deal.status}
                  </p>
                </div>
              ))}
            </div>

            {/* Controles de Paginação */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Página {currentPage + 1} de {totalPages}
                {pagination && (
                  <span className="ml-2">
                    (Itens {pagination.start + 1}-{pagination.start + data.length})
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  variant="outline"
                >
                  Anterior
                </Button>

                {/* Números das Páginas */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => handlePageChange(i)}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  onClick={handleNextPage}
                  disabled={!pagination?.more_items_in_collection}
                  variant="outline"
                >
                  Próxima
                </Button>
              </div>
            </div>

            {/* Informações de Paginação */}
            {pagination && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Informações de Paginação:</h4>
                <pre className="text-sm">
                  {JSON.stringify(pagination, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
} 