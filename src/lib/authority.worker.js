import { ChangeSet, Text } from "@codemirror/state";

const store = {
  "main.js": {
    version: 0,
    doc: Text.of(["initial content"]),
    updates: [],
    pending: [],
  },
  "app.js": {
    version: 0,
    doc: Text.of(["initial content"]),
    updates: [],
    pending: [],
  },
  "server.js": {
    version: 0,
    doc: Text.of(["initial content"]),
    updates: [],
    pending: [],
  },
  "api.js": {
    version: 0,
    doc: Text.of(["initial content"]),
    updates: [],
    pending: [],
  },
};

onmessage = function (event) {
  function resp(value) {
    event.ports[0].postMessage(JSON.stringify(value));
  }
  const data = event.data;
  console.log({ data });
  if (data.type === "pullUpdates") {
    if (data.version < store[data.fileName].updates.length) {
      resp(store[data.fileName].updates.slice(data.version));
    } else {
      store[data.fileName].pending.push(resp);
    }
  } else if (data.type === "pushUpdates") {
    if (data.version !== store[data.fileName].updates.length) {
      resp(false);
    } else {
      for (let update of data.updates) {
        console.log({ update });
        const changes = ChangeSet.fromJSON(update.changes);
        store[data.fileName].updates.push({
          changes,
          clientID: update.clientID,
        });

        store[data.fileName].doc = changes.apply(store[data.fileName].doc);
      }
      resp(true);
      while (store[data.fileName].pending.length) {
        store[data.fileName].pending.pop()(data.updates);
      }
    }
  } else if (data.type === "getDocument") {
    resp({
      version: store[data.fileName].updates.length,
      doc: store[data.fileName].doc.toString(),
    });
  }
};
