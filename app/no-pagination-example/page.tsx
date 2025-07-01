import NoPaginationExample from '@/components/no-pagination-example'

export default function NoPaginationExamplePage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Exemplo Sem Paginação</h1>
        <p className="text-gray-600">
          Esta página demonstra como carregar todos os dados de uma vez, sem paginação.
          Útil para análises, relatórios e quando você tem poucos dados.
        </p>
      </div>
      
      <NoPaginationExample />
    </div>
  )
} 