import { ViewPlugin, type EditorView, type ViewUpdate } from "@codemirror/view";
import {
  receiveUpdates,
  sendableUpdates,
  collab,
  getSyncedVersion,
} from "@codemirror/collab";
import { ChangeSet } from "@codemirror/state";
import type { TConnection, TUpdate } from "../types";

function pushUpdates(
  connection: TConnection,
  version: number,
  fullUpdates: TUpdate[],
  fileName: string
) {
  const updates: TUpdate[] = fullUpdates.map((u) => ({
    clientID: u.clientID,
    changes: u.changes.toJSON(),
  }));
  return connection.request({
    type: "pushUpdates",
    version,
    updates,
    fileName,
  });
}

function pullUpdates(
  connection: TConnection,
  version: number,
  fileName: string
) {
  return connection
    .request({ type: "pullUpdates", version, fileName })
    .then((updates) => {
      if ("version" in updates) return updates;

      return updates.map((u) => ({
        changes: ChangeSet.fromJSON(u.changes),
        clientID: u.clientID,
      }));
    });
}

export const getPeerExtension = (
  startVersion: number | undefined,
  connection: TConnection,
  fileName: string
) => {
  const plugin = ViewPlugin.fromClass(
    class {
      pushing = false;
      done = false;
      view: EditorView;

      constructor(view: EditorView) {
        this.view = view;
        this.pull();
      }

      update(update: ViewUpdate) {
        if (update.docChanged) {
          this.push();
        }
      }

      async push() {
        const updates = sendableUpdates(this.view.state);
        if (this.pushing || !updates.length) {
          return;
        }
        this.pushing = true;
        const version = getSyncedVersion(this.view.state);
        await pushUpdates(
          connection,
          version,
          updates as unknown as TUpdate[],
          fileName
        );
        this.pushing = false;

        if (sendableUpdates(this.view.state).length) {
          setTimeout(() => this.push(), 100);
        }
      }

      async pull() {
        while (!this.done) {
          const version = getSyncedVersion(this.view.state);
          const updates = await pullUpdates(connection, version, fileName);

          if (updates && !("version" in updates)) {
            this.view.dispatch(receiveUpdates(this.view.state, updates));
          }
        }
      }

      destroy() {
        this.done = true;
      }
    }
  );
  return [collab({ startVersion }), plugin];
};
