import { type ExchangeRate, ExchangeRateInterfaceFactory } from "@icpswap/candid";
import { actor } from "../actor";

export const exchangeRate = () =>
  actor.create<ExchangeRate>({
    canisterId: "2ixw4-taaaa-aaaag-qcpdq-cai",
    idlFactory: ExchangeRateInterfaceFactory,
  });
