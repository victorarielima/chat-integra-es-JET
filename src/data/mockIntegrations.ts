import { Integration } from "@/types/integration";

export const mockIntegrations: Integration[] = [
  {
    id: "asaas",
    name: "Asaas",
    category: "Financeiro / ERP",
    description: "Plataforma de gestão financeira e cobranças",
    actions: [
      {
        id: "list-payments",
        name: "Listar Boletos",
        method: "GET",
        endpoint: 'https://api.asaas.com/v3/payments/{{ $json["query.ids"] }}',
        authentication: "Token API via HTTP Header",
        description: "Lista boletos (pagamentos) no sistema Asaas utilizando IDs de pagamentos na URL.",
        observations: 'Requer token de acesso via header Authorization ou access_token. Endpoint: https://api.asaas.com/v3/payments/{{ $json["query.ids"] }}'
      },
      {
        id: "create-payment",
        name: "Criar Cobrança",
        method: "POST",
        endpoint: "https://api.asaas.com/v3/payments",
        authentication: "Token API via HTTP Header",
        description: "Cria uma nova cobrança no Asaas com dados do cliente e valor.",
        observations: "Necessário informar customer (ID do cliente), billingType (BOLETO, CREDIT_CARD, etc), value e dueDate."
      },
      {
        id: "get-customer",
        name: "Buscar Cliente",
        method: "GET",
        endpoint: "https://api.asaas.com/v3/customers/{id}",
        authentication: "Token API via HTTP Header",
        description: "Retorna dados de um cliente específico pelo ID.",
        observations: "O ID do cliente deve ser informado na URL. Retorna informações como nome, email, CPF/CNPJ, etc."
      }
    ]
  },
  {
    id: "rdstation",
    name: "RD Station",
    category: "Marketing",
    description: "Plataforma de automação de marketing e CRM",
    actions: [
      {
        id: "create-lead",
        name: "Criar Lead",
        method: "POST",
        endpoint: "https://api.rd.services/platform/conversions",
        authentication: "Token API via Query Parameter",
        description: "Cria um novo lead no RD Station com informações de contato.",
        observations: "Requer token_rdstation via query parameter. Campos obrigatórios: email, nome. Suporta custom fields e tags."
      },
      {
        id: "update-lead",
        name: "Atualizar Lead",
        method: "PATCH",
        endpoint: "https://api.rd.services/platform/contacts/email:{email}",
        authentication: "OAuth 2.0 via Bearer Token",
        description: "Atualiza informações de um lead existente usando o email como identificador.",
        observations: "Necessário OAuth 2.0. Permite atualizar campos customizados, tags e informações de perfil."
      },
      {
        id: "list-events",
        name: "Listar Eventos",
        method: "GET",
        endpoint: "https://api.rd.services/platform/events",
        authentication: "OAuth 2.0 via Bearer Token",
        description: "Lista eventos de conversão e interações dos leads.",
        observations: "Suporta filtros por data, tipo de evento e identificador do lead. Paginação disponível."
      }
    ]
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    category: "CRM / Vendas",
    description: "CRM focado em gestão de pipeline de vendas",
    actions: [
      {
        id: "create-deal",
        name: "Criar Negócio",
        method: "POST",
        endpoint: "https://api.pipedrive.com/v1/deals",
        authentication: "Token API via Query Parameter",
        description: "Cria um novo negócio (deal) no pipeline de vendas.",
        observations: "Requer api_token via query. Campos principais: title (obrigatório), value, person_id, org_id, stage_id."
      },
      {
        id: "list-deals",
        name: "Listar Negócios",
        method: "GET",
        endpoint: "https://api.pipedrive.com/v1/deals",
        authentication: "Token API via Query Parameter",
        description: "Lista todos os negócios com filtros e paginação.",
        observations: "Suporta filtros por stage_id, status, owner_id. Paginação via start e limit parameters."
      },
      {
        id: "create-person",
        name: "Criar Pessoa",
        method: "POST",
        endpoint: "https://api.pipedrive.com/v1/persons",
        authentication: "Token API via Query Parameter",
        description: "Adiciona uma nova pessoa (contato) no CRM.",
        observations: "Campo name é obrigatório. Suporta múltiplos emails, telefones e campos personalizados."
      }
    ]
  },
  {
    id: "webhook",
    name: "Webhook Genérico",
    category: "Integrações / APIs",
    description: "Envio de dados via webhook para qualquer URL",
    actions: [
      {
        id: "post-webhook",
        name: "Enviar POST",
        method: "POST",
        endpoint: "https://webhook.site/{{uuid}}",
        authentication: "Configurável (Bearer, Basic, etc)",
        description: "Envia dados via POST para um webhook endpoint.",
        observations: "Suporta headers customizados, autenticação variada e body em JSON. Ideal para integrações personalizadas."
      },
      {
        id: "get-webhook",
        name: "Consultar GET",
        method: "GET",
        endpoint: "https://api.exemplo.com/webhook",
        authentication: "Configurável",
        description: "Realiza requisição GET para buscar dados de um webhook.",
        observations: "Permite query parameters dinâmicos e headers customizados."
      }
    ]
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    category: "Marketing / Email",
    description: "Plataforma de email marketing e automação",
    actions: [
      {
        id: "add-member",
        name: "Adicionar Membro",
        method: "POST",
        endpoint: "https://{dc}.api.mailchimp.com/3.0/lists/{list_id}/members",
        authentication: "API Key via Basic Auth",
        description: "Adiciona um novo membro a uma lista de email marketing.",
        observations: "Requer API key e list_id. Campos obrigatórios: email_address e status (subscribed, unsubscribed, pending)."
      },
      {
        id: "update-member",
        name: "Atualizar Membro",
        method: "PATCH",
        endpoint: "https://{dc}.api.mailchimp.com/3.0/lists/{list_id}/members/{subscriber_hash}",
        authentication: "API Key via Basic Auth",
        description: "Atualiza informações de um membro existente.",
        observations: "subscriber_hash é o MD5 do email. Permite atualizar tags, merge fields e status."
      }
    ]
  }
];
