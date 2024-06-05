import React, { useLayoutEffect, useState, type FC } from "react";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { EditorState, type Extension, type Text } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";

interface MultiInstanceProps {
  initialDocument: string | Text | undefined;
  peerExtension: (fileName: string) => Extension;
  currentFilename: string;
  files: Record<string, string | undefined>;
  handleTabClick: (filename: string) => void;
  handleCloseFile: (filename: string) => void;
  savedState?: string;
}

export const MultiInstanceEditor: FC<MultiInstanceProps> = React.memo(
  ({
    initialDocument,
    peerExtension,
    currentFilename,
    files,
    handleCloseFile,
    handleTabClick,
  }) => {
    const [initialized, setInitialized] = useState<string[]>([]);

    useLayoutEffect(() => {
      if (initialized.includes(currentFilename)) return;

      const editorParent = document.getElementById(currentFilename);
      if (editorParent) {
        const state = EditorState.create({
          doc: initialDocument,
          extensions: [
            basicSetup,
            javascript(),
            peerExtension(currentFilename),
          ],
        });

        new EditorView({
          state,
          parent: editorParent,
        });
      }

      setInitialized([...initialized, currentFilename]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFilename]);

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
                zIndex: 100,
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
                // width: "99vw",
                position: "relative",
                display: currentFilename === filename ? "flex" : "none",
                flexDirection: "column",
              }}
            >
              <div
                key={filename}
                id={filename}
                style={{
                  height: "35vh",
                  width: "90vw",
                  left: 0,
                  border: "1px solid #ccc",
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
