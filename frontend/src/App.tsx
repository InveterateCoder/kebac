import { useEffect, useMemo, useState } from "react";
import {
  GetKubectlInfo,
  ListContainers,
  ListContexts,
  ListNamespaces,
  ListPods,
  OpenExec,
  OpenPortForward,
} from "../wailsjs/go/app/App";
import { ActionPanel } from "@/components/ActionPanel";
import { ErrorAlert } from "@/components/ErrorAlert";
import { InfoPanel } from "@/components/InfoPanel";
import { SelectionPanel } from "@/components/SelectionPanel";
import { Separator } from "@/components/ui/separator";
import type { KubectlInfo } from "@/types";

function App() {
  const [info, setInfo] = useState<KubectlInfo | null>(null);
  const [error, setError] = useState("");

  const [contexts, setContexts] = useState<string[]>([]);
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [pods, setPods] = useState<string[]>([]);
  const [containers, setContainers] = useState<string[]>([]);

  const [selectedContext, setSelectedContext] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState("");
  const [selectedPod, setSelectedPod] = useState("");
  const [selectedContainer, setSelectedContainer] = useState("");

  const [localPort, setLocalPort] = useState("8080");
  const [remotePort, setRemotePort] = useState("80");
  const [execCommand, setExecCommand] = useState("sh");

  const [loading, setLoading] = useState({
    contexts: false,
    namespaces: false,
    pods: false,
    containers: false,
    portForward: false,
    exec: false,
  });

  useEffect(() => {
    let active = true;
    GetKubectlInfo()
      .then((res) => {
        if (active) setInfo(res);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : String(err));
        }
      });
    setLoading((prev) => ({ ...prev, contexts: true }));
    ListContexts()
      .then((res) => {
        if (active) setContexts(res);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : String(err));
        }
      })
      .finally(() => {
        if (active) {
          setLoading((prev) => ({ ...prev, contexts: false }));
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedContext) {
      return;
    }
    let active = true;
    setLoading((prev) => ({ ...prev, namespaces: true }));
    ListNamespaces(selectedContext)
      .then((res) => {
        if (active) setNamespaces(res);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : String(err));
        }
      })
      .finally(() => {
        if (active) {
          setLoading((prev) => ({ ...prev, namespaces: false }));
        }
      });
    return () => {
      active = false;
    };
  }, [selectedContext]);

  useEffect(() => {
    if (!selectedContext || !selectedNamespace) {
      return;
    }
    let active = true;
    setLoading((prev) => ({ ...prev, pods: true }));
    ListPods(selectedContext, selectedNamespace)
      .then((res) => {
        if (active) setPods(res);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : String(err));
        }
      })
      .finally(() => {
        if (active) {
          setLoading((prev) => ({ ...prev, pods: false }));
        }
      });
    return () => {
      active = false;
    };
  }, [selectedContext, selectedNamespace]);

  useEffect(() => {
    if (!selectedContext || !selectedNamespace || !selectedPod) {
      return;
    }
    let active = true;
    setLoading((prev) => ({ ...prev, containers: true }));
    ListContainers(selectedContext, selectedNamespace, selectedPod)
      .then((res) => {
        if (active) setContainers(res);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : String(err));
        }
      })
      .finally(() => {
        if (active) {
          setLoading((prev) => ({ ...prev, containers: false }));
        }
      });
    return () => {
      active = false;
    };
  }, [selectedContext, selectedNamespace, selectedPod]);

  const handleContextChange = (value: string) => {
    setSelectedContext(value);
    setSelectedNamespace("");
    setSelectedPod("");
    setSelectedContainer("");
    setNamespaces([]);
    setPods([]);
    setContainers([]);
  };

  const handleNamespaceChange = (value: string) => {
    setSelectedNamespace(value);
    setSelectedPod("");
    setSelectedContainer("");
    setPods([]);
    setContainers([]);
  };

  const handlePodChange = (value: string) => {
    setSelectedPod(value);
    setSelectedContainer("");
    setContainers([]);
  };

  const handlePortForward = async () => {
    setError("");
    if (!selectedContext || !selectedNamespace || !selectedPod) {
      setError("Select a context, namespace, and pod before port forwarding.");
      return;
    }
    const local = Number(localPort);
    const remote = Number(remotePort);
    if (!Number.isInteger(local) || !Number.isInteger(remote) || local <= 0 || remote <= 0) {
      setError("Ports must be positive integers.");
      return;
    }
    setLoading((prev) => ({ ...prev, portForward: true }));
    try {
      await OpenPortForward({
        context: selectedContext,
        namespace: selectedNamespace,
        pod: selectedPod,
        localPort: local,
        remotePort: remote,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading((prev) => ({ ...prev, portForward: false }));
    }
  };

  const handleExec = async () => {
    setError("");
    if (!selectedContext || !selectedNamespace || !selectedPod || !selectedContainer) {
      setError("Select a context, namespace, pod, and container before exec.");
      return;
    }
    setLoading((prev) => ({ ...prev, exec: true }));
    try {
      await OpenExec({
        context: selectedContext,
        namespace: selectedNamespace,
        pod: selectedPod,
        container: selectedContainer,
        command: execCommand,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading((prev) => ({ ...prev, exec: false }));
    }
  };

  const activeError = useMemo(() => {
    if (error) return error;
    if (info?.error) return info.error;
    return "";
  }, [error, info?.error]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--accent))_0%,_transparent_45%),radial-gradient(circle_at_bottom,_hsl(var(--primary))_0%,_transparent_40%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10">
        <header className="space-y-3">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.35em]">
            Kebac
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Kubectl helper workspace
          </h1>
          <p className="text-muted-foreground text-lg">
            Select a context, namespace, and pod, then launch a port-forward or
            exec terminal with a single click.
          </p>
        </header>

        <ErrorAlert message={activeError} />

        <InfoPanel info={info} />

        <Separator />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <SelectionPanel
            contexts={contexts}
            namespaces={namespaces}
            pods={pods}
            containers={containers}
            selectedContext={selectedContext}
            selectedNamespace={selectedNamespace}
            selectedPod={selectedPod}
            selectedContainer={selectedContainer}
            onContextChange={handleContextChange}
            onNamespaceChange={handleNamespaceChange}
            onPodChange={handlePodChange}
            onContainerChange={setSelectedContainer}
            loading={loading}
          />
          <ActionPanel
            context={selectedContext}
            namespace={selectedNamespace}
            pod={selectedPod}
            container={selectedContainer}
            localPort={localPort}
            remotePort={remotePort}
            execCommand={execCommand}
            onLocalPortChange={setLocalPort}
            onRemotePortChange={setRemotePort}
            onExecCommandChange={setExecCommand}
            onPortForward={handlePortForward}
            onExec={handleExec}
            busy={{ portForward: loading.portForward, exec: loading.exec }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
