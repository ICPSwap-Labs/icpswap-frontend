/* eslint-disable @typescript-eslint/no-empty-function */

import { type Channel, type JsonRequest, type JsonResponse, type JsonRPC, Transport } from "@slide-computer/signer";

type WalletChannelOptions = {
  sendMethod: (data: any) => Promise<JsonResponse>;
};

class WalletChannel implements Channel {
  closed = false;

  #listeners: ((response: JsonResponse) => void)[] = [];

  public sendMethod: (data: JsonRPC) => Promise<JsonResponse>;

  constructor(options: WalletChannelOptions) {
    this.sendMethod = options.sendMethod;
  }

  addEventListener(
    ...[event, listener]:
      | [event: "close", listener: () => void]
      | [event: "response", listener: (response: JsonResponse) => void]
  ) {
    switch (event) {
      case "close":
        return () => {};
      case "response":
        this.#listeners.push(listener);
        return () => {
          this.#listeners = this.#listeners.filter((list) => list !== listener);
        };
      default:
        return () => {};
    }
  }

  async send(request: JsonRequest): Promise<void> {
    const response = await this.sendMethod(request);
    this.#listeners.forEach((listener) => listener(response));
  }

  close(): Promise<void> {
    return Promise.resolve();
  }
}

export class PlugTransport implements Transport {
  establishChannel(): Promise<Channel> {
    const plugChannel = new WalletChannel({ sendMethod: (data) => window.ic.plug.request(data) });
    return Promise.resolve(plugChannel);
  }
}
