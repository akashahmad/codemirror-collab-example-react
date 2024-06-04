import { useCallback, useState } from "react";
import { Editor } from "../../components";
import { getPeerExtension } from "../../utils/peerExtension";
import { useConnection } from "../../hooks/useConnection";

import { Text } from "@codemirror/state";

const WORKER_PATH = "../../lib/authority.worker.js";
const worker = new Worker(new URL(WORKER_PATH, import.meta.url), {
  type: "module",
});

export const SingleInstanceEditor = () => {
  const [files, setFiles] = useState<Record<string, string | undefined>>({
    "main.js": undefined,
    "app.js": undefined,
    "server.js": undefined,
    "api.js": undefined,
  });
  const [activeFileName, setActiveFileName] =
    useState<keyof typeof files>("main.js");

  const handleTabClick = useCallback(
    (filename: keyof typeof files, editorStateInJSON: string) => {
      setFiles({ ...files, [activeFileName]: editorStateInJSON });

      setActiveFileName(filename);
    },
    [activeFileName, files]
  );

  const handleCloseFile = useCallback(
    (filename: keyof typeof files) => {
      delete files[filename];

      if (activeFileName === filename) {
        setActiveFileName("main.js");
      }
      setFiles({ ...files });
    },
    [activeFileName, files]
  );

  const initialVersion = 0;

  const connectionA = useConnection(worker, 200);
  const connectionB = useConnection(worker, 200);

  const peerExtensionA = (fileName: string) =>
    getPeerExtension(initialVersion, connectionA, fileName);
  const peerExtensionB = (fileName: string) =>
    getPeerExtension(initialVersion, connectionB, fileName);

  return (
    <div>
      <h2 style={{ lineHeight: 0 }}>Peer A</h2>
      <Editor
        files={files}
        initialDocument={Text.of(["initial content"])}
        // savedState={files[activeFileName]}
        peerExtension={peerExtensionA}
        currentFilename={activeFileName}
        handleCloseFile={handleCloseFile}
        handleTabClick={handleTabClick}
      />
      <h2 style={{ lineHeight: 0 }}>Peer B</h2>
      <Editor
        files={files}
        initialDocument={Text.of(["initial content"])}
        // savedState={files[activeFileName]}
        peerExtension={peerExtensionB}
        currentFilename={activeFileName}
        handleCloseFile={handleCloseFile}
        handleTabClick={handleTabClick}
      />
    </div>
  );
};
