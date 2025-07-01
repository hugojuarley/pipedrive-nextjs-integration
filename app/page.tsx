import Link from 'next/link'

export default function Home() {
  const routes = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      description: 'Visualize dados e estatísticas do Pipedrive'
    },
    {
      name: 'Pipedrive',
      path: '/pipedrive',
      description: 'Visualizador de dados do Pipedrive'
    },
    {
      name: 'Pipedrive Explorer',
      path: '/pipedrive-explorer',
      description: 'Explorador da API do Pipedrive'
    },
    {
      name: 'Exemplo com Paginação',
      path: '/pagination-example',
      description: 'Demonstração de paginação de dados'
    },
    {
      name: 'Exemplo Sem Paginação',
      path: '/no-pagination-example',
      description: 'Demonstração sem paginação - primeiros 100 registros'
    },
    {
      name: 'Carregar Todos os Deals',
      path: '/load-all-deals',
      description: 'Carrega TODOS os deals automaticamente'
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Projeto Next.js
          </h1>
          <p className="text-xl text-gray-600">
            Integração com Pipedrive - Escolha uma das opções abaixo:
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="group block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 hover:border-blue-300"
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                  {route.name}
                </h2>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                  {route.description}
                </p>
                <div className="mt-4 text-blue-500 group-hover:text-blue-600 transition-colors">
                  <span className="text-sm font-medium">Acessar →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              APIs Disponíveis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>/api/pipedrive/deals</strong> - Listar negócios
              </div>
              <div>
                <strong>/api/pipedrive/persons</strong> - Listar pessoas
              </div>
              <div>
                <strong>/api/pipedrive/search</strong> - Buscar dados
              </div>
              <div>
                <strong>/api/pipedrive/sync</strong> - Sincronizar dados
              </div>
              <div>
                <strong>/api/pipedrive/explore</strong> - Explorar API
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 