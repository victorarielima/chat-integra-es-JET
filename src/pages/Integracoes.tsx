import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { getInitialSidebarState } from "@/hooks/use-sidebar-state";
import { useTheme } from "@/contexts/ThemeContext";
import { useIntegrations } from "@/hooks/use-integrations";
import { IntegrationCard } from "@/components/IntegrationCard";
import type { Integration } from "@/types/integration";

const Integracoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useTheme();
  const { integrations: groupedIntegrations, loading, error } = useIntegrations();

  const filteredIntegrations = useMemo(() => {
    return groupedIntegrations.filter(
      (integration) =>
        integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.actions.some((action) =>
          action.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [groupedIntegrations, searchTerm]);

  return (
    <SidebarProvider defaultOpen={getInitialSidebarState()}>
      <AppSidebar />
      <SidebarInset>
        <div className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100"}`}>
          {/* Efeitos visuais de fundo - apenas modo escuro - cobre página inteira */}
          {theme === "dark" && (
            <>
              {/* Efeito superior */}
              <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent blur-3xl opacity-70 transform -skew-y-12"></div>
              </div>
              
              {/* Glow verde superior esquerda */}
              <div className="fixed top-0 left-0 w-1/3 h-1/2 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 0% 50%, rgba(34, 197, 94, 0.25) 0%, transparent 70%)',
                filter: 'blur(120px)'
              }}></div>
              
              {/* Glow verde superior direita */}
              <div className="fixed top-0 right-0 w-1/3 h-1/2 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 100% 50%, rgba(34, 197, 94, 0.25) 0%, transparent 70%)',
                filter: 'blur(120px)'
              }}></div>

              {/* Efeito médio */}
              <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent blur-3xl opacity-60 transform -skew-y-12"></div>
              </div>

              {/* Glow verde médio esquerda */}
              <div className="fixed top-1/3 left-0 w-1/4 h-1/3 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 0% 50%, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
                filter: 'blur(100px)'
              }}></div>

              {/* Glow verde médio direita */}
              <div className="fixed top-1/3 right-0 w-1/4 h-1/3 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 100% 50%, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
                filter: 'blur(100px)'
              }}></div>

              {/* Efeito inferior */}
              <div className="fixed top-2/3 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent blur-3xl opacity-50 transform -skew-y-12"></div>
              </div>

              {/* Glow verde inferior esquerda */}
              <div className="fixed top-2/3 left-0 w-1/4 h-1/3 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 0% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
                filter: 'blur(100px)'
              }}></div>

              {/* Glow verde inferior direita */}
              <div className="fixed top-2/3 right-0 w-1/4 h-1/3 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 100% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
                filter: 'blur(100px)'
              }}></div>
            </>
          )}
          {/* Main Content */}
          <main className="container mx-auto px-6 py-8 relative z-10">
            {/* Search Bar */}
            <div className="mb-8 max-w-2xl animate-fade-in">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar integrações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Carregando integrações...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-red-500 mb-2">Erro ao carregar integrações</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            )}

            {/* Integrations Grid */}
            {!loading && !error && groupedIntegrations.length > 0 && (
              <div className="animate-fade-in">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredIntegrations.map((integration) => (
                    <IntegrationCard key={integration.id} integration={integration} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && groupedIntegrations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhuma integração disponível</p>
              </div>
            )}

            {/* No Results */}
            {!loading && groupedIntegrations.length > 0 && filteredIntegrations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhuma integração encontrada para "{searchTerm}"</p>
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Integracoes;
