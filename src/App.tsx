import { Routes, Route, Link } from "react-router-dom";

import { MultiInstanceEditor } from "./pages/multi";
import { SingleInstanceEditor } from "./pages/single";

const Fallback = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        height: "90vh",
        width: "100%",
        textAlign: "center",
      }}
    >
      <div>
        <h1>Codemirror MultiTab Editors</h1>
      </div>
      <div>
        <Link to="/multi">Multi Instance Editor</Link>&nbsp;&nbsp;
        <Link to="/single">Single Instance Editor</Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/single" element={<SingleInstanceEditor />} />
        <Route path="/multi" element={<MultiInstanceEditor />} />
        <Route path="/" element={<Fallback />} />
      </Routes>
    </>
  );
};

export default App;
