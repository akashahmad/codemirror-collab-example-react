import { useLayoutEffect, useRef, useState } from "react";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";

export const Editor = () => {
  const editorContainerRef = useRef(null);
  const [editor, setEditor] = useState<EditorView | null>(null);
  const [currentFilename, setCurrentFilename] = useState("main.js");
  const [files, setFiles] = useState<Record<string, string | undefined>>({
    "main.js": undefined,
    "app.js": undefined,
    "server.js": undefined,
    "api.js": undefined,
  });

  useLayoutEffect(() => {
    if (editorContainerRef.current) {
      if (editor) {
        editor?.destroy();
      }

      let state;
      if (files[currentFilename]) {
        state = EditorState.fromJSON(
          JSON.parse(files[currentFilename] as string),
          { extensions: [basicSetup, javascript()] }
        );
      } else {
        state = EditorState.create({
          doc: "",
          extensions: [basicSetup, javascript()],
        });
      }

      const view = new EditorView({
        state,
        parent: editorContainerRef.current,
      });

      view.focus();

      setEditor(view);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilename, editorContainerRef, files]);

  const handleTabClick = (filename: keyof typeof files) => {
    const currentState = JSON.stringify(editor?.state?.toJSON());
    files[currentFilename] = currentState;

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
      <div
        key={JSON.stringify(files)}
        style={{ padding: "10px 0px", display: "flex" }}
      >
        {Object.keys(files).map((filename) => (
          <button
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
            key={filename}
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
        key="editor"
        ref={editorContainerRef}
        style={{ height: "90vh", border: "1px solid #ccc" }}
      ></div>
    </div>
  );
};
