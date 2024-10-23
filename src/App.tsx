import "./App.css";
import { useRef } from "react";
import ResponsiveSVG from "./Utils/D3/ResponsiveSVG";
const log = console.log;
function App() {
  return (
    <>
      hi
      <ResponsiveSVG>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}></svg>
      </ResponsiveSVG>
    </>
  );
}

export default App;
