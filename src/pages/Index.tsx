import { useState, useRef, useEffect } from "react";
import { getInitialSidebarState } from "@/hooks/use-sidebar-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, ChevronDown } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useIntegrations } from "@/hooks/use-integrations";
import type { Integration } from "@/types/integration";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();
  const { integrations: systemsList, loading: integrationsLoading } = useIntegrations();

  useEffect(() => {
    console.log("🎯 Component loaded, systemsList:", systemsList);
  }, [systemsList]);

  useEffect(() => {
    console.log("🔵 selectedIntegration mudou para:", selectedIntegration);
    if (selectedIntegration) {
      const found = systemsList.find(s => s.id === selectedIntegration);
      console.log("🔍 Integration encontrada:", found);
      console.log("📝 Ações disponíveis:", found?.actions);
    }
  }, [selectedIntegration, systemsList]);

  // Auto-resize textarea quando inputMessage muda
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("https://n8n.jetsalesbrasil.com/webhook/chatdocs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Primeiro pega como texto
      const textData = await response.text();
      console.log("Resposta raw:", textData);

      let botText: string;

      // Tenta parsear como JSON
      try {
        const data = JSON.parse(textData);
        console.log("Parseado como JSON:", data);
        
        // Tenta múltiplos formatos de resposta
        botText = data.response || data.message || data.reply || data.text || data.output;
        
        // Se for um objeto aninhado, tenta acessar
        if (!botText && data.data) {
          botText = data.data.response || data.data.message || data.data.reply;
        }

        // Se ainda não encontrou, converte o objeto inteiro para string
        if (!botText) {
          botText = JSON.stringify(data, null, 2);
        }
      } catch (parseError) {
        // Se não for JSON, usa o texto direto
        console.log("Não é JSON, usando texto direto");
        botText = textData;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText || "Desculpe, não consegui processar sua mensagem.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro detalhado:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Erro: ${error instanceof Error ? error.message : "Ocorreu um erro ao processar sua mensagem."}`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedIntegration(null);
    }
  };

  return (
    <SidebarProvider defaultOpen={getInitialSidebarState()}>
      <AppSidebar />
      <SidebarInset>
        <div className={`min-h-screen flex flex-col relative overflow-hidden ${
          theme === "dark" 
            ? "bg-black" 
            : "bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100"
        }`}>
          {/* Fundo com efeito luminoso verde - cobre página inteira */}
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
          {/* Hero Section */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
            {messages.length === 0 ? (
              /* Initial State - sem mensagens */
              <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                  <h1 className={`text-5xl md:text-6xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
                    O que você deseja{" "}
                    <span className="bg-gradient-to-r from-[#58FF0F] via-[#59FFFF] to-[#00FF00] bg-clip-text text-transparent">
                      integrar
                    </span>{" "}
                    hoje?
                  </h1>
                  <p className={`text-xl ${theme === "dark" ? "text-foreground/60" : "text-gray-600"}`}>
                    Converse com o Glivan-bot e pergunte a ele sobre as possibilidades de integração.
                  </p>
                </div>

                {/* Input Area - Inicial */}
                <div className="w-full max-w-3xl">
                  <form onSubmit={sendMessage} className="relative">
                    <div className={`relative backdrop-blur-md rounded-2xl shadow-xl transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-card/50 border border-border/30 hover:border-primary/30"
                        : "bg-white border-2 border-gray-200 hover:border-[#58FF0F]/50 hover:shadow-[0_0_20px_rgba(88,255,15,0.2)]"
                    }`}>
                      <Input
                        type="text"
                        placeholder="Faça uma pergunta ao Glivan-bot..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        disabled={isLoading}
                        className={`w-full px-6 py-6 pr-14 text-lg bg-white text-black border-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                          theme === "dark" ? "placeholder:text-gray-400" : "placeholder:text-gray-400 text-black"
                        }`}
                      />
                      <Button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        size="icon"
                        className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg h-8 w-8 shadow-lg ${
                          theme === "dark"
                            ? "bg-primary hover:bg-primary/90 text-background"
                            : "bg-[#58FF0F] hover:bg-[#00FF00] text-black disabled:bg-gray-300"
                        } disabled:opacity-50`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* Chat State - com mensagens */
              <div className="w-full h-full flex flex-row gap-0 justify-center">
                {/* Chat Messages - Centralizado */}
                <div className="w-full max-w-2xl h-full flex flex-col">
                  {/* Messages Area */}
                  <div className={`${selectedIntegration ? 'flex-0' : 'flex-1'} overflow-y-auto space-y-6 mb-6 px-6`}>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[80%] rounded-xl px-4 py-2 ${
                            message.sender === "user"
                              ? theme === "dark"
                                ? "bg-primary text-background shadow-lg shadow-primary/20"
                                : "bg-[#58FF0F] text-black shadow-lg shadow-[#58FF0F]/30"
                              : theme === "dark"
                                ? "bg-white text-black shadow-lg shadow-white/20"
                                : "bg-white border-2 border-gray-200 text-black shadow-md"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                          <span className="text-xs opacity-60 mt-1 block">
                            {message.timestamp.toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start animate-fade-in">
                        <div className={`rounded-xl px-4 py-2 ${
                          theme === "dark"
                            ? "bg-white text-black shadow-lg shadow-white/20"
                            : "bg-white border-2 border-gray-200 shadow-md"
                        }`}>
                          <div className="flex items-center gap-2">
                            <Loader2 className={`w-4 h-4 animate-spin ${theme === "dark" ? "text-black" : "text-[#58FF0F]"}`} />
                            <span className={`text-xs ${theme === "dark" ? "text-black" : "text-gray-600"}`}>
                              Glivan-bot está pensando...
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Seção de Descrições da Integração Selecionada */}
                  {selectedIntegration && (
                    <div className="px-6 mb-4">
                      <div className={`rounded-2xl p-5 ${
                        theme === "dark"
                          ? "bg-card/50 border border-border/30"
                          : "bg-white border-2 border-gray-200"
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-bold text-foreground">
                            {systemsList.find(s => s.id === selectedIntegration)?.name || `ID: ${selectedIntegration}`}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setSelectedIntegration(null)}
                            className="text-sm px-3 py-1 rounded hover:bg-red-500/20 text-red-500 transition-colors"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Lista de Ações/Opções */}
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground font-semibold mb-3">Opções disponíveis:</p>
                          {systemsList.find(s => s.id === selectedIntegration)?.actions.map((action, idx) => {
                            const sistemaNome = systemsList.find(s => s.id === selectedIntegration)?.name || "";
                            const mensagemFormatada = `Gostaria de integrar a plataforma ${sistemaNome} para fazer "${action.name}" na plataforma da ${sistemaNome}, é possível fazer isso?`;
                            
                            return (
                            <button
                              key={action.id}
                              type="button"
                              onClick={() => {
                                setInputMessage(mensagemFormatada);
                                setSelectedIntegration(null);
                              }}
                              className={`w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                                theme === "dark"
                                  ? "border-primary/30 hover:border-primary/60 hover:bg-primary/10"
                                  : "border-[#58FF0F]/30 hover:border-[#58FF0F]/60 hover:bg-[#58FF0F]/5"
                              }`}
                            >
                              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                  {idx + 1}
                                </span>
                                {action.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {action.description || "Sem descrição"}
                              </p>
                            </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Input Area - Durante conversa */}
                  <div className="sticky bottom-0 pb-6 px-6 w-full" ref={dropdownRef}>
                    {/* Dropdown Menu - Aparece acima do input */}
                    {isDropdownOpen && !integrationsLoading && (
                      <div className="mb-3 bg-card border border-border/30 rounded-lg shadow-lg p-3 z-50">
                        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                          {systemsList.map((integration) => (
                            <button
                              key={integration.id}
                              type="button"
                              onClick={() => {
                                console.log("�️ Clicou em:", integration.id, integration.name);
                                setSelectedIntegration(integration.id);
                                setIsDropdownOpen(false);
                              }}
                              className="px-3 py-2 rounded-lg hover:bg-primary/20 text-xs font-semibold text-foreground transition-colors border border-primary/30 hover:border-primary/60 bg-background/50 truncate cursor-pointer"
                              title={integration.name}
                            >
                              {integration.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <form onSubmit={sendMessage} className="relative">
                      <div className={`relative backdrop-blur-md rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-3 p-3 ${
                        theme === "dark"
                          ? "bg-card/50 border border-border/30 hover:border-primary/30"
                          : "bg-white border-2 border-gray-200 hover:border-[#58FF0F]/50 hover:shadow-[0_0_20px_rgba(88,255,15,0.2)]"
                      }`}>
                        {/* Dropdown Button - Esquerda */}
                        <button
                          type="button"
                          onClick={() => {
                            console.log("🔽 Toggle dropdown, isDropdownOpen:", isDropdownOpen);
                            console.log("� systemsList disponível:", systemsList.length, "itens");
                            setIsDropdownOpen(!isDropdownOpen);
                          }}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                        >
                          <span className="text-sm font-semibold text-foreground">+</span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Input - Centro */}
                        <textarea
                          ref={textareaRef}
                          placeholder="Digite sua mensagem..."
                          value={inputMessage}
                          onChange={(e) => {
                            setInputMessage(e.target.value);
                            // Auto-resize
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                          }}
                          disabled={isLoading}
                          rows={1}
                          className={`flex-1 px-0 py-2 text-base bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none resize-none overflow-y-auto max-h-48 ${
                            theme === "dark" ? "placeholder:text-gray-400 text-white" : "text-black placeholder:text-gray-400"
                          }`}
                          style={{
                            fontFamily: 'inherit',
                            scrollbarWidth: 'thin',
                            scrollbarColor: theme === "dark" ? 'rgba(88, 255, 15, 0.3) transparent' : 'rgba(88, 255, 15, 0.2) transparent',
                            border: 'none',
                            outline: 'none',
                            boxShadow: 'none'
                          }}
                        />

                        {/* Botão Enviar - Direita */}
                        <Button
                          type="submit"
                          disabled={isLoading || !inputMessage.trim()}
                          size="icon"
                          className={`mr-1 rounded-lg h-8 w-8 shadow-lg flex-shrink-0 mt-1 ${
                            theme === "dark"
                              ? "bg-primary hover:bg-primary/90 text-background"
                              : "bg-[#58FF0F] hover:bg-[#00FF00] text-black disabled:bg-gray-300"
                          } disabled:opacity-50`}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Index;
