import { useEffect } from "react";

const SIDEBAR_STATE_KEY = "sidebar:state";

export function getInitialSidebarState(): boolean {
  // Se estiver em mobile (window.innerWidth < 768), começa fechada
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return false; // Começa fechada em mobile
  }
  
  // Para desktop, retorna o estado salvo ou aberto por padrão
  const savedState = typeof window !== "undefined" 
    ? localStorage.getItem(SIDEBAR_STATE_KEY) 
    : null;
  return savedState !== "collapsed";
}

export function useSavesSidebarState(state: "expanded" | "collapsed") {
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, state);
  }, [state]);
}

