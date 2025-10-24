import { useState, useEffect } from "react";
import type { Integration, IntegrationAction } from "@/types/integration";

interface WebhookResponse {
  row_number: number;
  Sistema: string;
  Categoria: string;
  "Ações Possíveis": string;
  "Método / Endpoint": string;
  Autenticação: string;
  Descrição: string;
  "📝 Observações": string;
}

interface UseIntegrationsResult {
  integrations: Integration[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useIntegrations = (): UseIntegrationsResult => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformWebhookData = (data: WebhookResponse[]): Integration[] => {
    // Agrupa por Sistema primeiro
    const groupedBySistema = data.reduce((acc: Record<string, WebhookResponse[]>, item) => {
      const sistema = item.Sistema;
      if (!acc[sistema]) {
        acc[sistema] = [];
      }
      acc[sistema].push(item);
      return acc;
    }, {});

    console.log("🏢 Sistemas encontrados:", Object.keys(groupedBySistema));

    // Depois transforma em integrações
    return Object.entries(groupedBySistema).map(([sistema, items]) => {
      console.log(`📦 Processando ${sistema} com ${items.length} ações`);
      
      const integrationId = sistema.toLowerCase().replace(/\s+/g, "-");
      console.log(`   ID gerado: "${integrationId}"`);
      
      const actions: IntegrationAction[] = items.map((item, idx) => {
        const methodEndpoint = item["Método / Endpoint"] || "";
        const methodMatch = methodEndpoint.match(/^(GET|POST|PUT|DELETE|PATCH)\s*-\s*(.+)$/);
        const method = methodMatch ? methodMatch[1] : "GET";
        const endpoint = methodMatch ? methodMatch[2] : methodEndpoint;

        const action: IntegrationAction = {
          id: `${sistema}-${idx}`,
          name: item["Ações Possíveis"] || "Integração",
          method: method,
          endpoint: endpoint,
          authentication: item.Autenticação || "Não especificada",
          description: item.Descrição || "",
          observations: item["📝 Observações"] || "",
        };
        console.log(`  └─ Ação: ${action.name}`);
        return action;
      });

      return {
        id: integrationId,
        name: sistema,
        category: items[0]?.Categoria || "Sem categoria",
        description: `Integração com ${sistema}`,
        actions: actions,
      };
    });
  };

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("https://n8n.jetsalesbrasil.com/webhook/chat-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "list_integrations",
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Dados recebidos do webhook:", data);

      // Processa a resposta do webhook
      if (Array.isArray(data)) {
        console.log("📊 É um array com", data.length, "items");
        const transformed = transformWebhookData(data);
        console.log("🔄 Dados transformados:", transformed);
        setIntegrations(transformed);
      } else if (data && typeof data === "object") {
        console.log("⚠️ Dados não são array, checando estrutura:", Object.keys(data));
        setIntegrations([]);
      } else {
        console.log("❌ Dados inválidos:", data);
        setIntegrations([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar integrações";
      setError(errorMessage);
      console.error("🔴 Erro ao buscar integrações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    integrations,
    loading,
    error,
    refetch: fetchIntegrations,
  };
};
