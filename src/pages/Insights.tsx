import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { getInitialSidebarState } from "@/hooks/use-sidebar-state";
import { useTheme } from "@/contexts/ThemeContext";
import { useInsights } from "@/hooks/use-insights";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Função para formatar o texto com passos
const formatInsightText = (text: string) => {
  // Se não houver "Passos:", retorna o texto como está
  if (!text.includes("Passos:")) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  // Divide o texto em partes
  const parts = text.split(/(?=Passos:|Variações:|Integrações:|Benefícios:|Extensões)/);
  
  return (
    <div className="space-y-3">
      {parts.map((part, idx) => {
        const trimmedPart = part.trim();
        if (!trimmedPart) return null;

        // Se for a seção de Passos, divide cada passo em uma linha
        if (trimmedPart.startsWith("Passos:")) {
          const passos = trimmedPart.match(/\(\d+\)[^()]*(?=\(\d+\)|$)/g) || [];
          return (
            <div key={idx}>
              <p className="font-semibold text-sm mb-2">Passos:</p>
              <ul className="space-y-1 ml-2">
                {passos.map((passo, passoIdx) => (
                  <li key={passoIdx} className="text-sm list-disc list-inside">
                    {passo.replace(/^\(\d+\)\s*/, '').trim()}
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        // Para outras seções, mantém a formatação normal
        return (
          <div key={idx}>
            <p className="text-sm whitespace-pre-wrap">{trimmedPart}</p>
          </div>
        );
      })}
    </div>
  );
};

const Insights = () => {
  const { theme } = useTheme();
  const { groupedInsights, loading, error } = useInsights();
  const [searchTerm, setSearchTerm] = useState("");

  // Calcula estatísticas
  const stats = useMemo(() => {
    const sistemas = Object.keys(groupedInsights);
    const totalInsights = Object.values(groupedInsights).reduce((sum, arr) => sum + arr.length, 0);
    
    return {
      totalSistemas: sistemas.length,
      totalInsights: totalInsights,
      sistemas: sistemas,
    };
  }, [groupedInsights]);

  // Filtra sistemas por busca
  const sistemasFiltrados = useMemo(() => {
    if (!searchTerm) return stats.sistemas;
    const termo = searchTerm.toLowerCase();
    return stats.sistemas.filter(sistema => {
      const sistemaMatch = sistema.toLowerCase().includes(termo);
      const insightsMatch = groupedInsights[sistema]?.some(insight =>
        insight.Insight.toLowerCase().includes(termo)
      );
      return sistemaMatch || insightsMatch;
    });
  }, [searchTerm, stats.sistemas, groupedInsights]);

  if (loading) {
    return (
      <SidebarProvider defaultOpen={getInitialSidebarState()}>
        <AppSidebar />
        <SidebarInset>
          <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-black" : "bg-gray-100"}`}>
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>Carregando insights...</span>
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
                <span className="bg-gradient-to-r from-[#58FF0F] via-[#59FFFF] to-[#00FF00] bg-clip-text text-transparent">Insights</span> de Integração
              </h1>
              <p className={`text-sm sm:text-base md:text-lg ${theme === "dark" ? "text-foreground/60" : "text-gray-600"}`}>
                Explore as possibilidades de automação e integração para cada plataforma
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <Card className={`p-4 mb-8 border ${theme === "dark" ? "bg-red-950/20 border-red-900/50" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                  <div>
                    <p className={`font-semibold ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>Erro ao carregar insights</p>
                    <p className={`text-sm ${theme === "dark" ? "text-red-300/80" : "text-red-700/80"}`}>{error}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Busca */}
            <div className="mb-8 sm:mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por plataforma ou insight..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 !bg-transparent ${theme === "dark" ? "border-border/30" : "border-gray-200"}`}
                />
              </div>
            </div>

            {/* Insights por Sistema */}
            {sistemasFiltrados.length === 0 ? (
              <Card className={`p-8 text-center ${theme === "dark" ? "bg-card/50 border-border/30" : "bg-white border-gray-200"}`}>
                <p className="text-muted-foreground">Nenhum resultado encontrado para "{searchTerm}"</p>
              </Card>
            ) : (
              <div className="space-y-8">
                {sistemasFiltrados.map((sistema) => (
                  <div key={sistema}>
                    {/* Título do Sistema */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-1 h-8 rounded-full bg-gradient-to-b from-primary to-primary/50`}></div>
                        <h2 className={`text-2xl sm:text-3xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
                          {sistema}
                        </h2>
                        <Badge className="ml-auto">
                          {groupedInsights[sistema].length} {groupedInsights[sistema].length === 1 ? "insight" : "insights"}
                        </Badge>
                      </div>
                    </div>

                    {/* Grid de Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
                      {groupedInsights[sistema]
                        .sort((a, b) => a.row_number - b.row_number)
                        .map((insight) => (
                          <Card
                            key={insight.row_number}
                            className={`p-5 sm:p-6 border-l-4 transition-all duration-300 hover:shadow-lg ${
                              theme === "dark"
                                ? "bg-card/50 border-border/30 hover:bg-card/70 border-l-primary"
                                : "bg-white border-gray-200 hover:shadow-md border-l-primary"
                            }`}
                          >
                            {/* Número e Badge */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <p className="text-sm text-muted-foreground">
                                    {insight.tipo?.toLowerCase() === "agente" 
                                      ? "🤖 Agente de IA" 
                                      : insight.tipo?.toLowerCase() === "integração" 
                                      ? "🔗 Integração" 
                                      : `Possibilidade #${insight.row_number}`}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Indicador de Benefícios - Acima do texto */}
                            <div className="mb-4">
                              <p className="text-xs text-muted-foreground">
                                💡 {insight.Insight.split('—')[0].trim()}
                              </p>
                            </div>

                            {/* Conteúdo do Insight */}
                            <div className="mt-2">
                              <div className={`text-sm sm:text-base leading-relaxed ${theme === "dark" ? "text-foreground/90" : "text-gray-700"}`}>
                                {formatInsightText(insight.Insight.split('—')[1] ? insight.Insight.split('—')[1].trim() : insight.Insight)}
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>

                    {/* Divisor entre sistemas */}
                    <div className={`my-12 h-px ${theme === "dark" ? "bg-border/20" : "bg-gray-200"}`}></div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Insights;
