import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { getInitialSidebarState } from "@/hooks/use-sidebar-state";
import { useTheme } from "@/contexts/ThemeContext";
import { useIntegrations } from "@/hooks/use-integrations";
import type { Integration, IntegrationAction } from "@/types/integration";

const IntegrationDetail = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const { integrations: groupedIntegrations, loading } = useIntegrations();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Encontra a integração que corresponde ao ID
  const integration = useMemo(() => {
    return groupedIntegrations.find(g => g.id === id?.toLowerCase());
  }, [groupedIntegrations, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const copyToClipboard = (text: string, actionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(actionId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!integration) {
    if (loading) {
      return (
        <SidebarProvider defaultOpen={getInitialSidebarState()}>
          <AppSidebar />
          <SidebarInset>
            <div className={`min-h-screen flex items-center justify-center ${theme === "light" ? "bg-gray-100" : "bg-background"}`}>
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Carregando integração...</p>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      );
    }

    return (
      <SidebarProvider defaultOpen={getInitialSidebarState()}>
        <AppSidebar />
        <SidebarInset>
          <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-black" : "bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100"}`}>
            {/* Efeitos visuais de fundo - apenas modo escuro */}
            {theme === "dark" && (
              <>
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent blur-3xl opacity-70 transform -skew-y-12"></div>
                </div>
              </>
            )}
            <div className="text-center relative z-10">
              <h2 className="text-2xl font-bold text-foreground mb-4">Sistema não encontrado</h2>
              <Link to="/integracoes">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={getInitialSidebarState()}>
      <AppSidebar />
      <SidebarInset>
        <div className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100"}`}>
          <MobileHeader />
          {/* Efeitos visuais de fundo - apenas modo escuro */}
          {theme === "dark" && (
            <>
              <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent blur-3xl opacity-70 transform -skew-y-12"></div>
              </div>
              <div className="fixed top-0 left-0 w-1/3 h-1/2 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 0% 50%, rgba(34, 197, 94, 0.25) 0%, transparent 70%)',
                filter: 'blur(120px)'
              }}></div>
              <div className="fixed top-0 right-0 w-1/3 h-1/2 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 100% 50%, rgba(34, 197, 94, 0.25) 0%, transparent 70%)',
                filter: 'blur(120px)'
              }}></div>
            </>
          )}
          {/* Main Content */}
          <main className="container mx-auto px-6 py-8 md:pt-8 pt-16 relative z-10">
            <Link to="/integracoes">
              <Button variant="ghost" size="sm" className="mb-6 text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:shadow-md hover:shadow-primary/50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Integrações
              </Button>
            </Link>

            {/* Header com Background Destaque */}
            <div className="mb-8 p-8 rounded-lg bg-gradient-to-r from-green-700/10 to-green-600/5 border border-green-700/20 dark:border-green-400/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-5xl font-bold text-foreground mb-3">{integration.name}</h1>
                  <Badge variant="secondary" className="bg-green-700/20 text-green-700 dark:text-green-400 dark:bg-green-400/20 border-green-700/30 dark:border-green-400/30 border text-sm px-4 py-1 font-semibold">
                    {integration.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-semibold">Total de Ações</p>
                  <div className="text-5xl font-bold text-green-700 dark:text-green-400">
                    {integration.actions.length}
                  </div>
                </div>
              </div>
              <p className="text-foreground/70 text-base mt-4">
                {integration.description || "Plataforma de integração completa com múltiplos endpoints"}
              </p>
            </div>

            {/* Resumo Rápido */}
            <div className="mb-8 p-6 rounded-lg bg-gradient-card border border-border/50 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                ✨ Ações Disponíveis para Integração
              </h2>
              <p className="text-sm text-foreground/80">
                {integration.actions.length} endpoint{integration.actions.length !== 1 ? 's' : ''} pronto{integration.actions.length !== 1 ? 's' : ''} para conectar via n8n
              </p>
            </div>

            {/* Actions List */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">📋 Detalhes de Cada Ação</h3>
              
              {integration.actions.map((action, index) => (
                <div key={action.id} className="p-8 rounded-lg bg-gradient-card border border-border/50 backdrop-blur-sm hover:border-green-700/50 dark:hover:border-green-400/50 hover:shadow-lg transition-all">
                  {/* Número da Ação */}
                  <div className="flex items-start justify-between mb-6 pb-6 border-b border-border/30">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-700/20 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-bold text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-widest">Ação Possível</p>
                        <h4 className="text-2xl font-bold text-foreground">{action.name}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Informações Técnicas em Grid Limpo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {/* Categoria */}
                    <div className="p-4 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-widest">📂 Categoria</p>
                      <p className="text-base font-semibold text-foreground">{integration.category}</p>
                    </div>

                    {/* Método */}
                    <div className="p-4 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-widest">🔧 Método</p>
                      <Badge className="bg-green-700 text-white dark:bg-green-600 dark:text-white text-sm font-bold px-3 py-1">
                        {action.method}
                      </Badge>
                    </div>

                    {/* Autenticação */}
                    <div className="p-4 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-widest">🔐 Autenticação</p>
                      <p className="text-sm font-semibold text-foreground">{action.authentication}</p>
                    </div>
                  </div>

                  {/* Endpoint - Destaque */}
                  <div className="mb-6 pb-6 border-b border-border/30">
                    <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-widest">🌐 Endpoint da API</p>
                    <div className="bg-background/70 rounded-lg p-4 font-mono text-sm text-muted-foreground break-all flex items-center justify-between group hover:bg-green-700/5 dark:hover:bg-green-900/10 hover:border-green-700/30 transition-colors border border-border/50">
                      <span className="flex-1">{action.endpoint}</span>
                      <button
                        onClick={() => copyToClipboard(action.endpoint, action.id)}
                        className="ml-4 p-2 opacity-60 hover:opacity-100 transition-opacity flex-shrink-0 hover:bg-green-700/10 dark:hover:bg-green-900/20 rounded"
                        title="Copiar endpoint"
                      >
                        {copiedId === action.id ? (
                          <Check className="w-5 h-5 text-green-600 font-bold" />
                        ) : (
                          <Copy className="w-5 h-5 text-muted-foreground hover:text-green-700 dark:hover:text-green-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Descrição - Info Importante */}
                  {action.description && (
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-widest">💡 O que faz?</p>
                      <div className="bg-blue-700/15 dark:bg-blue-900/30 p-5 rounded-lg border-l-4 border-blue-700 dark:border-blue-400">
                        <p className="text-base text-foreground leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Observações - Info Complementar */}
                  {action.observations && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-widest">📌 Informações Importantes</p>
                      <div className="bg-amber-700/15 dark:bg-amber-900/30 p-5 rounded-lg border-l-4 border-amber-700 dark:border-amber-400">
                        <p className="text-base text-foreground/90 leading-relaxed">
                          {action.observations}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default IntegrationDetail;
