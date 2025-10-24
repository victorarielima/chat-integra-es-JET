import { MessageSquare, Workflow, Lightbulb, X, Menu, Moon, Sun } from "lucide-react";
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
                const isActive = location.pathname === item.url;
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
                          : "hover:bg-accent/20"
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
      <SidebarFooter className="border-t border-border/20 pt-4 pb-4">
        {/* Mostrar toggle apenas no desktop */}
        {isExpanded && !isMobile ? (
          // Slider/Toggle no modo expandido
          <div className="flex flex-col gap-2 px-2">
            <div className="flex items-center justify-center gap-1.5">
              <Sun className={`h-4 w-4 ${theme === "light" ? "text-orange-500 font-bold" : "text-gray-500"}`} />
              
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 overflow-hidden ${
                  theme === "light"
                    ? "bg-gradient-to-b from-sky-500 to-sky-400"
                    : "bg-gradient-to-b from-slate-900 to-slate-800"
                }`}
              >
                {/* Nuvens (modo claro) */}
                {theme === "light" && (
                  <>
                    <div className="absolute top-0.5 left-1.5 w-2 h-1 bg-white rounded-full opacity-70"></div>
                    <div className="absolute top-1 right-1.5 w-1.5 h-0.5 bg-white rounded-full opacity-60"></div>
                  </>
                )}
                
                {/* Estrelas (modo escuro) */}
                {theme === "dark" && (
                  <>
                    <div className="absolute top-0.5 left-1.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                    <div className="absolute top-1.5 left-4 w-0.5 h-0.5 bg-white rounded-full"></div>
                    <div className="absolute top-1 right-1.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                    <div className="absolute top-3 right-2.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                    <div className="absolute top-1.5 left-2.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                  </>
                )}
                
                {/* Toggle Circle */}
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                    theme === "light" ? "left-0.5" : "right-0.5"
                  }`}
                />
              </button>
              
              <Moon className={`h-4 w-4 ${theme === "dark" ? "text-indigo-300 font-bold" : "text-gray-500"}`} />
            </div>
          </div>
        ) : !isMobile ? (
          // Ícone no modo reduzido (desktop)
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={`w-full transition-all duration-300 ${
              theme === "light"
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
