import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { KubectlInfo } from "@/types"
import type { ReactNode } from "react"

type InfoPanelProps = {
  info: KubectlInfo | null
}

export function InfoPanel({ info }: InfoPanelProps) {
  const ready = info?.ready && !info?.error

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Environment
        </CardTitle>
        <CardDescription>
          Kubectl and plugin diagnostics for this machine.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <InfoRow
          label="Status"
          value={
            <Badge
              variant="secondary"
              className={
                ready
                  ? "bg-emerald-500 text-white"
                  : "bg-amber-500 text-white"
              }
            >
              {ready ? "Ready" : "Needs attention"}
            </Badge>
          }
        />
        <InfoRow label="Kubectl Path" value={info?.kubectlPath || "Not found"} />
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
      </CardContent>
    </Card>
  )
}

type InfoRowProps = {
  label: string
  value: ReactNode
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-muted-foreground text-sm">{label}</p>
      <div className="text-sm font-medium">{value}</div>
    </div>
  )
}
