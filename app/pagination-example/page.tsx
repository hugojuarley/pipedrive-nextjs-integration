import PaginationExample from '@/components/pagination-example'

export default function PaginationExamplePage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Exemplo de Paginação</h1>
        <p className="text-gray-600">
          Esta página demonstra como implementar paginação com a API do Pipedrive.
          Os dados são carregados em páginas para melhor performance.
        </p>
      </div>
      
      <PaginationExample />
    </div>
  )
} 