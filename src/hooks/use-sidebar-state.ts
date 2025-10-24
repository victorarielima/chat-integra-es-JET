import { useEffect } from "react";

const SIDEBAR_STATE_KEY = "sidebar:state";

export function getInitialSidebarState(): boolean {
  // Retorna true (aberto) se não houver estado salvo ou se estiver salvo como "expanded"
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

