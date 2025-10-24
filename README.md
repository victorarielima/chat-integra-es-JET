# Dashboard de Integrações - JetSales

Plataforma inteligente para gerenciamento e visualização de possibilidades de integração com múltiplos sistemas usando n8n.

## 🚀 Recursos

- **Chat Inteligente**: Converse com o Glivan-bot para descobrir possibilidades de integração
- **Seleção de Integrações**: Interface intuitiva para selecionar e visualizar ações disponíveis
- **Dashboard de Insights**: Visualize estatísticas e possibilidades de integração por categoria
- **17 Sistemas Integrados**: Acesso a 94 ações diferentes
- **Tema Escuro/Claro**: Suporte completo para ambos os temas
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 📋 Sistemas Disponíveis

- Jetsales - GO
- Omie
- Active Campaign
- RD Station
- Asaas
- FBits
- Tiny
- Google
- E mais 9 sistemas!

## 🛠️ Requisitos

- Node.js (v16 ou superior)
- npm ou yarn

## 📦 Instalação

```sh
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Navegue até o diretório
cd integration-vision-main

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 🏗️ Estrutura do Projeto

```
src/
├── pages/
│   ├── Index.tsx       # Página de chat principal
│   ├── Insights.tsx    # Dashboard de insights
│   ├── Integracoes.tsx # Lista de integrações
│   └── IntegrationDetail.tsx # Detalhes de integração
├── components/
│   ├── AppSidebar.tsx
│   ├── ActionCard.tsx
│   └── ui/ (componentes shadcn/ui)
├── hooks/
│   └── use-integrations.ts # Hook para dados de integrações
├── contexts/
│   └── ThemeContext.tsx # Contexto de tema
└── types/
    └── integration.ts # Tipos TypeScript
```

## 🔌 Integração com n8n

O projeto se conecta a webhooks n8n para:
- Carregar lista de integrações disponíveis
- Processar mensagens do chat
- Retornar dados de possibilidades

**Webhook**: `https://n8n.jetsalesbrasil.com/webhook/`

## 🎨 Tecnologias

- **React 18+**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Estilização
- **shadcn/ui**: Componentes UI
- **Vite**: Build tool
- **React Router v6**: Roteamento

## 📱 Páginas

### 1. Chat (Index)
Converse com o bot para descobrir integrações

### 2. Integrações
Liste todas as integrações e suas ações

### 3. Insights
Dashboard com estatísticas e possibilidades de integração

## 🚀 Deploy

Para fazer build para produção:

```sh
npm run build
```

## 📄 Licença

Todos os direitos reservados © 2025 JetSales
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 🚀 Deploy

Para fazer build para produção:

```sh
npm run build
```

## 📄 Licença

Todos os direitos reservados © 2025 JetSales
