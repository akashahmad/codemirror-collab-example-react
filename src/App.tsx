import { Routes, Route, Link } from "react-router-dom";

import { Editor, MultiInstanceEditor } from "./components";

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
  const singleInstanceEditor = location.href.includes("single");
  const multiInstanceEditor = location.href.includes("multi");

  if (singleInstanceEditor) {
    return <Editor />;
  }

  if (multiInstanceEditor) {
    return <MultiInstanceEditor />;
  }

  return (
    <>
      <Routes>
        <Route path="/single" element={<Editor />} />
        <Route path="/multi" element={<MultiInstanceEditor />} />
        <Route path="/" element={<Fallback />} />
      </Routes>
    </>
  );
};

export default App;
