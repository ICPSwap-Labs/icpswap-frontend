import { PositionTransactionsStorageFactory, PositionTransactionsStorage } from "@icpswap/candid";
import { actor } from "../actor";


export const positionTransactionsStorage = (id: string) =>
  actor.create<PositionTransactionsStorage>({
    idlFactory: PositionTransactionsStorageFactory,
    canisterId: id,
  });
