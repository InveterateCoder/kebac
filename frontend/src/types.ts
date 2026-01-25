export type KubectlInfo = {
  kubectlPath: string
  kubeloginPath: string
  kubectlVersion: string
  kubeconfigPath: string
  error: string
  ready: boolean
}

export type HistoryEntry = {
  id: string
  kind: "port-forward" | "exec"
  context: string
  namespace: string
  pod: string
  container?: string
  localPort?: number
  remotePort?: number
  command?: string
  createdAt: string
}
