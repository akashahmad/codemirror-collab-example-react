import React, { useLayoutEffect, useRef, useState, type FC } from "react";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { EditorState, Text, type Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";

interface EditorProps {
  initialDocument: string | Text | undefined;
  peerExtension: (fileName: string) => Extension;
  currentFilename: string;
  files: Record<string, string | undefined>;
  handleTabClick: (filename: string, editorStateInJSON: string) => void;
  handleCloseFile: (filename: string) => void;
  savedState?: string;
}

export const Editor: FC<EditorProps> = React.memo(
  ({
    initialDocument,
    peerExtension,
    currentFilename,
    files,
    handleCloseFile,
    handleTabClick,
    savedState,
  }) => {
    const editorContainerRef = useRef(null);

    const [editor, setEditor] = useState<EditorView | null>(null);

    const extensions = [
      basicSetup,
      javascript({ typescript: true, jsx: true }),
      peerExtension(currentFilename),
    ];

    useLayoutEffect(() => {
      if (editorContainerRef.current) {
        if (editor) {
          editor?.destroy();
        }

        let state;
        if (savedState) {
          state = EditorState.fromJSON(JSON.parse(savedState), {
            extensions,
          });
        } else {
          state = EditorState.create({
            doc: initialDocument,
            extensions,
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
              onClick={() =>
                handleTabClick(
                  filename,
                  JSON.stringify(editor?.state?.toJSON())
                )
              }
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
          style={{ height: "35vh", border: "1px solid #ccc" }}
        ></div>
      </div>
    );
  }
);
