import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IntegrationAction } from "@/types/integration";
import { Code2, Lock, Info } from "lucide-react";

interface ActionCardProps {
  action: IntegrationAction;
}

const getMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    GET: "bg-secondary/20 text-secondary border-secondary/30",
    POST: "bg-primary/20 text-primary border-primary/30",
    PUT: "bg-secondary/20 text-secondary border-secondary/30",
    PATCH: "bg-primary/20 text-primary border-primary/30",
    DELETE: "bg-destructive/20 text-destructive border-destructive/30",
  };
  return colors[method] || "bg-muted/20 text-muted-foreground border-muted/30";
};

export const ActionCard = ({ action }: ActionCardProps) => {
  return (
    <Card className="border-border/50 bg-gradient-card backdrop-blur-sm hover:border-primary/30 transition-all duration-300 animate-fade-in">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {action.name}
            </h3>
            <Badge className={`${getMethodColor(action.method)} border`}>
              {action.method}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Code2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Endpoint</p>
              <code className="text-xs bg-muted/50 p-2 rounded block overflow-x-auto text-foreground/90">
                {action.endpoint}
              </code>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Autenticação</p>
              <p className="text-sm text-foreground/90">{action.authentication}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Descrição</p>
              <p className="text-sm text-foreground/90">{action.description}</p>
            </div>
          </div>

          {action.observations && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">📝 Observações</p>
              <p className="text-sm text-foreground/80">{action.observations}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
