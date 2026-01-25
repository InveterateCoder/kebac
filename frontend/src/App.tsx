import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GetKubectlInfo,
  ListContainers,
  ListContexts,
  ListNamespaces,
  ListPods,
  OpenExec,
  OpenPortForward,
} from "../wailsjs/go/app/App";
import {
  WindowGetSize,
  WindowIsMaximised,
  WindowMaximise,
  WindowSetSize,
} from "../wailsjs/runtime/runtime";
import { ActionPanel } from "@/components/ActionPanel";
import { ErrorAlert } from "@/components/ErrorAlert";
import { HistoryPanel } from "@/components/HistoryPanel";
import { InfoPanel } from "@/components/InfoPanel";
import { SelectionPanel } from "@/components/SelectionPanel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { HistoryEntry, KubectlInfo } from "@/types";
import { MoonStar, Sun } from "lucide-react";

type AlertItem = {
  id: number;
  message: string;
};

const HISTORY_STORAGE_KEY = "kebac.history.v1";
const THEME_STORAGE_KEY = "kebac.theme";
const WINDOW_STORAGE_KEY = "kebac.window.v1";
const HISTORY_LIMIT = 50;

function App() {
  const [info, setInfo] = useState<KubectlInfo | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const alertIdRef = useRef(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const [contexts, setContexts] = useState<string[]>([]);
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [pods, setPods] = useState<string[]>([]);
  const [containers, setContainers] = useState<string[]>([]);

  const [selectedContext, setSelectedContext] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState("");
  const [selectedPod, setSelectedPod] = useState("");
  const [selectedContainer, setSelectedContainer] = useState("");

  const [localPort, setLocalPort] = useState("5432");
  const [remotePort, setRemotePort] = useState("5432");
  const [execCommand, setExecCommand] = useState("");

  const [loading, setLoading] = useState({
    contexts: false,
    namespaces: false,
    pods: false,
    containers: false,
    portForward: false,
    exec: false,
  });

  const pushAlert = useCallback((message: string) => {
    if (!message) return;
    setAlerts((prev) => {
      const nextId = alertIdRef.current + 1;
      alertIdRef.current = nextId;
      return [...prev, { id: nextId, message }];
    });
  }, []);

  const dismissAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const recordHistory = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => [entry, ...prev].slice(0, HISTORY_LIMIT));
  }, []);

  const createHistoryId = useCallback(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as HistoryEntry[];
      if (Array.isArray(parsed)) {
        setHistory(parsed);
      }
    } catch {
      // Ignore malformed history.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(WINDOW_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          w?: number;
          h?: number;
          maximised?: boolean;
        };
        if (typeof parsed.w === "number" && typeof parsed.h === "number") {
          WindowSetSize(parsed.w, parsed.h);
        }
        if (parsed.maximised) {
          WindowMaximise();
        }
      } catch {
        // Ignore malformed window state.
      }
    }

    let timer: number | undefined;
    const handleResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(async () => {
        try {
          const size = await WindowGetSize();
          const maximised = await WindowIsMaximised();
          window.localStorage.setItem(
            WINDOW_STORAGE_KEY,
            JSON.stringify({ ...size, maximised }),
          );
        } catch {
          // Ignore runtime errors (window may not be ready yet).
        }
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    let active = true;
    GetKubectlInfo()
      .then((res) => {
        if (active) setInfo(res);
      })
      .catch((err) => {
        if (active) {
          pushAlert(err instanceof Error ? err.message : String(err));
        }
      });
    setLoading((prev) => ({ ...prev, contexts: true }));
    ListContexts()
      .then((res) => {
        if (active) {
          setContexts(res);
          if (res.length === 1) {
            setSelectedContext(res[0]);
          }
        }
      })
      .catch((err) => {
        if (active) {
          pushAlert(err instanceof Error ? err.message : String(err));
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
  }, [pushAlert]);

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
          pushAlert(err instanceof Error ? err.message : String(err));
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
  }, [pushAlert, selectedContext]);

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
          pushAlert(err instanceof Error ? err.message : String(err));
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
  }, [pushAlert, selectedContext, selectedNamespace]);

  useEffect(() => {
    if (!selectedContext || !selectedNamespace || !selectedPod) {
      return;
    }
    let active = true;
    setLoading((prev) => ({ ...prev, containers: true }));
    ListContainers(selectedContext, selectedNamespace, selectedPod)
      .then((res) => {
        if (active) {
          setContainers(res);
          if (res.length === 1) {
            setSelectedContainer(res[0]);
          }
        }
      })
      .catch((err) => {
        if (active) {
          pushAlert(err instanceof Error ? err.message : String(err));
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
  }, [pushAlert, selectedContext, selectedNamespace, selectedPod]);

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
    if (!selectedContext || !selectedNamespace || !selectedPod) {
      pushAlert("Select a context, namespace, and pod before port forwarding.");
      return;
    }
    const local = Number(localPort);
    const remote = Number(remotePort);
    if (
      !Number.isInteger(local) ||
      !Number.isInteger(remote) ||
      local <= 0 ||
      remote <= 0
    ) {
      pushAlert("Ports must be positive integers.");
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
      recordHistory({
        id: createHistoryId(),
        kind: "port-forward",
        context: selectedContext,
        namespace: selectedNamespace,
        pod: selectedPod,
        localPort: local,
        remotePort: remote,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      pushAlert(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading((prev) => ({ ...prev, portForward: false }));
    }
  };

  const handleExec = async () => {
    if (
      !selectedContext ||
      !selectedNamespace ||
      !selectedPod ||
      !selectedContainer
    ) {
      pushAlert("Select a context, namespace, pod, and container before exec.");
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
      recordHistory({
        id: createHistoryId(),
        kind: "exec",
        context: selectedContext,
        namespace: selectedNamespace,
        pod: selectedPod,
        container: selectedContainer,
        command: execCommand,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      pushAlert(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading((prev) => ({ ...prev, exec: false }));
    }
  };

  const handleReplay = useCallback(
    async (entry: HistoryEntry) => {
      try {
        if (entry.kind === "port-forward") {
          if (!entry.localPort || !entry.remotePort) {
            pushAlert("History entry is missing port information.");
            return;
          }
          await OpenPortForward({
            context: entry.context,
            namespace: entry.namespace,
            pod: entry.pod,
            localPort: entry.localPort,
            remotePort: entry.remotePort,
          });
        } else {
          await OpenExec({
            context: entry.context,
            namespace: entry.namespace,
            pod: entry.pod,
            container: entry.container || "",
            command: entry.command || "",
          });
        }
      } catch (err) {
        pushAlert(err instanceof Error ? err.message : String(err));
      }
    },
    [pushAlert],
  );

  const blockReason = useMemo(() => {
    if (info?.error) return info.error;
    if (!info) return "";
    if (!info.kubectlPath && !info.kubeloginPath) {
      return "kubectl and kubectl-oidc_login plugin were not detected.";
    }
    if (!info.kubectlPath) {
      return "kubectl was not detected on this machine.";
    }
    if (!info.kubeloginPath) {
      return "kubectl-oidc_login plugin was not detected.";
    }
    return "";
  }, [info]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(var(--accent))_0%,transparent_45%),radial-gradient(circle_at_bottom,hsl(var(--primary))_0%,transparent_40%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10">
        {alerts.length ? (
          <div className="pointer-events-none fixed right-6 top-6 z-50 flex w-full max-w-sm flex-col gap-3">
            {alerts.map((alert) => (
              <ErrorAlert
                key={alert.id}
                message={alert.message}
                onClose={() => dismissAlert(alert.id)}
                className="pointer-events-auto shadow-lg"
              />
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.35em]">
              Kebac
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <MoonStar className="h-4 w-4" />
            )}
          </Button>
        </div>

        <InfoPanel info={info} blockReason={blockReason} />

        <Separator />

        <Tabs defaultValue="history" className="w-full">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
          </TabsList>
          <TabsContent value="history" className="mt-6">
            <HistoryPanel
              entries={history}
              onReplay={handleReplay}
              onRemove={(id) =>
                setHistory((prev) => prev.filter((entry) => entry.id !== id))
              }
              onClear={() => setHistory([])}
            />
          </TabsContent>
          <TabsContent value="workspace" className="mt-6">
            {blockReason ? (
              <Card className="bg-card/80">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    Resolve errors to continue
                  </CardTitle>
                  <CardDescription>
                    Fix the issue above to unlock context and pod selection.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  Once the error is resolved, restart the app or re-open this
                  window.
                </CardContent>
              </Card>
            ) : (
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
                  busy={{
                    portForward: loading.portForward,
                    exec: loading.exec,
                  }}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
