import { useState, useEffect } from "react";
import { InsightData } from "@/types/integration";

interface GroupedInsights {
  [sistema: string]: InsightData[];
}

export const useInsights = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [groupedInsights, setGroupedInsights] = useState<GroupedInsights>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://n8n.jetsalesbrasil.com/webhook/insights",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ao buscar insights: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Se a resposta for um array direto
        const insightsArray = Array.isArray(data) ? data : data.data || [];
        
        setInsights(insightsArray);

        // Agrupar por Sistema
        const grouped: GroupedInsights = {};
        insightsArray.forEach((insight: InsightData) => {
          if (!grouped[insight.Sistema]) {
            grouped[insight.Sistema] = [];
          }
          grouped[insight.Sistema].push(insight);
        });

        setGroupedInsights(grouped);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        console.error("Erro ao buscar insights:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return { insights, groupedInsights, loading, error };
};
