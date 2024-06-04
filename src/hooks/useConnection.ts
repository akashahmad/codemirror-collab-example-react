import { useState } from "react";
import type { TDisconnected, TReqPayload, TUpdate } from "../types";

function pause(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const useConnection = (worker: Worker, latency: number) => {
  const [disconnected, setDisconnected] = useState<TDisconnected | null>(null);

  const _request = (
    value: TReqPayload
  ): Promise<TUpdate[] | { version: number; doc: string }> => {
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port2.onmessage = (event) => resolve(JSON.parse(event.data));
      worker.postMessage(value, [channel.port1]);
    });
  };

  const request = async (value: TReqPayload) => {
    await (disconnected ? disconnected.wait : pause(latency));
    const result = await _request(value);
    await (disconnected ? disconnected.wait : pause(latency));
    return result;
  };

  const setConnected = (value: boolean): void => {
    if (value && disconnected) {
      disconnected.resolve?.();
      setDisconnected(null);
    } else if (!value && !disconnected) {
      let resolve: () => void = () => {};
      const wait: Promise<void> = new Promise((resolvePromise) => {
        resolve = resolvePromise;
      });
      setDisconnected({ wait, resolve });
    }
  };

  return {
    request,
    setConnected,
  };
};
