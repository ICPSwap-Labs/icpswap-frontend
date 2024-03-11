import { HttpAgent, ActorSubclass } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";

declare module "toformat";

declare global {
  interface Window {
    ic: {
      plug: {
        createAgent: ({
          whitelist,
          host,
        }: {
          whitelist: string[];
          host: string;
        }) => Promise<boolean>;
        agent: HttpAgent;
        requestConnect: ({
          whitelist,
        }: {
          whitelist?: string[];
        }) => Promise<any>;
        fetchRootKey: () => Promise<void>;
        createActor: <T>({
          canisterId,
          interfaceFactory,
        }: {
          canisterId: string;
          interfaceFactory: IDL.InterfaceFactory;
        }) => Promise<ActorSubclass<T>>;
      };
      infinityWallet: {
        requestConnect: ({
          whitelist,
        }: {
          whitelist?: string[];
        }) => Promise<any>;
        createActor: <T>({
          canisterId,
          interfaceFactory,
        }: {
          canisterId: string;
          interfaceFactory: IDL.InterfaceFactory;
        }) => Promise<ActorSubclass<T>>;
      };
    };
    icConnector: {
      httpAgent: HttpAgent;
      createActor: <T>({
        canisterId,
        interfaceFactory,
      }: {
        canisterId: string;
        interfaceFactory: IDL.InterfaceFactory;
      }) => Promise<ActorSubclass<T>>;
    };
  }
}
