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
            <div className="mb-8 p-8 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-5xl font-bold text-foreground mb-3">{integration.name}</h1>
                  <Badge variant="secondary" className={`bg-primary/20 border-primary/30 border text-sm px-4 py-1 font-semibold hover:bg-primary/30 transition-colors cursor-default ${theme === "dark" ? "text-white" : "text-black"}`}>
                    {integration.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-semibold">Total de Ações</p>
                  <div className="text-5xl font-bold text-primary">
                    {integration.actions.length}
                  </div>
                </div>
              </div>
              <p className="text-foreground/70 text-base mt-4">
                {integration.description || "Plataforma de integração completa com múltiplos endpoints"}
              </p>
            </div>

            {/* Actions List */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integration.actions.map((action, index) => (
                  <div key={action.id} className="p-8 rounded-lg bg-gradient-card border border-border/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all h-full flex flex-col">
                    {/* Número da Ação */}
                    <div className="flex items-start justify-between mb-6 pb-6 border-b border-border/30">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 font-bold text-lg flex-shrink-0 ${theme === "dark" ? "text-white" : "text-black"}`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-widest">Ação Possível</p>
                          <h4 className="text-lg font-bold text-foreground">{action.name}</h4>
                        </div>
                      </div>
                    </div>

                    {/* Descrição - O que faz */}
                    {action.description && (
                      <div className="flex-grow">
                        <div className="bg-primary/15 dark:bg-primary/20 p-5 rounded-lg border-l-4 border-primary h-full flex items-center">
                          <p className="text-sm text-foreground leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default IntegrationDetail;
