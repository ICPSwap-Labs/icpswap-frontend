import { HttpAgent, ActorSubclass } from "@dfinity/agent";
import { ActorIdentity } from "@icpswap/types";
import { IDL } from "@dfinity/candid";
import { ic_host } from "@icpswap/constants";
import isObject from "lodash/isObject";

import { ActorName } from "./ActorName";
import { createBaseActor } from "./BaseActor";

let cachedCanisterIds: { [key: string]: string } = {};

export type ActorConstructor = {
  canisterId?: string;
  actorName?: ActorName;
  host?: string;
  idlFactory: IDL.InterfaceFactory;
  identity?: ActorIdentity;
  agent?: HttpAgent;
};

export enum Connector {
  ICPSwap = "ICPSwap",
  PLUG = "PLUG",
  STOIC = "STOIC",
  IC = "IC",
  NFID = "NFID",
  INFINITY = "INFINITY",
  ME = "ME",
  Metamask = "MetaMask",
  Oisy = "Oisy",
}

export function isICConnector(connector: Connector) {
  return connector === Connector.IC || connector === Connector.STOIC || connector === Connector.NFID;
}

export type ActorError = {
  canisterId: string;
  message: string;
  method: string;
};
export type ActorErrorCallback = (error: ActorError) => void;
export type BeforeSubmitArgs = {
  canisterId: string;
  method: string;
  identity: ActorIdentity | undefined;
  connector: Connector;
};
export type BeforeSubmitCallback = (args: BeforeSubmitArgs) => Promise<{ success: boolean; message: string }>;

export function isPlugTypeConnector(connector: Connector) {
  return connector === Connector.PLUG || connector === Connector.INFINITY;
}

export function isMeConnector(connector: Connector) {
  return connector === Connector.ME;
}

export class Actor {
  private connector: Connector = Connector.ICPSwap;

  private host: string = ic_host;

  private errorCallbacks: ActorErrorCallback[] = [];

  private beforeSubmit: BeforeSubmitCallback;

  public log = process.env.REACT_APP_ENV === "development";

  public setConnector(connector: Connector) {
    this.connector = connector;
  }

  public async create<T>({
    canisterId,
    host,
    idlFactory,
    identity,
    actorName,
  }: ActorConstructor): Promise<ActorSubclass<T>> {
    let id = canisterId;
    if (!id && actorName) id = cachedCanisterIds[actorName];
    if (!id) throw new Error("No canister id");

    const __host = host ?? this.host;

    const isRejected = false;

    const serviceClass = idlFactory({ IDL });

    let actor: ActorSubclass<T> | null = null;

    // catch create infinity actor rejected
    let createActorError: null | string = null;

    if (identity) {
      try {
        actor = await window.icConnector.createActor<T>({
          canisterId: id,
          interfaceFactory: idlFactory,
        });
      } catch (error) {
        createActorError = String(error);
      }
    } else {
      actor = await createBaseActor<T>({
        canisterId: id,
        interfaceFactory: idlFactory,
        agent: this.AnonymousAgent(__host),
        fetchRootKey: __host !== ic_host,
      });
    }

    const _actor: any = {};

    serviceClass._fields.forEach((ele) => {
      const key = ele[0];

      _actor[key] = async (...args) => {
        if (createActorError)
          return {
            err: `${createActorError}. Please try reconnecting your wallet and ensure the account inside matches the account displayed on the ICPSwap page.`,
          };

        if (isRejected) {
          return {
            err: "The agent creation was rejected. Please try reconnecting your wallet and ensure the account inside matches the account displayed on the ICPSwap page.",
          };
        }

        try {
          if (!actor) return { err: "no actor" };

          if (this.beforeSubmit) {
            const checkResult = await this.beforeSubmit({
              canisterId: id,
              method: key,
              identity,
              connector: this.connector,
            });

            if (checkResult.success === false) {
              return { err: checkResult.message };
            }
          }

          const result = actor[key](...args) as Promise<any>;
          return await result;
        } catch (error) {
          let message = "";

          if (isObject(error)) {
            if ("message" in error) {
              message = error.message as string;
            } else {
              message = JSON.stringify(error);
            }
          } else {
            const __error = String(error);

            if (__error.includes("Reject text:")) {
              const _message = __error.split(`Reject text: `)[1]?.split(" at") ?? "";
              message = _message ? _message[0]?.trim() : __error;
            } else {
              const _message = __error.includes(`"Message"`) ? __error.split(`"Message": `)[1]?.split('"') : "";
              message = __error.includes(`"Message"`) && !!_message ? _message[1] : __error;
            }
          }

          if (this.log) {
            console.log("Actor =====================>");
            console.log("canister: ", id);
            console.log("method: ", key);
            console.log("rejected: ", message);
            console.log("Actor =====================>");
          }

          this.errorCallbacks.forEach((call) => {
            call({ canisterId: id ?? "", method: key, message });
          });

          return { err: message };
        }
      };
    });

    return _actor as ActorSubclass<T>;
  }

  public AnonymousAgent(host?: string) {
    return HttpAgent.createSync({
      host: host ?? this.host,
      // "Timestamp failed to pass the watermark after retrying the configured multiple times.
      // We cannot guarantee the integrity of the response since it could be a replay attack."
      // https://forum.dfinity.org/t/error-occurs-during-intensive-download-requests-involving-multiple-canisters/47942
      retryTimes: 1000,
    });
  }

  public setHost(host: string) {
    this.host = host;
  }

  public static setActorCanisterIds(canisterIds: { [key: string]: string }) {
    cachedCanisterIds = canisterIds;
  }

  public onError(callback: ActorErrorCallback) {
    this.errorCallbacks.push(callback);
  }

  public onSubmit(callback: BeforeSubmitCallback) {
    this.beforeSubmit = callback;
  }

  public setLog(log: boolean) {
    this.log = log;
  }
}

export const actor = new Actor();
