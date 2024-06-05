import { useCallback, useState } from "react";
import { MultiInstanceEditor as Editor } from "../../components";
import { getPeerExtension } from "../../utils/peerExtension";
import { useConnection } from "../../hooks/useConnection";

import { Text } from "@codemirror/state";

const WORKER_PATH = "../../lib/authority.worker.js";
const worker = new Worker(new URL(WORKER_PATH, import.meta.url), {
  type: "module",
});

export const MultiInstanceEditor = () => {
  const [files, setFiles] = useState<Record<string, string | undefined>>({
    "main.js": undefined,
    "app.js": undefined,
    "server.js": undefined,
    "api.js": undefined,
  });
  const [activeFileName, setActiveFileName] =
    useState<keyof typeof files>("main.js");

  const handleTabClick = useCallback((filename: keyof typeof files) => {
    setActiveFileName(filename);
  }, []);

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
      <div style={{ height: "45vh" }}>
        <Editor
          files={files}
          initialDocument={Text.of(["initial content"])}
          peerExtension={peerExtensionA}
          currentFilename={activeFileName}
          handleCloseFile={handleCloseFile}
          handleTabClick={handleTabClick}
        />
      </div>

      <div>
        <h2 style={{ lineHeight: 0, zIndex: 100 }}>Peer B</h2>
        <Editor
          files={files}
          initialDocument={Text.of(["initial content"])}
          peerExtension={peerExtensionB}
          currentFilename={activeFileName}
          handleCloseFile={handleCloseFile}
          handleTabClick={handleTabClick}
        />
      </div>
    </div>
  );
};
