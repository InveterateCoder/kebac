import { useEffect, useState } from "react";
import { GetKubectlInfo } from "../wailsjs/go/app/App";
import type { command } from "wailsjs/go/models";

function App() {
  const [info, setInfo] = useState<command.CommandInfo | null>(null);
  const [err, setErr] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (info) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsReady(
        !!err && !!info.kubectlPath && !!info.kubectlPath && !info.error,
      );
    }
  }, [info, err]);

  useEffect(() => {
    let alive = true;
    GetKubectlInfo()
      .then((res) => {
        if (alive) setInfo(res);
      })
      .catch((err) => {
        if (alive) {
          setErr(err.message);
        }
      });
    return () => {
      alive = false;
    };
  });

  return (
    <div className="mx-auto h-screen max-w-7xl px-4">
      <div className="flex flex-col gap-3">
        <div className="flex-1">{info?.kubectlPath}</div>
        <div className="flex flex-row gap-3">
          <div className="flex-1">1</div>
          <div className="flex-1">1</div>
        </div>
        <div className="flex-1">3</div>
      </div>
    </div>
  );
}

export default App;
