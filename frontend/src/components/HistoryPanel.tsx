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
import { Trash2 } from "lucide-react";

type HistoryPanelProps = {
  entries: HistoryEntry[];
  onReplay: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

export function HistoryPanel({
  entries,
  onReplay,
  onRemove,
  onClear,
}: HistoryPanelProps) {
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
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1.5">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            History
          </CardTitle>
          <CardDescription>
            Re-run recent port-forward and exec actions.
          </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear all
          </Button>
        </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry, index) => {
          const meta =
            entry.kind === "port-forward"
              ? `Ports ${entry.localPort}:${entry.remotePort}`
              : `Exec ${entry.container || "default"} • ${entry.command || "default shell"}`;
          const timestamp = new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(new Date(entry.createdAt));

          return (
            <div key={entry.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {entry.kind === "port-forward" ? "Port forward" : "Exec"}
                    </Badge>
                    <Badge className="bg-sky-700 text-white">
                      {entry.context}
                    </Badge>
                    <Badge className="bg-emerald-700 text-white">
                      {entry.namespace}
                    </Badge>
                    <Badge className="bg-amber-700 text-white">{entry.pod}</Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">{meta}</p>
                  <p className="text-muted-foreground text-xs">{timestamp}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(entry.id)}
                    aria-label="Remove history entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => onReplay(entry)}>Replay</Button>
                </div>
              </div>
              {index < entries.length - 1 ? <Separator /> : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
