import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ResourceSelect } from "@/components/ResourceSelect"
import { SearchableSelect } from "@/components/SearchableSelect"

type SelectionPanelProps = {
  contexts: string[]
  namespaces: string[]
  pods: string[]
  containers: string[]
  selectedContext: string
  selectedNamespace: string
  selectedPod: string
  selectedContainer: string
  onContextChange: (value: string) => void
  onNamespaceChange: (value: string) => void
  onPodChange: (value: string) => void
  onContainerChange: (value: string) => void
  loading?: {
    contexts?: boolean
    namespaces?: boolean
    pods?: boolean
    containers?: boolean
  }
  disabled?: boolean
}

export function SelectionPanel({
  contexts,
  namespaces,
  pods,
  containers,
  selectedContext,
  selectedNamespace,
  selectedPod,
  selectedContainer,
  onContextChange,
  onNamespaceChange,
  onPodChange,
  onContainerChange,
  loading,
  disabled,
}: SelectionPanelProps) {
  return (
    <Card className="bg-card/80">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Cluster selection
          </CardTitle>
          <Badge variant="secondary">
            {contexts.length} contexts
          </Badge>
        </div>
        <CardDescription>
          Choose context, namespace, pod, and container.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <ResourceSelect
          label="Context"
          placeholder={loading?.contexts ? "Loading contexts..." : "Select context"}
          value={selectedContext}
          options={contexts}
          onChange={onContextChange}
          disabled={disabled}
        />
        <SearchableSelect
          label="Namespace"
          placeholder={loading?.namespaces ? "Loading namespaces..." : "Select namespace"}
          value={selectedNamespace}
          options={namespaces}
          onChange={onNamespaceChange}
          disabled={disabled || !selectedContext}
          hint={selectedContext ? "Active namespaces only." : "Select a context first."}
        />
        <SearchableSelect
          label="Pod"
          placeholder={loading?.pods ? "Loading pods..." : "Select pod"}
          value={selectedPod}
          options={pods}
          onChange={onPodChange}
          disabled={disabled || !selectedNamespace}
          hint={selectedNamespace ? "Pods in the selected namespace." : "Select a namespace first."}
        />
        <ResourceSelect
          label="Container"
          placeholder={loading?.containers ? "Loading containers..." : "Select container"}
          value={selectedContainer}
          options={containers}
          onChange={onContainerChange}
          disabled={disabled || !selectedPod}
          hint={selectedPod ? "Containers for the selected pod." : "Select a pod first."}
        />
      </CardContent>
    </Card>
  )
}
