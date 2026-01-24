import { useEffect, useState } from "react";
import { GetKubectlPath } from "../wailsjs/go/app/App";

function App() {
  const [path, setPath] = useState("");

  useEffect(() => {
    let alive = true;
    GetKubectlPath()
      .then((res) => {
        if (alive) setPath(res);
      })
      .catch((err) => {
        if (alive) {
          setPath(err.message);
        }
      });
    return () => {
      alive = false;
    };
  });
  return (
    <div className="mx-auto h-screen max-w-7xl px-4">
      <div className="flex flex-col gap-3">
        <div className="flex-1">{path}</div>
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
