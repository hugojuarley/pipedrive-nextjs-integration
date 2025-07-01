# 🚀 Pipedrive Next.js Integration

## 📋 Sobre o Projeto

Este é um projeto **pessoal e educacional** desenvolvido com o objetivo de estudar e explorar a API do Pipedrive através de uma aplicação web moderna construída com Next.js. O projeto foi criado exclusivamente para fins de aprendizado e demonstração de integração com APIs externas.

### 🎯 Objetivos do Projeto

- **Estudar a API do Pipedrive**: Compreender como funciona a integração com sistemas de CRM
- **Praticar Next.js**: Aplicar conceitos modernos de desenvolvimento web com React e Next.js
- **Explorar TypeScript**: Utilizar tipagem estática para melhorar a qualidade do código
- **Implementar UI/UX**: Criar interfaces modernas e responsivas
- **Gerenciamento de Estado**: Praticar diferentes abordagens para gerenciamento de dados

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15.2.4** - Framework React para desenvolvimento web
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de UI modernos e acessíveis

### Backend & APIs
- **Pipedrive API** - API oficial do Pipedrive para integração com CRM
- **Next.js API Routes** - Endpoints da API construídos com Next.js

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para JavaScript/TypeScript
- **PostCSS** - Processador CSS
- **pnpm** - Gerenciador de pacotes

## 🏗️ Estrutura do Projeto

```
pipedrive-nextjs-integration/
├── app/                          # App Router do Next.js
│   ├── api/pipedrive/           # Endpoints da API
│   │   ├── deals/               # API para negócios
│   │   ├── persons/             # API para pessoas
│   │   ├── search/              # API de busca
│   │   ├── sync/                # API de sincronização
│   │   └── explore/             # API exploradora
│   ├── dashboard/               # Página do dashboard
│   ├── pipedrive/               # Página de visualização de dados
│   ├── pipedrive-explorer/      # Página do explorador
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página inicial
│   └── globals.css              # Estilos globais
├── components/                   # Componentes React
│   ├── ui/                      # Componentes de UI base
│   ├── pipedrive-dashboard.tsx  # Dashboard do Pipedrive
│   ├── pipedrive-explorer.tsx   # Explorador da API
│   └── pipedrive-data-viewer.tsx # Visualizador de dados
├── lib/                         # Bibliotecas e utilitários
│   ├── pipedrive.ts             # Cliente Pipedrive principal
│   ├── pipedrive-client.ts      # Cliente somente leitura
│   ├── pipedrive-explorer.ts    # Explorador da API
│   └── utils.ts                 # Utilitários gerais
├── hooks/                       # Custom hooks React
├── public/                      # Arquivos estáticos
└── styles/                      # Estilos adicionais
```

## 🚀 Funcionalidades

### 📊 Dashboard
- Visualização de estatísticas gerais
- Resumo de negócios e pessoas
- Gráficos e métricas do Pipedrive

### 🔍 Explorador da API
- Interface interativa para explorar endpoints
- Teste de diferentes parâmetros da API
- Visualização de respostas em tempo real
- Mapa de relações entre entidades

### 📋 Visualizador de Dados
- Listagem de negócios com filtros
- Listagem de pessoas/contatos
- Busca avançada por termo
- Paginação e ordenação

### 🔌 APIs Disponíveis
- `GET /api/pipedrive/deals` - Listar negócios
- `GET /api/pipedrive/persons` - Listar pessoas
- `GET /api/pipedrive/search` - Buscar dados
- `POST /api/pipedrive/sync` - Sincronizar dados
- `GET /api/pipedrive/explore` - Explorar API

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js 18+ 
- pnpm (recomendado) ou npm
- Conta no Pipedrive com API Token

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd pipedrive-nextjs-integration
```

### 2. Instale as dependências
```bash
pnpm install
# ou
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Pipedrive API Configuration
PIPEDRIVE_API_TOKEN=seu_token_da_api_aqui

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu_secret_aqui

# Environment
NODE_ENV=development
```

### 4. Obtenha seu API Token do Pipedrive
1. Acesse [Pipedrive Settings](https://app.pipedrive.com/settings/api)
2. Gere um novo API Token
3. Copie o token e cole no arquivo `.env`

### 5. Execute o projeto
```bash
pnpm dev
# ou
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📖 Como Usar

### Página Inicial
A página inicial apresenta links para todas as funcionalidades disponíveis:
- **Dashboard**: Visualização geral dos dados
- **Pipedrive**: Visualizador de dados específicos
- **Pipedrive Explorer**: Ferramenta de exploração da API

### Dashboard
- Visualize estatísticas gerais do seu Pipedrive
- Clique em "Sync Data" para atualizar os dados
- Explore diferentes métricas e gráficos

### Explorador da API
- Selecione o endpoint que deseja testar
- Configure parâmetros de consulta
- Visualize a resposta em formato JSON
- Explore o mapa de relações entre entidades

### Visualizador de Dados
- Navegue entre negócios e pessoas
- Use a busca para encontrar dados específicos
- Aplique filtros e ordenação

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
pnpm dev          # Inicia o servidor de desenvolvimento
pnpm build        # Constrói o projeto para produção
pnpm start        # Inicia o servidor de produção
pnpm lint         # Executa o linter
```

### Estrutura de Componentes
O projeto utiliza uma arquitetura baseada em componentes com:
- **Componentes de UI**: Reutilizáveis e acessíveis
- **Componentes de Página**: Específicos para cada rota
- **Hooks Customizados**: Lógica reutilizável
- **Utilitários**: Funções auxiliares

## 📚 Aprendizados e Conceitos Aplicados

### Integração com APIs
- Autenticação via API Token
- Tratamento de erros de API
- Paginação de resultados
- Cache e otimização de requisições

### Next.js App Router
- Estrutura de pastas baseada em rotas
- API Routes para backend
- Server Components vs Client Components
- Layouts e templates

### TypeScript
- Interfaces para tipagem de dados
- Tipos para configurações de API
- Generics para reutilização de código
- Type safety em toda a aplicação

### UI/UX Moderna
- Design responsivo
- Componentes acessíveis
- Animações e transições
- Feedback visual para usuários

## ⚠️ Importante

### Fins Educacionais
Este projeto foi desenvolvido **exclusivamente para fins educacionais e de estudo**. Não é recomendado para uso em produção sem as devidas adaptações e considerações de segurança.

### Limitações
- API Token exposto no frontend (não recomendado para produção)
- Sem autenticação de usuários
- Sem persistência de dados local
- Funcionalidades limitadas ao escopo de estudo

### Melhorias Futuras
- Implementar autenticação de usuários
- Adicionar cache de dados
- Implementar testes automatizados
- Melhorar tratamento de erros
- Adicionar mais funcionalidades da API

## 📄 Licença

Este projeto é de **autoria própria** e foi criado para fins educacionais. O código é livre para uso pessoal e estudo.

## 👨‍💻 Autor

**Hugo Juarley** - Desenvolvedor Full Stack

Este projeto representa uma jornada de aprendizado em integração de APIs, desenvolvimento moderno com Next.js e criação de interfaces de usuário eficientes.

---

**Nota**: Este projeto é uma demonstração educacional e não deve ser usado em ambientes de produção sem as devidas modificações e considerações de segurança. 