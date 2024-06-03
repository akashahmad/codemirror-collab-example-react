import { Editor, MultiInstanceEditor } from "./components";

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
    <div>
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
          <button onClick={() => (location.href = "/multi")}>
            Multi Instance Editor
          </button>
          &nbsp;&nbsp;
          <button onClick={() => (location.href = "/single")}>
            Single Instance Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
