import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import logoReduzida from "@/assets/logo-reduzida.png";
import logoReduzidaPreta from "@/assets/logo-reduzida-preta.png";

export function MobileHeader() {
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const { theme } = useTheme();
  const isVisible = useScrollDirection();

  if (!isMobile) return null;

  return (
    <div 
      className={`md:hidden fixed top-0 left-0 right-0 h-12 bg-background/95 backdrop-blur-sm border-b border-border/20 flex items-center px-3 z-40 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <button
        onClick={() => setOpenMobile(true)}
        className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
      >
        <img
          src={theme === "light" ? logoReduzidaPreta : logoReduzida}
          alt="Menu"
          className="w-full h-full object-contain"
        />
      </button>
    </div>
  );
}
