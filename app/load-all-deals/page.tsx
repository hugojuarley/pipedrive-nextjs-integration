import LoadAllDeals from '@/components/load-all-deals'

export default function LoadAllDealsPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Carregar Todos os Deals</h1>
        <p className="text-gray-600">
          Esta página carrega TODOS os deals do Pipedrive fazendo múltiplas requisições automaticamente.
          Útil quando você precisa de todos os dados para análise ou relatórios.
        </p>
      </div>
      
      <LoadAllDeals />
    </div>
  )
} 