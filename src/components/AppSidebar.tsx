import { MessageSquare, Workflow, Lightbulb, X, Menu, Moon, Sun, HelpCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useSavesSidebarState } from "@/hooks/use-sidebar-state";
import { useIsMobile } from "@/hooks/use-mobile";
import logo from "@/assets/jetsales-logo.png";
import logoReduzida from "@/assets/logo-reduzida.png";
import logoPreta from "@/assets/jetsales-logo-preta.png";
import logoReduzidaPreta from "@/assets/logo-reduzida-preta.png";

const menuItems = [
  {
    title: "Chat",
    icon: MessageSquare,
    url: "/",
  },
  {
    title: "Integrações",
    icon: Workflow,
    url: "/integracoes",
  },
  {
    title: "Insights",
    icon: Lightbulb,
    url: "/insights",
  },
  {
    title: "Ajuda",
    icon: HelpCircle,
    url: "/guia",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, toggleSidebar, setOpenMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  useSavesSidebarState(state); // Salva o estado no localStorage
  const isExpanded = state === "expanded";

  return (
    <Sidebar 
      collapsible="icon" 
      side="left" 
      data-state={isExpanded ? "expanded" : "collapsed"}
      className={isMobile ? "md:hidden" : ""}
    >
      {/* LOGO - Primeiro Item */}
      <SidebarHeader className="border-b border-border/20 pb-4">
        <div className="flex items-center justify-center px-2 py-2 relative">
          <div className={`flex items-center justify-center ${
            isExpanded && !isMobile ? (theme === "light" ? "h-12 w-32" : "h-12 w-48") : "h-12 w-12"
          }`}>
            <img
              src={isMobile 
                ? (theme === "light" ? logoReduzidaPreta : logoReduzida)
                : (isExpanded 
                  ? (theme === "light" ? logoPreta : logo)
                  : (theme === "light" ? logoReduzidaPreta : logoReduzida)
                )
              }
              alt="JetSales Brasil"
              className="transition-all duration-300 h-full w-full object-contain"
            />
          </div>
          
          {/* Botão X para recolher (apenas no modo expandido e desktop) */}
          {isExpanded && !isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="absolute right-2 transition-all duration-300 hover:bg-primary/10"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      {/* MENU SANDUÍCHE - Segundo Item (somente no modo reduzido e desktop) */}
      {!isExpanded && !isMobile && (
        <SidebarGroup className="border-b border-border/20">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Expandir"
                  onClick={toggleSidebar}
                  className="transition-all duration-200 cursor-pointer hover:bg-accent/10"
                >
                  <Menu className="h-5 w-5" />
                  <span>Menu</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {/* MENU ITEMS - Chat, Integrações, Insights */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                // Verifica se está na rota ativa ou em subrotas
                let isActive = false;
                if (item.url === "/") {
                  isActive = location.pathname === "/";
                } else if (item.url === "/integracoes") {
                  // Ativa para /integracoes e /integration/:id (página de detalhes)
                  isActive = location.pathname === "/integracoes" || location.pathname.startsWith("/integration/");
                } else {
                  isActive = location.pathname === item.url;
                }
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      onClick={() => {
                        navigate(item.url);
                        // Fecha o menu mobile após clicar
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                      className={`
                        transition-all duration-200 cursor-pointer
                        ${isActive 
                          ? "bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary" 
                          : "hover:bg-primary/20 hover:text-primary"
                        }
                      `}
                    >
                      <item.icon className={isActive ? "text-primary font-semibold" : ""} />
                      <span className={isActive ? "font-semibold" : ""}>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* BOTÃO TEMA - Último Item */}
      <SidebarFooter className="border-t border-border/20 pt-4 pb-4 px-2">
        {/* Botão de tema em formato de ícone em quadrado */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={`w-full h-12 rounded-lg transition-all duration-300 flex items-center justify-center ${
              theme === "light"
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "bg-primary/20 text-primary hover:bg-primary/30"
            }`}
            title={`Mudar para modo ${theme === "light" ? "escuro" : "claro"}`}
          >
            {theme === "light" ? (
              <Moon className="h-6 w-6" />
            ) : (
              <Sun className="h-6 w-6" />
            )}
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
