import { useLayoutEffect, useState } from "react";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";

export const MultiInstanceEditor = () => {
  const [currentFilename, setCurrentFilename] = useState("main.js");
  const [initialized, setInitialized] = useState<string[]>([]);
  const [files, setFiles] = useState<Record<string, string | undefined>>({
    "main.js": undefined,
    "app.js": undefined,
    "server.js": undefined,
    "api.js": undefined,
  });

  useLayoutEffect(() => {
    if (initialized.includes(currentFilename)) return;

    const editorParent = document.getElementById(currentFilename);
    if (editorParent) {
      const state = EditorState.create({
        doc: "",
        extensions: [basicSetup, javascript()],
      });

      new EditorView({
        state,
        parent: editorParent,
      });
    }

    setInitialized([...initialized, currentFilename]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilename]);

  const handleTabClick = (filename: keyof typeof files) => {
    setCurrentFilename(filename);
  };

  const handleCloseFile = (filename: keyof typeof files) => {
    delete files[filename];

    if (currentFilename === filename) {
      setCurrentFilename(Object.keys(files)[0]);
    }
    setFiles({ ...files });
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        {Object.keys(files).map((filename) => (
          <button
            key={filename}
            style={{
              marginRight: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border:
                currentFilename === filename
                  ? "2px solid red"
                  : "1px solid #ccc",
            }}
            onClick={() => handleTabClick(filename)}
          >
            <span>{filename}</span>
            <span
              onClick={() => handleCloseFile(filename)}
              style={{
                marginLeft: "10px",
                color: "red",
                padding: 4,
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              x
            </span>
          </button>
        ))}
      </div>
      <div
        key={JSON.stringify(files)}
        style={{ padding: "10px 0px", display: "flex" }}
      >
        {Object.keys(files).map((filename) => (
          <div
            key={filename}
            style={{
              width: "100%",
              display: currentFilename === filename ? "flex" : "none",
              flexDirection: "column",
            }}
          >
            <div
              key={filename}
              id={filename}
              style={{
                height: "90vh",
                width: "99vw",
                border: "1px solid #ccc",
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};
