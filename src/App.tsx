import "./App.css";
import { range } from "./Utils/Linq/Enumerable-Interfaces";

function App() {
  const arr = [
    range(0, 10).toDictionary(x => x).toObject(),
  ]
  return (
    <>
    {
      arr.map((lst, i) => <pre key={i}>{JSON.stringify(lst, null, 2)}</pre>)
    }
    </>
  );
}

export default App;
