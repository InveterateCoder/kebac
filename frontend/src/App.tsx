import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="mx-auto h-screen max-w-7xl px-4">
      <h1 className="">Kebac</h1>
      <Button onClick={() => alert("Working")}>Working</Button>
    </div>
  );
}

export default App;
