import type { Update } from "@codemirror/collab";
import type { useConnection } from "./hooks/useConnection";

export interface TReqPayload {
  type: "pushUpdates" | "pullUpdates" | "getDocument";
  version?: number;
  updates?: Update[];
  fileName?: string;
}

export interface TDisconnected {
  wait?: Promise<unknown>;
  resolve?: () => void;
}

export type TUpdate = Update;
export type TConnection = ReturnType<typeof useConnection>;
