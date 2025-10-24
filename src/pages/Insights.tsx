import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { getInitialSidebarState } from "@/hooks/use-sidebar-state";
import { useTheme } from "@/contexts/ThemeContext";
import { useIntegrations } from "@/hooks/use-integrations";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Zap, Grid3x3 } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Insights = () => {
  const { theme } = useTheme();
  const { integrations: systemsList, loading } = useIntegrations();
  const [searchTerm, setSearchTerm] = useState("");

  // Calcula estatísticas
  const stats = useMemo(() => {
    return {
      totalSistemas: systemsList.length,
      totalAcoes: systemsList.reduce((sum, sys) => sum + sys.actions.length, 0),
      sistemaComMaisAcoes: systemsList.reduce((max, sys) => 
        sys.actions.length > (max?.actions.length || 0) ? sys : max
      , null),
      metodosHTTP: Array.from(new Set(
        systemsList.flatMap(sys => sys.actions.map(a => a.method))
      )).length,
    };
  }, [systemsList]);

  // Agrupa ações por categoria de possibilidade
  const acoesAgrupadas = useMemo(() => {
    const grupos: Record<string, Array<{ sistema: string; acao: typeof systemsList[0]['actions'][0] }>> = {};
    
    systemsList.forEach(sistema => {
      sistema.actions.forEach(acao => {
        // Categoriza por tipo de ação
        let categoria = "Outras";
        if (acao.name.toLowerCase().includes("enviar")) categoria = "Envio";
        else if (acao.name.toLowerCase().includes("buscar") || acao.name.toLowerCase().includes("listar")) categoria = "Consulta";
        else if (acao.name.toLowerCase().includes("criar") || acao.name.toLowerCase().includes("atualizar")) categoria = "Criação/Atualização";
        else if (acao.name.toLowerCase().includes("transferir") || acao.name.toLowerCase().includes("atender")) categoria = "Gerenciamento";
        else if (acao.name.toLowerCase().includes("token") || acao.name.toLowerCase().includes("login")) categoria = "Autenticação";
        
        if (!grupos[categoria]) grupos[categoria] = [];
        grupos[categoria].push({ sistema: sistema.name, acao });
      });
    });
    
    return grupos;
  }, [systemsList]);

  // Filtra integrações por busca
  const sistemasFiltrados = useMemo(() => {
    if (!searchTerm) return systemsList;
    const termo = searchTerm.toLowerCase();
    return systemsList.filter(s => 
      s.name.toLowerCase().includes(termo) ||
      s.actions.some(a => a.name.toLowerCase().includes(termo))
    );
  }, [systemsList, searchTerm]);

  if (loading) {
    return (
      <SidebarProvider defaultOpen={getInitialSidebarState()}>
        <AppSidebar />
        <SidebarInset>
          <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-black" : "bg-gray-100"}`}>
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span>Carregando possibilidades de integração...</span>
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
              {/* Efeito superior - top */}
              <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent blur-3xl opacity-70 transform -skew-y-12"></div>
              </div>
              
              {/* Glow esquerdo superior */}
              <div className="fixed top-0 left-0 w-1/3 h-1/2 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 0% 50%, rgba(34, 197, 94, 0.25) 0%, transparent 70%)',
                filter: 'blur(120px)'
              }}></div>
              
              {/* Glow direito superior */}
              <div className="fixed top-0 right-0 w-1/3 h-1/2 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 100% 50%, rgba(34, 197, 94, 0.25) 0%, transparent 70%)',
                filter: 'blur(120px)'
              }}></div>

              {/* Efeito médio - para quando scroll para baixo */}
              <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent blur-3xl opacity-60 transform -skew-y-12"></div>
              </div>

              {/* Glow esquerdo médio */}
              <div className="fixed top-1/3 left-0 w-1/4 h-1/3 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 0% 50%, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
                filter: 'blur(100px)'
              }}></div>

              {/* Glow direito médio */}
              <div className="fixed top-1/3 right-0 w-1/4 h-1/3 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 100% 50%, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
                filter: 'blur(100px)'
              }}></div>

              {/* Efeito inferior - para quando scroll mais para baixo */}
              <div className="fixed top-2/3 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent blur-3xl opacity-50 transform -skew-y-12"></div>
              </div>

              {/* Glow esquerdo inferior */}
              <div className="fixed top-2/3 left-0 w-1/4 h-1/3 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 0% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
                filter: 'blur(100px)'
              }}></div>

              {/* Glow direito inferior */}
              <div className="fixed top-2/3 right-0 w-1/4 h-1/3 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 100% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
                filter: 'blur(100px)'
              }}></div>
            </>
          )}
          {/* Main Content */}

          <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:pt-8 pt-16 relative z-10">
            {/* Header */}
            <div className="mb-8 sm:mb-12">
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                Possibilidades de <span className="bg-gradient-to-r from-[#58FF0F] via-[#59FFFF] to-[#00FF00] bg-clip-text text-transparent">Integração</span>
              </h1>
              <p className={`text-sm sm:text-base md:text-lg ${theme === "dark" ? "text-foreground/60" : "text-gray-600"}`}>
                Explore todas as possibilidades e ações disponíveis para integrar suas plataformas
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
              <Card className={`p-3 sm:p-6 ${theme === "dark" ? "bg-card/50 border-border/30" : "bg-white border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-1">Sistemas</p>
                    <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.totalSistemas}</p>
                  </div>
                  <Grid3x3 className="w-6 sm:w-8 h-6 sm:h-8 opacity-20" />
                </div>
              </Card>
              
              <Card className={`p-3 sm:p-6 ${theme === "dark" ? "bg-card/50 border-border/30" : "bg-white border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Total de Ações</p>
                    <p className="text-3xl font-bold text-primary">{stats.totalAcoes}</p>
                  </div>
                  <Zap className="w-8 h-8 opacity-20" />
                </div>
              </Card>

              <Card className={`p-6 ${theme === "dark" ? "bg-card/50 border-border/30" : "bg-white border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Métodos HTTP</p>
                    <p className="text-3xl font-bold text-primary">{stats.metodosHTTP}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 opacity-20" />
                </div>
              </Card>

              <Card className={`p-6 ${theme === "dark" ? "bg-card/50 border-border/30" : "bg-white border-gray-200"}`}>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Mais Completo</p>
                  <p className="text-lg font-bold truncate">{stats.sistemaComMaisAcoes?.name}</p>
                  <p className="text-xs text-muted-foreground">{stats.sistemaComMaisAcoes?.actions.length} ações</p>
                </div>
              </Card>
            </div>

            {/* Busca */}
            <div className="mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar sistema ou ação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 !bg-transparent ${theme === "dark" ? "border-border/30" : "border-gray-200"}`}
                />
              </div>
            </div>

            {/* Seção de Ações por Categoria */}
            <div className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-black"}`}>
                Ações por Categoria
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(acoesAgrupadas).map(([categoria, acoes]) => (
                  <Card key={categoria} className={`p-6 ${theme === "dark" ? "bg-card/50 border-border/30 hover:border-primary/50" : "bg-white border-gray-200 hover:border-[#58FF0F]"} transition-colors cursor-pointer`}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <h3 className="text-lg font-semibold">{categoria}</h3>
                    </div>
                    <p className="text-3xl font-bold text-primary mb-4">{acoes.length}</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {acoes.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{item.acao.name}</span>
                          <p className="text-xs opacity-60">{item.sistema}</p>
                        </div>
                      ))}
                      {acoes.length > 5 && (
                        <p className="text-xs text-primary font-semibold pt-2">+{acoes.length - 5} mais</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sistemas com Detalhes */}
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-black"}`}>
                Detalhes por Sistema
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {sistemasFiltrados.map((sistema) => (
                  <Card key={sistema.id} className={`p-6 ${theme === "dark" ? "bg-card/50 border-border/30" : "bg-white border-gray-200"}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{sistema.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{sistema.category}</Badge>
                          <Badge variant="secondary">{sistema.actions.length} ações</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {sistema.actions.map((acao) => (
                        <div 
                          key={acao.id}
                          className={`p-3 rounded-lg border ${theme === "dark" ? "border-border/30 bg-background/50" : "border-gray-200 bg-gray-50"}`}
                        >
                          <p className="font-semibold text-sm mb-1">{acao.name}</p>
                          {acao.description && (
                            <p className="text-xs text-muted-foreground mb-2">{acao.description}</p>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">{acao.method}</Badge>
                            <Badge variant="outline" className="text-xs">{acao.authentication}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Insights;
