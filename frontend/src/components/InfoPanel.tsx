import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { KubectlInfo } from "@/types";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type InfoPanelProps = {
  info: KubectlInfo | null;
  className?: string;
  contentClassName?: string;
  blockReason?: string;
};

export function InfoPanel({
  info,
  className,
  contentClassName,
  blockReason,
}: InfoPanelProps) {
  const ready = info?.ready && !info?.error;
  const [open, setOpen] = useState(false);

  return (
    <details
      className={cn("group rounded-xl border bg-card/80", className)}
      open={blockReason ? true : open}
      onToggle={(event) => {
        if (blockReason) {
          event.currentTarget.open = true;
          return;
        }
        setOpen(event.currentTarget.open);
      }}
    >
      <summary
        className={cn(
          "flex list-none items-center justify-between gap-4 px-6 py-5",
          blockReason ? "cursor-default" : "cursor-pointer",
        )}
        onClick={(event) => {
          if (blockReason) {
            event.preventDefault();
          }
        }}
      >
        <div className="space-y-1">
          <p className="text-muted-foreground text-2xl font-semibold uppercase tracking-[0.35em]">Kebac</p>
        </div>
        {!blockReason ? (
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
        ) : null}
      </summary>
      <div className={cn("grid gap-4 px-6 pb-6", contentClassName)}>
        {blockReason ? (
          <Alert variant="destructive" className="shadow-sm">
            <AlertTitle>Environment issue</AlertTitle>
            <AlertDescription>{blockReason}</AlertDescription>
          </Alert>
        ) : null}
        <InfoRow
          label="Status"
          value={
            <Badge
              variant="secondary"
              className={
                ready ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
              }
            >
              {ready ? "Ready" : "Needs attention"}
            </Badge>
          }
        />
        <InfoRow
          label="Kubectl Path"
          value={info?.kubectlPath || "Not found"}
        />
        <InfoRow
          label="Kubectl Version"
          value={info?.kubectlVersion || "Unknown"}
        />
        <InfoRow
          label="Kubeconfig"
          value={info?.kubeconfigPath || "Not found"}
        />
        <InfoRow
          label="OIDC Login Plugin"
          value={info?.kubeloginPath || "Not detected"}
        />
      </div>
    </details>
  );
}

type InfoRowProps = {
  label: string;
  value: ReactNode;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-muted-foreground text-sm">{label}</p>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
