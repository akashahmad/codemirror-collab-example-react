self.onmessage = function (event) {
  const { type, data } = event.data;

  switch (type) {
    case "init":
      self.files = {};
      self.peers = [];
      break;
    case "open":
      if (!self.files[data.filename]) {
        self.files[data.filename] = {
          version: 0,
          content: "Initial File Content",
          updates: [],
        };
      }
      self.postMessage({
        type: "fileOpened",
        data: {
          filename: data.filename,
          content: self.files[data.filename].content,
          version: self.files[data.filename].version,
        },
      });
      break;
    case "update":
      const file = self.files[data.filename];
      file.version += 1;
      file.content = data.content;
      file.updates.push(data.update);
      self.peers.forEach((peer) => {
        peer.postMessage({
          type: "update",
          data: {
            filename: data.filename,
            update: data.update,
            version: file.version,
          },
        });
      });
      break;
    case "register":
      self.peers.push(event.ports[0]);
      event.ports[0].onmessage = self.onmessage;
      break;
  }
};
