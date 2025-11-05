export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  icon?: string;
  actions: IntegrationAction[];
}

export interface IntegrationAction {
  id: string;
  name: string;
  method: string;
  endpoint: string;
  authentication: string;
  description: string;
  observations: string;
}

export interface InsightData {
  row_number: number;
  Sistema: string;
  Insight: string;
  tipo?: string;
}
