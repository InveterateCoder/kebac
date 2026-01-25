import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { HistoryEntry } from "@/types";

type HistoryPanelProps = {
  entries: HistoryEntry[];
  onReplay: (entry: HistoryEntry) => void;
};

export function HistoryPanel({ entries, onReplay }: HistoryPanelProps) {
  if (entries.length === 0) {
    return (
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            History
          </CardTitle>
          <CardDescription>
            Re-run recent port-forward and exec actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          No history yet. Run a port-forward or exec to capture it here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          History
        </CardTitle>
        <CardDescription>
          Re-run recent port-forward and exec actions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry, index) => {
          const meta =
            entry.kind === "port-forward"
              ? `Ports ${entry.localPort}:${entry.remotePort}`
              : `Exec ${entry.container || "default"} • ${entry.command || "default shell"}`;
          const scope = `${entry.context} • ${entry.namespace} • ${entry.pod}`;
          const timestamp = new Date(entry.createdAt).toLocaleString();

          return (
            <div key={entry.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {entry.kind === "port-forward" ? "Port forward" : "Exec"}
                    </Badge>
                    <span className="text-sm font-medium">{scope}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">{meta}</p>
                  <p className="text-muted-foreground text-xs">{timestamp}</p>
                </div>
                <Button onClick={() => onReplay(entry)}>Replay</Button>
              </div>
              {index < entries.length - 1 ? <Separator /> : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
