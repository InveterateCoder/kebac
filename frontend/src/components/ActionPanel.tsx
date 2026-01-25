import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type ActionPanelProps = {
  context: string
  namespace: string
  pod: string
  container: string
  localPort: string
  remotePort: string
  execCommand: string
  onLocalPortChange: (value: string) => void
  onRemotePortChange: (value: string) => void
  onExecCommandChange: (value: string) => void
  onPortForward: () => void
  onExec: () => void
  busy?: {
    portForward?: boolean
    exec?: boolean
  }
  disabled?: boolean
}

export function ActionPanel({
  context,
  namespace,
  pod,
  container,
  localPort,
  remotePort,
  execCommand,
  onLocalPortChange,
  onRemotePortChange,
  onExecCommandChange,
  onPortForward,
  onExec,
  busy,
  disabled,
}: ActionPanelProps) {
  const hasSelection = Boolean(context && namespace && pod)
  const canExec = hasSelection && Boolean(container)

  const portPreview = hasSelection
    ? `kubectl port-forward pod/${pod} ${localPort || "LOCAL"}:${remotePort || "REMOTE"} --context ${context} --namespace ${namespace}`
    : "Select a context, namespace, and pod."

  const execPreview = canExec
    ? `kubectl exec -it pod/${pod} -c ${container} --context ${context} --namespace ${namespace} -- ${execCommand || "sh"}`
    : "Select a context, namespace, pod, and container."

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Actions
        </CardTitle>
        <CardDescription>
          Launch port forwarding or exec in your default terminal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold tracking-tight">Port forward</h3>
            <Badge
              variant={hasSelection ? "secondary" : "outline"}
              className={hasSelection ? "bg-emerald-500 text-white" : undefined}
            >
              {hasSelection ? "Ready" : "Needs selection"}
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Local port</Label>
              <Input
                value={localPort}
                onChange={(event) => onLocalPortChange(event.target.value)}
                placeholder="8080"
                inputMode="numeric"
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label>Remote port</Label>
              <Input
                value={remotePort}
                onChange={(event) => onRemotePortChange(event.target.value)}
                placeholder="80"
                inputMode="numeric"
                disabled={disabled}
              />
            </div>
          </div>
          <p className="text-muted-foreground text-xs">{portPreview}</p>
          <Button
            onClick={onPortForward}
            disabled={disabled || !hasSelection || busy?.portForward}
          >
            {busy?.portForward ? "Launching..." : "Open port forward"}
          </Button>
        </section>

        <Separator />

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold tracking-tight">Execute</h3>
            <Badge
              variant={canExec ? "secondary" : "outline"}
              className={canExec ? "bg-emerald-500 text-white" : undefined}
            >
              {canExec ? "Ready" : "Needs container"}
            </Badge>
          </div>
          <div className="space-y-2">
            <Label>Command</Label>
            <Input
              value={execCommand}
              onChange={(event) => onExecCommandChange(event.target.value)}
              placeholder="sh"
              disabled={disabled}
            />
            <p className="text-muted-foreground text-xs">
              Leave blank to default to <span className="font-semibold">sh</span>.
            </p>
          </div>
          <p className="text-muted-foreground text-xs">{execPreview}</p>
          <Button onClick={onExec} disabled={disabled || !canExec || busy?.exec}>
            {busy?.exec ? "Launching..." : "Open exec terminal"}
          </Button>
        </section>
      </CardContent>
    </Card>
  )
}
