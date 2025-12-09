import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronRight, Code2 } from "lucide-react";
import { Integration } from "@/types/integration";

interface IntegrationCardProps {
  integration: Integration;
  compact?: boolean;
}

export const IntegrationCard = ({ integration, compact = false }: IntegrationCardProps) => {
  return (
    <Link to={`/integration/${integration.id}`}>
      {compact ? (
        // Versão ultra compacta - apenas nome
        <div className="group relative overflow-hidden rounded-lg bg-gradient-card backdrop-blur-sm transition-all duration-300 hover:shadow-md cursor-pointer border border-primary/30 px-3 py-2 min-h-max flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          <h3 className="relative text-xs font-semibold text-foreground line-clamp-1 whitespace-nowrap text-center">
            {integration.name}
          </h3>
        </div>
      ) : (
        // Versão normal
        <Card className="group relative overflow-hidden border-primary/30 bg-gradient-card backdrop-blur-sm transition-all duration-300 hover:shadow-glow-primary cursor-pointer h-full flex flex-col">
          <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
          
          <div className="relative p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground transition-colors">
                  {integration.name}
                </h3>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              {integration.description || "Plataforma de integração"}
            </p>

            {/* Footer Stats */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/30">
              <Code2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {integration.actions.length} {integration.actions.length === 1 ? 'ação' : 'ações'} disponíveis
              </span>
            </div>
          </div>
        </Card>
      )}
    </Link>
  );
};
