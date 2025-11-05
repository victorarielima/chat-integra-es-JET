import { useState, useRef, useEffect } from "react";
import { getInitialSidebarState } from "@/hooks/use-sidebar-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, ChevronDown } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileHeader } from "@/components/MobileHeader";
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
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();
  const { integrations: systemsList, loading: integrationsLoading } = useIntegrations();

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

  const handleOpenIntegrationDropdown = () => {
    // Adiciona uma mensagem vazia para entrar no modo chat
    if (messages.length === 0) {
      setMessages([{
        id: Date.now().toString(),
        text: "Selecione uma integração para começar",
        sender: "bot",
        timestamp: new Date(),
      }]);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSendWithType = (type: "integração" | "agente de ia") => {
    const sistemaNome = systemsList.find(s => s.id === selectedIntegration)?.name || "";
    const actionsNames = selectedActions
      .map(actionId => {
        const integration = systemsList.find(s => s.id === selectedIntegration);
        return integration?.actions.find(a => a.id === actionId)?.name || "";
      })
      .filter(Boolean);

    const actionsFormatted = actionsNames.length > 1
      ? actionsNames.slice(0, -1).join(", ") + " e " + actionsNames[actionsNames.length - 1]
      : actionsNames[0] || "";

    const mensagemFormatada = `Gostaria de fazer uma ${type} na plataforma da Jetsales para ${actionsFormatted} na plataforma ${sistemaNome}, é possível fazer isso?`;
    
    // Limpar estados
    setSelectedIntegration(null);
    setSelectedActions([]);
    setShowTypeSelection(false);

    // Enviar a mensagem (isso vai entrar no modo de chat automaticamente)
    sendMessage({ preventDefault: () => {} } as React.FormEvent, mensagemFormatada);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fechar dropdown e voltar ao estado inicial ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Se não há mensagens de usuário, volta ao estado inicial
        const hasUserMessages = messages.some(m => m.sender === "user");
        if (!hasUserMessages) {
          setMessages([]);
          setSelectedIntegration(null);
          setSelectedActions([]);
          setShowTypeSelection(false);
        }
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen, messages]);

  const sendMessage = async (e: React.FormEvent, customMessage?: string) => {
    e.preventDefault();
    const messageToSend = customMessage || inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
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
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Primeiro pega como texto
      const textData = await response.text();

      let botText: string;

      // Tenta parsear como JSON
      try {
        const data = JSON.parse(textData);
        
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
          <MobileHeader />
          
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
          <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-6 py-12 md:py-12 md:pt-12 pt-16 relative z-10">
            {messages.length === 0 ? (
              /* Initial State - sem mensagens */
              <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                  <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
                    O que você deseja{" "}
                    <span className="bg-gradient-to-r from-[#58FF0F] via-[#59FFFF] to-[#00FF00] bg-clip-text text-transparent">
                      integrar
                    </span>{" "}
                    hoje?
                  </h1>
                  <p className={`text-sm sm:text-base md:text-lg ${theme === "dark" ? "text-foreground/60" : "text-gray-600"}`}>
                    Converse com o Glivan-bot e pergunte a ele sobre as possibilidades de integração.
                  </p>
                </div>

                {/* Input Area - Inicial */}
                <div className="w-full max-w-3xl px-3 sm:px-6">
                  {/* Seleção de Integração Inicial */}
                  {selectedIntegration && (
                    <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-4 ${
                      theme === "dark"
                        ? "bg-card/50 border border-border/30"
                        : "bg-white border-2 border-gray-200"
                    }`}>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-sm sm:text-base font-bold text-foreground truncate pr-2">
                          {systemsList.find(s => s.id === selectedIntegration)?.name || `ID: ${selectedIntegration}`}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIntegration(null);
                            setSelectedActions([]);
                            setShowTypeSelection(false);
                          }}
                          className="text-sm px-2 sm:px-3 py-1 rounded hover:bg-red-500/20 text-red-500 transition-colors flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Lista de Ações/Opções */}
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-semibold mb-2 sm:mb-3">Selecione até 3 opções:</p>
                        {systemsList.find(s => s.id === selectedIntegration)?.actions.map((action, idx) => {
                          const isSelected = selectedActions.includes(action.id);
                          const canSelect = selectedActions.length < 3 || isSelected;
                          
                          return (
                          <button
                            key={action.id}
                            type="button"
                            onClick={() => {
                              if (canSelect) {
                                if (isSelected) {
                                  setSelectedActions(prev => prev.filter(id => id !== action.id));
                                } else {
                                  setSelectedActions(prev => [...prev, action.id]);
                                }
                              }
                            }}
                            className={`w-full text-left p-2 sm:p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                              isSelected
                                ? theme === "dark"
                                  ? "border-primary bg-primary/20"
                                  : "border-[#58FF0F] bg-[#58FF0F]/10"
                                : !canSelect
                                  ? "opacity-50 cursor-not-allowed"
                                  : theme === "dark"
                                    ? "border-primary/30 hover:border-primary/60 hover:bg-primary/10"
                                    : "border-[#58FF0F]/30 hover:border-[#58FF0F]/60 hover:bg-[#58FF0F]/5"
                            }`}
                          >
                            <p className="text-xs sm:text-sm font-semibold text-foreground">
                              <span className="truncate">{action.name}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {action.description || "Sem descrição"}
                            </p>
                          </button>
                          );
                        })}
                      </div>

                      {/* Botão Enviar Seleção */}
                      {selectedActions.length > 0 && !showTypeSelection && (
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => setShowTypeSelection(true)}
                            className={`w-auto px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg font-semibold transition-all text-sm mt-3 ${
                              theme === "dark"
                                ? "bg-primary hover:bg-primary/90 text-background"
                                : "bg-[#58FF0F] hover:bg-[#00FF00] text-black"
                            }`}
                          >
                            Enviar Seleção
                          </button>
                        </div>
                      )}

                      {/* Seleção de Tipo (Integração ou Agente de IA) */}
                      {showTypeSelection && (
                        <div className="mt-4 pt-4 border-t border-border/20">
                          <p className="text-xs text-muted-foreground font-semibold mb-3">O que você deseja criar?</p>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <button
                              type="button"
                              onClick={() => handleSendWithType("integração")}
                              className={`p-2 sm:p-3 rounded-lg border-2 font-semibold transition-all ${
                                theme === "dark"
                                  ? "border-primary/30 hover:border-primary/60 hover:bg-primary/10 text-foreground"
                                  : "border-[#58FF0F]/30 hover:border-[#58FF0F]/60 hover:bg-[#58FF0F]/5 text-black"
                              }`}
                            >
                              Integração
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendWithType("agente de ia")}
                              className={`p-2 sm:p-3 rounded-lg border-2 font-semibold transition-all ${
                                theme === "dark"
                                  ? "border-primary/30 hover:border-primary/60 hover:bg-primary/10 text-foreground"
                                  : "border-[#58FF0F]/30 hover:border-[#58FF0F]/60 hover:bg-[#58FF0F]/5 text-black"
                              }`}
                            >
                              Agente de IA
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setShowTypeSelection(false);
                            }}
                            className={`w-full p-2 sm:p-3 rounded-lg border-2 font-semibold transition-all ${
                              theme === "dark"
                                ? "border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 text-red-500"
                                : "border-red-500/30 hover:border-red-500/60 hover:bg-red-500/5 text-red-500"
                            }`}
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dropdown Menu - Aparece acima do input */}
                  {isDropdownOpen && !integrationsLoading && (
                    <div className="mb-3 !bg-transparent border border-border/30 rounded-lg shadow-lg p-2 sm:p-3 z-30 max-h-40 overflow-y-auto">
                      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
                        {systemsList.map((integration) => (
                          <button
                            key={integration.id}
                            type="button"
                            onClick={() => {
                              setSelectedIntegration(integration.id);
                              setIsDropdownOpen(false);
                            }}
                            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-primary/20 text-xs font-semibold text-foreground transition-colors border border-primary/30 hover:border-primary/60 bg-background/50 truncate cursor-pointer"
                            title={integration.name}
                          >
                            {integration.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={sendMessage} className="relative">
                    <div className={`relative backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 p-2 sm:p-3 ${
                      theme === "dark"
                        ? "bg-transparent border border-border/30 hover:border-primary/30"
                        : "bg-transparent border-2 border-gray-200 hover:border-[#58FF0F]/50 hover:shadow-[0_0_20px_rgba(88,255,15,0.2)]"
                    }`}>
                      {/* Dropdown Button - Esquerda */}
                      <button
                        type="button"
                        onClick={handleOpenIntegrationDropdown}
                        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-foreground">+</span>
                        <ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Input - Centro */}
                      <textarea
                        ref={textareaRef}
                        placeholder="Mensagem..."
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
                        className={`mr-0.5 sm:mr-1 rounded-lg h-7 w-7 sm:h-8 sm:w-8 shadow-lg flex-shrink-0 mt-0.5 sm:mt-1 ${
                          theme === "dark"
                            ? "bg-primary hover:bg-primary/90 text-background"
                            : "bg-[#58FF0F] hover:bg-[#00FF00] text-black disabled:bg-gray-300"
                        } disabled:opacity-50`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3 sm:w-4 sm:h-4" />
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
                  <div className={`${selectedIntegration ? 'flex-0' : 'flex-1'} overflow-y-auto space-y-4 sm:space-y-6 mb-4 sm:mb-6 px-3 sm:px-6`}>
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
                    <div className="px-3 sm:px-6 mb-4">
                      <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 ${
                        theme === "dark"
                          ? "bg-card/50 border border-border/30"
                          : "bg-white border-2 border-gray-200"
                      }`}>
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <h3 className="text-sm sm:text-base font-bold text-foreground truncate pr-2">
                            {systemsList.find(s => s.id === selectedIntegration)?.name || `ID: ${selectedIntegration}`}
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedIntegration(null);
                              setSelectedActions([]);
                              setShowTypeSelection(false);
                            }}
                            className="text-sm px-2 sm:px-3 py-1 rounded hover:bg-red-500/20 text-red-500 transition-colors flex-shrink-0"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Lista de Ações/Opções */}
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground font-semibold mb-2 sm:mb-3">Selecione até 3 opções:</p>
                          {systemsList.find(s => s.id === selectedIntegration)?.actions.map((action, idx) => {
                            const isSelected = selectedActions.includes(action.id);
                            const canSelect = selectedActions.length < 3 || isSelected;
                            
                            return (
                            <button
                              key={action.id}
                              type="button"
                              onClick={() => {
                                if (canSelect) {
                                  if (isSelected) {
                                    setSelectedActions(prev => prev.filter(id => id !== action.id));
                                  } else {
                                    setSelectedActions(prev => [...prev, action.id]);
                                  }
                                }
                              }}
                              className={`w-full text-left p-2 sm:p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                                isSelected
                                  ? theme === "dark"
                                    ? "border-primary bg-primary/20"
                                    : "border-[#58FF0F] bg-[#58FF0F]/10"
                                  : !canSelect
                                    ? "opacity-50 cursor-not-allowed"
                                    : theme === "dark"
                                      ? "border-primary/30 hover:border-primary/60 hover:bg-primary/10"
                                      : "border-[#58FF0F]/30 hover:border-[#58FF0F]/60 hover:bg-[#58FF0F]/5"
                              }`}
                            >
                              <p className="text-xs sm:text-sm font-semibold text-foreground">
                                <span className="truncate">{action.name}</span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {action.description || "Sem descrição"}
                              </p>
                            </button>
                            );
                          })}
                        </div>

                        {/* Botão Enviar Seleção */}
                        {selectedActions.length > 0 && !showTypeSelection && (
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={() => setShowTypeSelection(true)}
                              className={`w-auto px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg font-semibold transition-all text-sm mt-3 ${
                                theme === "dark"
                                  ? "bg-primary hover:bg-primary/90 text-background"
                                  : "bg-[#58FF0F] hover:bg-[#00FF00] text-black"
                              }`}
                            >
                              Enviar Seleção
                            </button>
                          </div>
                        )}

                        {/* Seleção de Tipo (Integração ou Agente de IA) */}
                        {showTypeSelection && (
                          <div className="mt-4 pt-4 border-t border-border/20">
                            <p className="text-xs text-muted-foreground font-semibold mb-3">O que você deseja criar?</p>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <button
                                type="button"
                                onClick={() => handleSendWithType("integração")}
                                className={`p-2 sm:p-3 rounded-lg border-2 font-semibold transition-all ${
                                  theme === "dark"
                                    ? "border-primary/30 hover:border-primary/60 hover:bg-primary/10 text-foreground"
                                    : "border-[#58FF0F]/30 hover:border-[#58FF0F]/60 hover:bg-[#58FF0F]/5 text-black"
                                }`}
                              >
                                Integração
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSendWithType("agente de ia")}
                                className={`p-2 sm:p-3 rounded-lg border-2 font-semibold transition-all ${
                                  theme === "dark"
                                    ? "border-primary/30 hover:border-primary/60 hover:bg-primary/10 text-foreground"
                                    : "border-[#58FF0F]/30 hover:border-[#58FF0F]/60 hover:bg-[#58FF0F]/5 text-black"
                                }`}
                              >
                                Agente de IA
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowTypeSelection(false);
                              }}
                              className={`w-full p-2 sm:p-3 rounded-lg border-2 font-semibold transition-all ${
                                theme === "dark"
                                  ? "border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 text-red-500"
                                  : "border-red-500/30 hover:border-red-500/60 hover:bg-red-500/5 text-red-500"
                              }`}
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Input Area - Durante conversa */}
                  <div className="sticky bottom-0 pb-4 sm:pb-6 px-3 sm:px-6 w-full" ref={dropdownRef}>
                    {/* Dropdown Menu - Aparece acima do input */}
                    {isDropdownOpen && !integrationsLoading && (
                      <div className="mb-3 !bg-transparent border border-border/30 rounded-lg shadow-lg p-2 sm:p-3 z-30 max-h-40 overflow-y-auto">
                        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
                          {systemsList.map((integration) => (
                            <button
                              key={integration.id}
                              type="button"
                              onClick={() => {
                                setSelectedIntegration(integration.id);
                                setIsDropdownOpen(false);
                              }}
                              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-primary/20 text-xs font-semibold text-foreground transition-colors border border-primary/30 hover:border-primary/60 bg-background/50 truncate cursor-pointer"
                              title={integration.name}
                            >
                              {integration.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <form onSubmit={sendMessage} className="relative">
                      <div className={`relative backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 p-2 sm:p-3 ${
                        theme === "dark"
                          ? "bg-transparent border border-border/30 hover:border-primary/30"
                          : "bg-transparent border-2 border-gray-200 hover:border-[#58FF0F]/50 hover:shadow-[0_0_20px_rgba(88,255,15,0.2)]"
                      }`}>
                        {/* Dropdown Button - Esquerda */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(!isDropdownOpen);
                          }}
                          className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                        >
                          <span className="text-xs sm:text-sm font-semibold text-foreground">+</span>
                          <ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Input - Centro */}
                        <textarea
                          ref={textareaRef}
                          placeholder="Mensagem..."
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
                          className={`mr-0.5 sm:mr-1 rounded-lg h-7 w-7 sm:h-8 sm:w-8 shadow-lg flex-shrink-0 mt-0.5 sm:mt-1 ${
                            theme === "dark"
                              ? "bg-primary hover:bg-primary/90 text-background"
                              : "bg-[#58FF0F] hover:bg-[#00FF00] text-black disabled:bg-gray-300"
                          } disabled:opacity-50`}
                        >
                          {isLoading ? (
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                          ) : (
                            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
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
