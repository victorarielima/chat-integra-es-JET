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
